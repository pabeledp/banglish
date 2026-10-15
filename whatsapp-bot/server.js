require('dotenv').config();

const express = require('express');
const db = require('./db');
const { generateSupportResponse, FALLBACK_MESSAGE } = require('./gemini');
const { sendWhatsAppMessage, markMessageAsRead } = require('./whatsapp');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.json());

// Request logger for incoming webhook events
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Banglish WhatsApp Customer Support Bot',
    website: 'https://banglish.bd',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

/**
 * GET /webhook: Meta Webhook Verification
 * Meta sends a GET request to verify the webhook endpoint URL and verify_token
 */
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.WEBHOOK_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === 'subscribe' && token === expectedToken) {
      console.log('🎉 Webhook verified successfully by Meta!');
      return res.status(200).send(challenge);
    } else {
      console.warn('⚠️ Webhook verification failed. Token mismatch or invalid mode.');
      return res.sendStatus(403);
    }
  }

  return res.sendStatus(400);
});

/**
 * POST /webhook: Incoming WhatsApp Cloud API Messages
 * Handles customer queries, saves conversation history, calls Gemini 1.5 Flash, and replies back.
 */
app.post('/webhook', (req, res) => {
  // 1. Immediately acknowledge Meta with 200 OK to prevent retries
  res.sendStatus(200);

  // 2. Process message asynchronously in background
  handleIncomingWebhook(req.body).catch((err) => {
    console.error('❌ Error handling incoming webhook payload:', err.message || err);
  });
});

/**
 * Asynchronous worker for processing incoming WhatsApp events
 */
async function handleIncomingWebhook(body) {
  if (body.object !== 'whatsapp_business_account') {
    return;
  }

  const entries = body.entry || [];
  for (const entry of entries) {
    const changes = entry.changes || [];
    for (const change of changes) {
      const value = change.value;
      if (!value) continue;

      // Ignore delivery receipts, read statuses, and sent notifications
      if (value.statuses && (!value.messages || value.messages.length === 0)) {
        continue;
      }

      const messages = value.messages || [];
      for (const message of messages) {
        await processSingleMessage(message, value.contacts);
      }
    }
  }
}

/**
 * Process a single incoming user message
 */
async function processSingleMessage(message, contacts) {
  const from = message.from; // Sender WhatsApp phone number
  const messageId = message.id;
  const messageType = message.type;

  if (!from || !messageId) return;

  // 1. Deduplication Check (Meta webhooks can fire duplicate events)
  const isAlreadyProcessed = await db.isMessageProcessed(messageId);
  if (isAlreadyProcessed) {
    console.log(`⏩ Message ${messageId} already processed. Skipping.`);
    return;
  }
  await db.markMessageProcessed(messageId);

  // 2. Mark incoming message as read on user's phone (blue checkmarks)
  markMessageAsRead(messageId);

  // 3. Handle non-text messages (Voice, Image, Document, Location, Sticker)
  if (messageType !== 'text') {
    console.log(`ℹ️ Received non-text message type "${messageType}" from ${from}`);
    const nonTextReply =
      'Duhkhito, ami ekhon shudhumatro text message bujhte pari. Onugraho kore apnar prosno ba somoshya likhe janan, ami sahajjo korchi!';
    await sendWhatsAppMessage(from, nonTextReply);
    return;
  }

  const userText = message.text?.body?.trim();
  if (!userText) return;

  console.log(`📩 Incoming from [${from}]: "${userText}"`);

  try {
    // 4. Retrieve recent conversation history (last 10 turns for context)
    const recentHistory = await db.getRecentHistory(from, 10);

    // 5. Save incoming user message to SQLite
    await db.saveMessage(from, 'user', userText);

    // 6. Generate AI response with Gemini 1.5 Flash
    console.log(`🤖 Generating response using Gemini 1.5 Flash for [${from}]...`);
    const botReply = await generateSupportResponse(userText, recentHistory);

    // 7. Save bot response to SQLite
    await db.saveMessage(from, 'model', botReply);

    // 8. Send reply back to customer via Meta Cloud API
    await sendWhatsAppMessage(from, botReply);
    console.log(`✅ Sent reply to [${from}]: "${botReply.slice(0, 60)}..."`);
  } catch (error) {
    console.error(`❌ Failed to process message for [${from}]:`, error.message);
    try {
      await sendWhatsAppMessage(from, FALLBACK_MESSAGE);
    } catch (sendErr) {
      console.error('❌ Failed to send fallback message:', sendErr.message);
    }
  }
}

// Start server after verifying DB
db.initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
======================================================
🚀 Banglish WhatsApp Customer Support Bot Server
======================================================
🌐 Server listening on port: ${PORT}
🔗 Webhook Verification URL: http://localhost:${PORT}/webhook
📱 Supported Phone Number ID: ${process.env.PHONE_NUMBER_ID || 'Not Set'}
🤖 AI Engine: Google Gemini (${process.env.GEMINI_MODEL || 'gemini-flash-latest'})
📦 Database: SQLite (conversations.db)
======================================================
      `);
    });
  })
  .catch((err) => {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  process.exit(0);
});
