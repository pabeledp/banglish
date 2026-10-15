#!/usr/bin/env bash

# Banglish WhatsApp Bot All-in-One Launcher
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "======================================================"
echo "🚀 Starting Banglish WhatsApp Bot Server..."
echo "======================================================"

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing npm dependencies..."
  npm install
fi

# Ensure cloudflared binary exists
if [ ! -f "bin/cloudflared" ]; then
  echo "⬇️ Downloading cloudflared..."
  mkdir -p bin
  curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-arm64.tgz | tar -xz -C bin/
  chmod +x bin/cloudflared
fi

# Start server in background
node server.js &
SERVER_PID=$!

sleep 2

# Start Cloudflare Tunnel
echo "🌐 Starting Cloudflare Quick Tunnel..."
./bin/cloudflared tunnel --url http://localhost:3000 > /tmp/cloudflared-bot.log 2>&1 &
TUNNEL_PID=$!

echo "⏳ Waiting for public tunnel URL..."
TUNNEL_URL=""
for i in {1..20}; do
  sleep 1
  TUNNEL_URL=$(grep -o 'https://[-a-zA-Z0-9.]*\.trycloudflare\.com' /tmp/cloudflared-bot.log | tail -n 1)
  if [ -n "$TUNNEL_URL" ]; then
    break
  fi
done

echo ""
echo "======================================================"
echo "🎉 Bot is running and connected to internet!"
echo "======================================================"
echo "🔗 Your Meta Webhook Callback URL:"
echo "👉 $TUNNEL_URL/webhook"
echo ""
echo "🔑 Verify Token:"
echo "👉 banglish_keyboard_2026"
echo ""
echo "📱 Meta Configuration:"
echo "1. Go to developers.facebook.com -> WhatsApp -> Configuration"
echo "2. Set Callback URL to: $TUNNEL_URL/webhook"
echo "3. Set Verify Token to: banglish_keyboard_2026"
echo "4. In Webhook fields, click 'Subscribe' on 'messages'"
echo "======================================================"
echo "Press Ctrl+C to stop the bot and tunnel."

trap "kill $SERVER_PID $TUNNEL_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
