// cron-update.js (CommonJS)
const cron = require('node-cron');
const { fetchDataFromSharePoint } = require('./update-data.js');

const TZ = 'America/Sao_Paulo';

console.log('📅 Agendamentos configurados:');
console.log('   - 06:00 AM: Atualização principal');
console.log('   - 12:00 PM: Atualização adicional');
console.log('   - 18:00 PM: Atualização adicional');
console.log(`🌎 Timezone: ${TZ}`);

async function runUpdate(tag) {
  try {
    console.log(`⏰ Executando atualização ${tag}...`);
    await fetchDataFromSharePoint();
    console.log(`✅ Atualização ${tag} concluída.`);
  } catch (e) {
    console.error(`❌ Erro na atualização ${tag}:`, e);
  }
}

// executa logo que o serviço sobe
runUpdate('inicial');

// 06:00, 12:00 e 18:00 todos os dias
cron.schedule('0 6,12,18 * * *', () => runUpdate('diária'), { timezone: TZ });
