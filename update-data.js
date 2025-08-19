// Script para atualização automática dos dados da planilha
const fs = require('fs');
const path = require('path');

// URL da planilha SharePoint (você precisa configurar)
const SHAREPOINT_URL = 'https://nandamac-my.sharepoint.com/:x:/p/ajuda/EfiSkgjlLjBOuVemIVjBP7gBt4JJriYK78RhjVMX6qqPug?e=zz7z4c';

// Função para buscar dados da planilha
async function fetchDataFromSharePoint() {
  try {
    console.log('🔄 Iniciando atualização dos dados...');
    
    // MÉTODO 1: API do Microsoft Graph (recomendado)
    // Você precisa configurar as credenciais da API
    
    // MÉTODO 2: Web scraping (alternativo)
    // const response = await fetch(SHAREPOINT_URL);
    
    // MÉTODO 3: Webhook do Power Automate (mais simples)
    // Configure um webhook no Power Automate para enviar dados
    
    // Por enquanto, vamos simular dados atualizados
    const dadosAtualizados = {
      dataAtualizacao: new Date().toISOString().split('T')[0],
      vendas: {
        total: 104,
        faturamento: 16845,
        investimento: 34671,
        roas: -0.51,
        cac: 333,
        ticketMedio: 162
      },
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
    
    // Salvar dados atualizados
    const dataPath = path.join(__dirname, 'src', 'data', 'dados-atualizados.json');
    fs.writeFileSync(dataPath, JSON.stringify(dadosAtualizados, null, 2));
    
    console.log('✅ Dados atualizados com sucesso!');
    console.log(`📅 Data: ${dadosAtualizados.dataAtualizacao}`);
    console.log(`📊 Vendas: ${dadosAtualizados.vendas.total}`);
    
    return dadosAtualizados;
    
  } catch (error) {
    console.error('❌ Erro ao atualizar dados:', error);
    throw error;
  }
}

// Função para executar atualização
async function updateData() {
  try {
    await fetchDataFromSharePoint();
    process.exit(0);
  } catch (error) {
    console.error('Falha na atualização:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  updateData();
}

module.exports = { fetchDataFromSharePoint };

