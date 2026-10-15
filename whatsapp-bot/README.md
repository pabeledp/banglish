# 🤖 Banglish WhatsApp Customer Support Bot (AI-Powered)

Production-ready, highly efficient WhatsApp Cloud API integration server for **[banglish.bd](https://banglish.bd)** (Banglish Keyboard), powered by Google Gemini AI (`gemini-1.5-flash`) and SQLite multi-turn conversation memory.

---

## 📌 Architecture & Features

- **Google Gemini 1.5 Flash**: Lightning-fast, intelligent customer support answering queries in **Banglish**, **Bengali (বাংলা)**, or **English**.
- **Multi-Turn Chat History**: Preserves the last 10 conversation turns per user phone number in a local SQLite database (`conversations.db`).
- **Webhook Resilience**:
  - Immediately acknowledges Meta with `200 OK` (under 50ms) to prevent webhook timeouts and retry spam.
  - Message deduplication by `message_id` prevents duplicate processing.
  - Automatic `read` status receipts (blue double checkmarks) on user messages.
- **Fail-Safe Fallback**: If Gemini API times out or errors, sends a polite localized fallback response without crashing.
- **Role Separation**:
  - 🤖 **AI Support Assistant (`+880 1795-020192`)**: Automated 24/7 technical help, installation, shortcuts, and troubleshooting.
  - 👨‍💻 **Direct Developer Chat (`+880 1615-288259`)**: A M Pabel / Team FramEmpire for direct business, custom software, or human escalation.

---

## 🚀 Quick Setup & Installation

### 1. Install Dependencies
```bash
cd whatsapp-bot
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (already created):
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
PORT=3000
WEBHOOK_VERIFY_TOKEN=banglish_keyboard_2026
WHATSAPP_TOKEN=your_meta_whatsapp_token_here
PHONE_NUMBER_ID=1285739121299923
GEMINI_API_KEY=your_gemini_api_key_here
META_GRAPH_API_VERSION=v20.0
```

### 3. Start the Server
```bash
# Production mode
npm start

# Development mode (with auto-reload)
npm run dev
```

---

## 🌐 Connecting to Meta WhatsApp Cloud API

### Step 1: Expose Localhost to the Internet
In a separate terminal, run `ngrok` or Cloudflare Tunnel:
```bash
ngrok http 3000
```
Copy the generated HTTPS URL (e.g., `https://your-subdomain.ngrok-free.app`).

### Step 2: Configure Meta Developer Portal
1. Go to [Meta for Developers](https://developers.facebook.com/) > Your App > **WhatsApp** > **Configuration**.
2. Under **Webhook**, click **Edit**:
   - **Callback URL**: `https://your-subdomain.ngrok-free.app/webhook`
   - **Verify Token**: `banglish_keyboard_2026` (must match `WEBHOOK_VERIFY_TOKEN`)
3. Click **Verify and Save**.
4. Under **Webhook fields**, click **Manage** and subscribe to **`messages`**.

### Step 3: Test with WhatsApp!
Send a WhatsApp message from any phone to the bot number **`+880 1795-020192`**:
- *"Mac e Banglish kivabe install korbo?"*
- *"ম্যাকে কিভাবে ইনস্টল করব?"*
- *"How to switch keyboard layout?"*

The bot will reply in the matching language within 1-2 seconds!

---

## 📁 File Structure
```
whatsapp-bot/
├── .env                  # Live environment variables (Ignored in git)
├── .env.example          # Environment variable template
├── package.json          # Node.js project manifest & scripts
├── db.js                 # SQLite database & message history manager
├── gemini.js             # Google Gemini 1.5 Flash AI customer support engine
├── whatsapp.js           # Meta Graph API sender & read-receipts
├── server.js             # Express.js webhook server & event router
└── README.md             # Documentation & setup guide
```

---

## 🛠️ Production Deployment (PM2 / VPS)
To run permanently in background on a VPS / Cloud VM:
```bash
npm install -g pm2
pm2 start server.js --name "banglish-whatsapp-bot"
pm2 save
pm2 startup
```
