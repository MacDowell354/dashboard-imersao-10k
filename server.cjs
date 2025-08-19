// server.cjs (CommonJS)
const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// (opcional) log de requisições
app.use((req, _res, next) => {
  console.log('REQ', req.method, req.url);
  next();
});

// Inicia o cron em background
console.log('🚀 Iniciando serviço de atualização automática...');
const cronProcess = spawn('node', ['cron-update.js'], {
  stdio: 'inherit',
  detached: false,
});
cronProcess.on('error', (error) => {
  console.error('❌ Erro no serviço de atualização:', error);
});

// Arquivos estáticos do build (React)
app.use(express.static(path.join(__dirname, 'dist')));

// Servir os dados atualizados pela API como arquivos estáticos
// Ex.: https://seusite.onrender.com/data/dados-atualizados.json
app.use('/data', express.static(path.join(__dirname, 'dist', 'data')));

// Endpoint para atualização manual (POST)
app.post('/api/update-data', async (_req, res) => {
  try {
    console.log('🔄 Atualização manual solicitada...');
    const { fetchDataFromSharePoint } = require('./update-data.js');
    await fetchDataFromSharePoint();
    res.json({ success: true, message: 'Dados atualizados com sucesso!' });
  } catch (error) {
    console.error('❌ Erro na atualização manual:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Status
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    autoUpdate: 'active',
  });
});

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Dashboard rodando na porta ${PORT}`);
  console.log(`📊 Acesse: http://localhost:${PORT}`);
  console.log('⏰ Atualização automática: ATIVA');
});
