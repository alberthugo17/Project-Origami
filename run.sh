#!/usr/bin/env bash
set -e
command -v node >/dev/null || { echo "Node.js belum terpasang. Pasang LTS dari https://nodejs.org"; exit 1; }
[ -d node_modules ] || npm install --no-audit --no-fund
npm run build
echo "Buka http://localhost:4173 (Ctrl+C untuk berhenti)"
npx vite preview --host --port 4173
