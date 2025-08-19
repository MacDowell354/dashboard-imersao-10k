const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const app = express();

// Iniciar serviço de atualização automática em background
console.log('🚀 Iniciando serviço de atualização automática...');
const cronProcess = spawn('node', ['cron-update.js'], {
  stdio: 'inherit',
  detached: false
});

cronProcess.on('error', (error) => {
  console.error('❌ Erro no serviço de atualização:', error);
});

// Servir arquivos estáticos da pasta dist
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint para atualização manual
app.post('/api/update-data', async (req, res) => {
  try {
    console.log('🔄 Atualização manual solicitada...');
    const { fetchDataFromSharePoint } = require('./update-data');
    await fetchDataFromSharePoint();
    res.json({ success: true, message: 'Dados atualizados com sucesso!' });
  } catch (error) {
    console.error('❌ Erro na atualização manual:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API endpoint para verificar status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    autoUpdate: 'active'
  });
});

// Rota para servir o index.html para todas as rotas (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Dashboard rodando na porta ${PORT}`);
  console.log(`📊 Acesse: http://localhost:${PORT}`);
  console.log('⏰ Atualização automática: ATIVA');
});

