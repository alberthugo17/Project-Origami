@echo off
where node >nul 2>nul || (echo Node.js belum terpasang. Pasang LTS dari https://nodejs.org lalu jalankan ulang. & pause & exit /b 1)
if not exist node_modules call npm install --no-audit --no-fund || (pause & exit /b 1)
call npm run build || (pause & exit /b 1)
echo Buka http://localhost:4173 (Ctrl+C untuk berhenti)
call npx vite preview --host --port 4173 --open
