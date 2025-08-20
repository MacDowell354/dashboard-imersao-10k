// server.cjs (CommonJS)
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// ——— logs simples de requests (ajuda a ver no Render) ———
app.use((req, _res, next) => {
  console.log(`REQ ${req.method} ${req.url}`);
  next();
});

// inicia o cron em background
console.log('🚀 Iniciando serviço de atualização automática...');
const cronProcess = spawn('node', ['cron-update.js'], {
  stdio: 'inherit',
  detached: false,
});
cronProcess.on('error', (error) => {
  console.error('❌ Erro no serviço de atualização:', error);
});

// serve estáticos do build
const distDir = path.join(__dirname, 'dist');
app.use(express.static(distDir, { etag: false, lastModified: false, maxAge: 0 }));

// healthchecks
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/ping', (_req, res) => res.send('pong'));

// status da API
app.get('/api/status', (_req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString(), autoUpdate: 'active' });
});

// atualização manual (se quiser acionar por POST)
app.post('/api/update-data', async (_req, res) => {
  try {
    console.log('🔄 Atualização manual solicitada...');
    const { fetchDataFromSharePoint } = require('./update-data.js');
    const payload = await fetchDataFromSharePoint();
    res.json({ success: true, ...payload });
  } catch (error) {
    console.error('❌ Erro na atualização manual:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Dashboard rodando na porta ${PORT}`);
  console.log(`📊 Acesse: http://localhost:${PORT}`);
  console.log('⏰ Atualização automática: ATIVA');
});
