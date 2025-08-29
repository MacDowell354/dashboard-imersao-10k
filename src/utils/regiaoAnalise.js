// Mapeamento de DDDs para regiões do Brasil
export const DDD_REGIOES = {
  // Região Sudeste
  11: { estado: 'SP', regiao: 'Sudeste', cidade: 'São Paulo' },
  12: { estado: 'SP', regiao: 'Sudeste', cidade: 'Vale do Paraíba' },
  13: { estado: 'SP', regiao: 'Sudeste', cidade: 'Santos' },
  14: { estado: 'SP', regiao: 'Sudeste', cidade: 'Bauru' },
  15: { estado: 'SP', regiao: 'Sudeste', cidade: 'Sorocaba' },
  16: { estado: 'SP', regiao: 'Sudeste', cidade: 'Ribeirão Preto' },
  17: { estado: 'SP', regiao: 'Sudeste', cidade: 'São José do Rio Preto' },
  18: { estado: 'SP', regiao: 'Sudeste', cidade: 'Presidente Prudente' },
  19: { estado: 'SP', regiao: 'Sudeste', cidade: 'Campinas' },
  
  21: { estado: 'RJ', regiao: 'Sudeste', cidade: 'Rio de Janeiro' },
  22: { estado: 'RJ', regiao: 'Sudeste', cidade: 'Campos dos Goytacazes' },
  24: { estado: 'RJ', regiao: 'Sudeste', cidade: 'Volta Redonda' },
  
  27: { estado: 'ES', regiao: 'Sudeste', cidade: 'Vitória' },
  28: { estado: 'ES', regiao: 'Sudeste', cidade: 'Cachoeiro de Itapemirim' },
  
  31: { estado: 'MG', regiao: 'Sudeste', cidade: 'Belo Horizonte' },
  32: { estado: 'MG', regiao: 'Sudeste', cidade: 'Juiz de Fora' },
  33: { estado: 'MG', regiao: 'Sudeste', cidade: 'Governador Valadares' },
  34: { estado: 'MG', regiao: 'Sudeste', cidade: 'Uberlândia' },
  35: { estado: 'MG', regiao: 'Sudeste', cidade: 'Poços de Caldas' },
  37: { estado: 'MG', regiao: 'Sudeste', cidade: 'Divinópolis' },
  38: { estado: 'MG', regiao: 'Sudeste', cidade: 'Montes Claros' },
  
  // Região Sul
  41: { estado: 'PR', regiao: 'Sul', cidade: 'Curitiba' },
  42: { estado: 'PR', regiao: 'Sul', cidade: 'Ponta Grossa' },
  43: { estado: 'PR', regiao: 'Sul', cidade: 'Londrina' },
  44: { estado: 'PR', regiao: 'Sul', cidade: 'Maringá' },
  45: { estado: 'PR', regiao: 'Sul', cidade: 'Foz do Iguaçu' },
  46: { estado: 'PR', regiao: 'Sul', cidade: 'Francisco Beltrão' },
  
  47: { estado: 'SC', regiao: 'Sul', cidade: 'Joinville' },
  48: { estado: 'SC', regiao: 'Sul', cidade: 'Florianópolis' },
  49: { estado: 'SC', regiao: 'Sul', cidade: 'Chapecó' },
  
  51: { estado: 'RS', regiao: 'Sul', cidade: 'Porto Alegre' },
  53: { estado: 'RS', regiao: 'Sul', cidade: 'Pelotas' },
  54: { estado: 'RS', regiao: 'Sul', cidade: 'Caxias do Sul' },
  55: { estado: 'RS', regiao: 'Sul', cidade: 'Santa Maria' },
  
  // Região Nordeste
  71: { estado: 'BA', regiao: 'Nordeste', cidade: 'Salvador' },
  73: { estado: 'BA', regiao: 'Nordeste', cidade: 'Ilhéus' },
  74: { estado: 'BA', regiao: 'Nordeste', cidade: 'Juazeiro' },
  75: { estado: 'BA', regiao: 'Nordeste', cidade: 'Feira de Santana' },
  77: { estado: 'BA', regiao: 'Nordeste', cidade: 'Vitória da Conquista' },
  
  79: { estado: 'SE', regiao: 'Nordeste', cidade: 'Aracaju' },
  
  81: { estado: 'PE', regiao: 'Nordeste', cidade: 'Recife' },
  87: { estado: 'PE', regiao: 'Nordeste', cidade: 'Petrolina' },
  
  82: { estado: 'AL', regiao: 'Nordeste', cidade: 'Maceió' },
  
  83: { estado: 'PB', regiao: 'Nordeste', cidade: 'João Pessoa' },
  
  84: { estado: 'RN', regiao: 'Nordeste', cidade: 'Natal' },
  
  85: { estado: 'CE', regiao: 'Nordeste', cidade: 'Fortaleza' },
  88: { estado: 'CE', regiao: 'Nordeste', cidade: 'Sobral' },
  
  86: { estado: 'PI', regiao: 'Nordeste', cidade: 'Teresina' },
  89: { estado: 'PI', regiao: 'Nordeste', cidade: 'Picos' },
  
  98: { estado: 'MA', regiao: 'Nordeste', cidade: 'São Luís' },
  99: { estado: 'MA', regiao: 'Nordeste', cidade: 'Imperatriz' },
  
  // Região Centro-Oeste
  61: { estado: 'DF', regiao: 'Centro-Oeste', cidade: 'Brasília' },
  
  62: { estado: 'GO', regiao: 'Centro-Oeste', cidade: 'Goiânia' },
  64: { estado: 'GO', regiao: 'Centro-Oeste', cidade: 'Rio Verde' },
  
  65: { estado: 'MT', regiao: 'Centro-Oeste', cidade: 'Cuiabá' },
  66: { estado: 'MT', regiao: 'Centro-Oeste', cidade: 'Rondonópolis' },
  
  67: { estado: 'MS', regiao: 'Centro-Oeste', cidade: 'Campo Grande' },
  
  // Região Norte
  68: { estado: 'AC', regiao: 'Norte', cidade: 'Rio Branco' },
  
  69: { estado: 'RO', regiao: 'Norte', cidade: 'Porto Velho' },
  
  92: { estado: 'AM', regiao: 'Norte', cidade: 'Manaus' },
  97: { estado: 'AM', regiao: 'Norte', cidade: 'Tefé' },
  
  91: { estado: 'PA', regiao: 'Norte', cidade: 'Belém' },
  93: { estado: 'PA', regiao: 'Norte', cidade: 'Santarém' },
  94: { estado: 'PA', regiao: 'Norte', cidade: 'Marabá' },
  
  95: { estado: 'RR', regiao: 'Norte', cidade: 'Boa Vista' },
  
  96: { estado: 'AP', regiao: 'Norte', cidade: 'Macapá' },
  
  63: { estado: 'TO', regiao: 'Norte', cidade: 'Palmas' }
}

// Função para extrair DDD de um número de telefone
export function extrairDDD(telefone) {
  if (!telefone) return null
  
  // Remove caracteres não numéricos
  const numeroLimpo = telefone.replace(/\D/g, '')
  
  // Verifica se tem pelo menos 10 dígitos (DDD + número)
  if (numeroLimpo.length < 10) return null
  
  // Extrai os primeiros 2 dígitos como DDD
  const ddd = parseInt(numeroLimpo.substring(0, 2))
  
  return ddd
}

// Função para obter informações da região pelo DDD
export function obterRegiaoPorDDD(ddd) {
  return DDD_REGIOES[ddd] || null
}

// Função para analisar distribuição regional de uma lista de telefones
export function analisarDistribuicaoRegional(telefones) {
  const distribuicao = {
    por_regiao: {},
    por_estado: {},
    por_ddd: {},
    total_validos: 0,
    total_invalidos: 0
  }
  
  telefones.forEach(telefone => {
    const ddd = extrairDDD(telefone)
    
    if (!ddd) {
      distribuicao.total_invalidos++
      return
    }
    
    const info = obterRegiaoPorDDD(ddd)
    
    if (!info) {
      distribuicao.total_invalidos++
      return
    }
    
    distribuicao.total_validos++
    
    // Contagem por região
    if (!distribuicao.por_regiao[info.regiao]) {
      distribuicao.por_regiao[info.regiao] = 0
    }
    distribuicao.por_regiao[info.regiao]++
    
    // Contagem por estado
    if (!distribuicao.por_estado[info.estado]) {
      distribuicao.por_estado[info.estado] = 0
    }
    distribuicao.por_estado[info.estado]++
    
    // Contagem por DDD
    if (!distribuicao.por_ddd[ddd]) {
      distribuicao.por_ddd[ddd] = {
        count: 0,
        estado: info.estado,
        regiao: info.regiao,
        cidade: info.cidade
      }
    }
    distribuicao.por_ddd[ddd].count++
  })
  
  return distribuicao
}

// Função para gerar dados de exemplo para demonstração
export function gerarDadosExemplo() {
  const telefonesMock = [
    '11987654321', // SP
    '21987654321', // RJ
    '31987654321', // MG
    '41987654321', // PR
    '51987654321', // RS
    '61987654321', // DF
    '71987654321', // BA
    '81987654321', // PE
    '85987654321', // CE
    '11987654322', // SP
    '21987654322', // RJ
    '11987654323', // SP
    '62987654321', // GO
    '47987654321', // SC
    '27987654321', // ES
    '84987654321', // RN
    '86987654321', // PI
    '65987654321', // MT
    '67987654321', // MS
    '92987654321'  // AM
  ]
  
  return analisarDistribuicaoRegional(telefonesMock)
}

// Função para converter distribuição em dados para gráficos
export function prepararDadosGraficos(distribuicao) {
  const dadosRegiao = Object.entries(distribuicao.por_regiao).map(([regiao, count]) => ({
    regiao,
    leads: count,
    percentual: ((count / distribuicao.total_validos) * 100).toFixed(1)
  })).sort((a, b) => b.leads - a.leads)
  
  const dadosEstado = Object.entries(distribuicao.por_estado).map(([estado, count]) => ({
    estado,
    leads: count,
    percentual: ((count / distribuicao.total_validos) * 100).toFixed(1)
  })).sort((a, b) => b.leads - a.leads)
  
  const dadosDDD = Object.entries(distribuicao.por_ddd).map(([ddd, info]) => ({
    ddd: parseInt(ddd),
    leads: info.count,
    estado: info.estado,
    regiao: info.regiao,
    cidade: info.cidade,
    percentual: ((info.count / distribuicao.total_validos) * 100).toFixed(1)
  })).sort((a, b) => b.leads - a.leads)
  
  return {
    por_regiao: dadosRegiao,
    por_estado: dadosEstado,
    por_ddd: dadosDDD
  }
}

