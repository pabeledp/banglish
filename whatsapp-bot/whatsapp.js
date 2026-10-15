const axios = require('axios');

const GRAPH_API_VERSION = process.env.META_GRAPH_API_VERSION || 'v20.0';

/**
 * Send a WhatsApp text reply to a user phone number
 * @param {string} to - Recipient WhatsApp phone number
 * @param {string} messageText - Response text to send
 */
async function sendWhatsAppMessage(to, messageText) {
  const phoneNumberId = process.env.PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;

  if (!phoneNumberId || !token) {
    throw new Error('PHONE_NUMBER_ID or WHATSAPP_TOKEN is missing in environment variables.');
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: {
      preview_url: true,
      body: messageText
    }
  };

  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    timeout: 12000
  });

  return response.data;
}

/**
 * Mark an incoming user message as read (blue double checkmarks)
 * @param {string} messageId - Incoming WhatsApp message ID
 */
async function markMessageAsRead(messageId) {
  const phoneNumberId = process.env.PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;

  if (!phoneNumberId || !token || !messageId) return;

  try {
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`;
    await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      }
    );
  } catch (err) {
    // Non-fatal, ignore read receipt errors
    console.warn('⚠️ Unable to mark message as read:', err.message);
  }
}

module.exports = {
  sendWhatsAppMessage,
  markMessageAsRead
};
