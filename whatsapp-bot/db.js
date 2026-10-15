const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Initialize SQLite database file in the same directory
const DB_PATH = path.join(__dirname, 'conversations.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Failed to open SQLite database:', err.message);
  } else {
    console.log('📦 Connected to SQLite database at:', DB_PATH);
  }
});

// Helper for running queries with Promises
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// Initialize tables and indexes
async function initDatabase() {
  // 1. Multi-turn conversation history table
  await run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone_number TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'model')),
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_messages_phone 
    ON messages(phone_number, created_at DESC)
  `);

  // 2. Webhook message deduplication table (Prevents Meta webhook duplicate delivery)
  await run(`
    CREATE TABLE IF NOT EXISTS processed_messages (
      message_id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ SQLite tables & indexes verified.');
}

/**
 * Save a message into the database
 * @param {string} phoneNumber - Sender's WhatsApp phone number
 * @param {'user'|'model'} role - Role: 'user' or 'model'
 * @param {string} content - Text content
 */
async function saveMessage(phoneNumber, role, content) {
  const sql = `INSERT INTO messages (phone_number, role, content) VALUES (?, ?, ?)`;
  return await run(sql, [phoneNumber, role, content]);
}

/**
 * Retrieve the last N messages for context (formatted for Gemini chat history)
 * @param {string} phoneNumber - Sender's WhatsApp phone number
 * @param {number} limit - Number of past messages to fetch (default 10)
 * @returns {Promise<Array<{ role: string, parts: Array<{ text: string }> }>>}
 */
async function getRecentHistory(phoneNumber, limit = 10) {
  // Fetch newest messages first, then reverse to chronological order
  const sql = `
    SELECT role, content 
    FROM messages 
    WHERE phone_number = ? 
    ORDER BY id DESC 
    LIMIT ?
  `;
  const rows = await all(sql, [phoneNumber, limit]);
  const chronological = rows.reverse();

  // Gemini chat expects: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
  return chronological.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));
}

/**
 * Check if a WhatsApp message ID was already processed
 * @param {string} messageId 
 */
async function isMessageProcessed(messageId) {
  const row = await get(`SELECT message_id FROM processed_messages WHERE message_id = ?`, [messageId]);
  return !!row;
}

/**
 * Mark a WhatsApp message ID as processed
 * @param {string} messageId 
 */
async function markMessageProcessed(messageId) {
  const sql = `INSERT OR IGNORE INTO processed_messages (message_id) VALUES (?)`;
  return await run(sql, [messageId]);
}

module.exports = {
  initDatabase,
  saveMessage,
  getRecentHistory,
  isMessageProcessed,
  markMessageProcessed
};
