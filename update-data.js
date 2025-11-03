// update-data.js (CommonJS)
const fs = require('fs');
const path = require('path');

// (Quando integrar com Graph/Power Automate, use aqui)
const SHAREPOINT_URL = 'https://nandamac-my.sharepoint.com/:x:/p/ajuda/EfiSkgjlLjBOuVemIVjBP7gBt4JJriYK78RhjVMX6qqPug?e=zz7z4c';

async function fetchDataFromSharePoint() {
  try {
    console.log('🔄 Iniciando atualização dos dados...');

    // ===== DADOS SIMULADOS =====
    const dadosAtualizados = {
      dataAtualizacao: new Date().toISOString().split('T')[0],
      vendas: { total: 104, faturamento: 16845, investimento: 34671, roas: -0.51, cac: 333, ticketMedio: 162 },
      canais: [
        { nome: 'Tráfego Pago', vendas: 74, percentual: 71.2, crescimento: 12.1 },
        { nome: 'Bio Instagram', vendas: 19, percentual: 18.3, crescimento: 26.7 },
        { nome: 'Outros', vendas: 11, percentual: 10.5, crescimento: 10.0 }
      ],
      profissoes: [
        { nome: 'Médicos', vendas: 62, percentual: 59.6, crescimento: 26.1, ticketMedio: 167 },
        { nome: 'Dentistas', vendas: 14, percentual: 13.5, crescimento: 16.7, ticketMedio: 158 },
        { nome: 'Fisioterapeutas', vendas: 12, percentual: 11.5, crescimento: 9.1, ticketMedio: 155 },
        { nome: 'Outros', vendas: 16, percentual: 15.4, crescimento: 6.7, ticketMedio: 152 }
      ]
    };
    // ============================

    // 🔁 Compat para front antigo: cria "medicos_dentistas"
    const profs = Array.isArray(dadosAtualizados.profissoes) ? dadosAtualizados.profissoes : [];
    const med = profs.find(p => String(p?.nome).toLowerCase().startsWith('médico') || String(p?.nome).toLowerCase().startsWith('medico')) || {};
    const den = profs.find(p => String(p?.nome).toLowerCase().startsWith('dent')) || {};
    dadosAtualizados.medicos_dentistas = {
      medicos: med,
      dentistas: den,
      total: (med.vendas || 0) + (den.vendas || 0)
    };

    // Salvar dentro de dist/data (servido pelo Express)
    const dataDir = path.join(__dirname, 'dist', 'data');
    const dataPath = path.join(dataDir, 'dados-atualizados.json');
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(dadosAtualizados, null, 2), 'utf8');

    console.log('✅ Dados atualizados com sucesso!');
    console.log(`📅 Data: ${dadosAtualizados.dataAtualizacao}`);
    console.log(`📊 Vendas: ${dadosAtualizados.vendas.total}`);
    console.log(`💾 Arquivo salvo em: ${dataPath}`);

    return dadosAtualizados;
  } catch (error) {
    console.error('❌ Erro ao atualizar dados:', error);
    throw error;
  }
}

// CLI
async function updateData() {
  try { await fetchDataFromSharePoint(); process.exit(0); }
  catch (error) { console.error('Falha na atualização:', error); process.exit(1); }
}
if (require.main === module) updateData();

module.exports = { fetchDataFromSharePoint };
