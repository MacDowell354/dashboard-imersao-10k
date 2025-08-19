// Script para executar atualização automática diária
const cron = require('node-cron');
const { fetchDataFromSharePoint } = require('./update-data');

console.log('🚀 Iniciando serviço de atualização automática...');

// Executar todos os dias às 6:00 AM (horário do servidor)
cron.schedule('0 6 * * *', async () => {
  console.log('⏰ Executando atualização diária automática...');
  try {
    await fetchDataFromSharePoint();
    console.log('✅ Atualização diária concluída com sucesso!');
  } catch (error) {
    console.error('❌ Erro na atualização diária:', error);
  }
}, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});

// Executar também às 12:00 PM e 18:00 PM
cron.schedule('0 12,18 * * *', async () => {
  console.log('⏰ Executando atualização adicional...');
  try {
    await fetchDataFromSharePoint();
    console.log('✅ Atualização adicional concluída!');
  } catch (error) {
    console.error('❌ Erro na atualização adicional:', error);
  }
}, {
  scheduled: true,
  timezone: "America/Sao_Paulo"
});

console.log('📅 Agendamentos configurados:');
console.log('   - 06:00 AM: Atualização principal');
console.log('   - 12:00 PM: Atualização adicional');
console.log('   - 18:00 PM: Atualização adicional');
console.log('🌎 Timezone: America/Sao_Paulo');

// Manter o processo rodando
process.on('SIGINT', () => {
  console.log('🛑 Parando serviço de atualização...');
  process.exit(0);
});

