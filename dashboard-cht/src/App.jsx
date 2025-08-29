import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts'
import { 
  TrendingDown, TrendingUp, AlertTriangle, Target, DollarSign, 
  Users, Calendar, Brain, Lightbulb, BarChart3, PieChart as PieChartIcon,
  UserCheck, Stethoscope, Activity, CheckCircle, AlertCircle, Crown, Star, MapPin
} from 'lucide-react'
import './App.css'

// Cache Busting - Força atualização
const CACHE_VERSION = Date.now();
const BUILD_VERSION = "20250828_CHT_CORRIGIDO_" + CACHE_VERSION;

// Dados CORRETOS do lançamento CHT - 28/08/2025 - CAPTAÇÃO EM ANDAMENTO
const dadosCorrigidosCHT = {
  metricas_principais: {
    cac: "15,23",  // CPL CORRETO da planilha (formato brasileiro)
    total_leads: 1149,  // CORRETO - 4 dias de captação (242+291+271+345)
    roas_previsto: "2,90",  // CORRETO DA PLANILHA (formato brasileiro)
    faturamento_previsto: 354696,  // CORRETO DA PLANILHA - R$ 354.696,30
    investimento_4_dias: "1.149,00",  // Valor correto da planilha para 4 dias
    data_atualizacao: '29/08/2025 - CAPTAÇÃO EM ANDAMENTO (4 dias)',
    meta_leads: 9000,  // Meta total de leads
    taxa_conversao: 0.007,  // 0,7% da planilha
    vendas_previstas: 56,  // Vendas previstas da planilha
    preco_curso: 6300,  // Preço do curso
    dias_incorridos: 4,
    dias_restantes: 24,
    total_dias: 28
  },
  insights_ia: [
    {
      categoria: 'CAPTAÇÃO',
      insight: '🚀 CAPTAÇÃO CHT22 EM ANDAMENTO - 4 DIAS EXCELENTES',
      detalhes: 'Primeiros 4 dias com 1149 leads captados e CPL R$ 15,23.149 leads captados e CPL R$ 15,23. Crescimento consistente até 28/08. Estamos na fase de captação, não vendas.',
      acao: 'Continuar estratégia atual. Meta: 7.500+ leads em 28 dias. Próxima fase: aquecimento em 08/09.'
    },
    {
      categoria: 'PROJEÇÃO',
      insight: 'Faturamento Previsto: R$ 354.696',
      detalhes: 'Baseado nos dados reais de captação até 28/08 e taxas históricas de conversão. ROAS previsto: 2,90. Ainda não há vendas, apenas projeções baseadas na qualidade dos leads.',
      acao: 'Focar na qualidade do aquecimento e CPLs para maximizar conversões. Evento será decisivo.'
    },
    {
      categoria: 'ESTRATÉGICO',
      insight: 'Segmentação Premium - Profissionais da Saúde',
      detalhes: 'Profissionais da saúde representam a maioria dos leads. Dentistas, Fisioterapeutas e Médicos são os segmentos principais com maior potencial de conversão.',
      acao: 'Personalizar conteúdo para cada especialidade. Médicos e Dentistas têm maior LTV potencial.'
    },
    {
      categoria: 'CANAIS',
      insight: 'Facebook: Canal Dominante na Captação',
      detalhes: 'Facebook mantém-se como canal principal com excelente qualidade de leads. Instagram e YouTube complementam com leads premium.',
      acao: 'Escalar investimento no Facebook mantendo qualidade. Testar expansão gradual para outros canais.'
    },
    {
      categoria: 'REGIONAL',
      insight: 'Concentração SP/RJ - Grandes Centros',
      detalhes: 'São Paulo e Rio de Janeiro concentram a maior parte dos leads, seguidos por Minas Gerais. Padrão típico de profissionais da saúde.',
      acao: 'Aproveitar concentração em grandes centros para eventos presenciais e networking.'
    }
  ],
  canais_captacao: [
    { 
      canal: 'Facebook', 
      leads: 1012, 
      percentual: 88.1, 
      cor: '#1877F2',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'ALTA',
      prioridade: 'ALTA'
    },
    { 
      canal: 'Instagram', 
      leads: 93, 
      percentual: 8.1, 
      cor: '#E4405F',
      conversao_curso: 'MÁXIMA',
      conversao_mentoria: 'MÁXIMA',
      prioridade: 'CRÍTICA'
    },
    { 
      canal: 'YouTube', 
      leads: 29, 
      percentual: 2.5, 
      cor: '#FF0000',
      conversao_curso: 'MÉDIA',
      conversao_mentoria: 'MÉDIA',
      prioridade: 'MÉDIA'
    },
    { 
      canal: 'Google Search', 
      leads: 8, 
      percentual: 0.7, 
      cor: '#4285F4',
      conversao_curso: 'MÉDIA',
      conversao_mentoria: 'MÉDIA',
      prioridade: 'MÉDIA'
    },
    { 
      canal: 'Outros', 
      leads: 7, 
      percentual: 0.6, 
      cor: '#6b7280',
      conversao_curso: 'MÉDIA',
      conversao_mentoria: 'MÉDIA',
      prioridade: 'MÉDIA'
    }
  ],
  segmentos_profissao: [
    { 
      profissao: 'Dentista', 
      leads: 259, 
      percentual: 22.5, 
      ltv: 1500,
      conversao_curso: 'ALTA',
      conversao_mentoria: 'MÉDIA',
      prioridade: 'ALTA'
    },
    { 
      profissao: 'Outras', 
      leads: 232, 
      percentual: 20.2, 
      ltv: 1200,
      conversao_curso: 'BAIXA',
      conversao_mentoria: 'BAIXA',
      prioridade: 'BAIXA'
    },
    { 
      profissao: 'Fisioterapeuta', 
      leads: 179, 
      percentual: 15.6, 
      ltv: 1200,
      conversao_curso: 'MÉDIA',
      conversao_mentoria: 'BAIXA',
      prioridade: 'MÉDIA'
    },
    { 
      profissao: 'Médico', 
      leads: 173, 
      percentual: 15.1, 
      ltv: 2500,
      conversao_curso: 'MÁXIMA',
      conversao_mentoria: 'MÁXIMA',
      prioridade: 'CRÍTICA'
    },
    { 
      profissao: 'Psicólogo', 
      leads: 123, 
      percentual: 10.7, 
      ltv: 1000,
      conversao_curso: 'MÉDIA',
      conversao_mentoria: 'BAIXA',
      prioridade: 'MÉDIA'
    },
    { 
      profissao: 'Nutricionista', 
      leads: 77, 
      percentual: 6.7, 
      ltv: 800,
      conversao_curso: 'BAIXA',
      conversao_mentoria: 'BAIXA',
      prioridade: 'BAIXA'
    }
  ],
  regioes_leads: [
    { estado: 'SP', leads: 200, percentual: '28,4%', ddd: '11', profissionais_saude: 120, medicos: 35, dentistas: 45, outros_prof: 40 },
    { estado: 'RJ', leads: 112, percentual: '15,9%', ddd: '21', profissionais_saude: 68, medicos: 20, dentistas: 28, outros_prof: 20 },
    { estado: 'MG', leads: 70, percentual: '9,9%', ddd: '31', profissionais_saude: 42, medicos: 12, dentistas: 18, outros_prof: 12 },
    { estado: 'PR', leads: 51, percentual: '7,2%', ddd: '41', profissionais_saude: 31, medicos: 9, dentistas: 13, outros_prof: 9 },
    { estado: 'RS', leads: 49, percentual: '7%', ddd: '51', profissionais_saude: 29, medicos: 8, dentistas: 12, outros_prof: 9 },
    { estado: 'BA', leads: 37, percentual: '5,2%', ddd: '71', profissionais_saude: 22, medicos: 6, dentistas: 9, outros_prof: 7 },
    { estado: 'SC', leads: 32, percentual: '4,5%', ddd: '47', profissionais_saude: 19, medicos: 5, dentistas: 8, outros_prof: 6 },
    { estado: 'PE', leads: 22, percentual: '3,1%', ddd: '81', profissionais_saude: 13, medicos: 4, dentistas: 5, outros_prof: 4 },
    { estado: 'DF', leads: 19, percentual: '2,7%', ddd: '61', profissionais_saude: 11, medicos: 3, dentistas: 4, outros_prof: 4 }
  ],
  evolucao_diaria: [
    { dia: '25/08', leads: 242, acumulado: 242 },
    { dia: '26/08', leads: 291, acumulado: 533 },
    { dia: '27/08', leads: 271, acumulado: 804 },
    { dia: '28/08', leads: 345, acumulado: 1149 }
  ],
  cronograma: [
    { data: '25/08', evento: 'Início Captação', status: 'concluido', descricao: 'Início da captação de leads' },
    { data: '08/09', evento: 'Aquecimento', status: 'pendente', descricao: 'Início das aulas de aquecimento' },
    { data: '15/09', evento: 'CPL 1', status: 'pendente', descricao: 'Primeira aula gratuita do curso' },
    { data: '17/09', evento: 'CPL 2', status: 'pendente', descricao: 'Segunda aula gratuita do curso' },
    { data: '19/09', evento: 'CPL 3', status: 'pendente', descricao: 'Terceira aula gratuita do curso' },
    { data: '21/09', evento: 'CPL 4 + Carrinho', status: 'pendente', descricao: 'Quarta aula + Abertura do carrinho' }
  ],
  urls: {
    inscricao: 'https://nandamac.com/cht/inscricao-cht',
    vendas: 'https://nandamac.com/cht/pgv-cht'
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const dados = dadosCorrigidosCHT.metricas_principais

  // Preparar dados para gráficos
  const dadosGraficoPizza = dadosCorrigidosCHT.canais_captacao.map(canal => ({
    name: canal.canal,
    value: canal.leads,
    color: canal.cor
  }))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-purple-600 mb-2">Carregando Dashboard CHT</h2>
          <p className="text-gray-600">Processando dados reais da captação...</p>
          <div className="mt-4 text-sm text-gray-500">
            Build: {BUILD_VERSION}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-purple-600">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Dashboard IA Nanda Mac Lançamento Tradicional
            </h1>
        <p className="text-lg text-gray-600 mb-6">
          Análise de IA • Dados Reais da Captação CHT22 • Curso Viver de Pacientes High Ticket
        </p>
            
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Badge className="bg-green-100 text-green-700 px-3 py-1">
                🎯 Profissionais da Saúde: Público-alvo premium
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-700 px-3 py-1">
                ⭐ Curso + Mentoria: Dupla monetização
              </Badge>
              <Badge className="bg-red-100 text-red-700 px-3 py-1">
                🚀 Captação em andamento: 4 dias
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Status Financeiro */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">🚀 CAPTAÇÃO CHT22 EM ANDAMENTO - BOA PERFORMANCE</span>
          </div>
          <p className="text-green-700">
            <strong>✅ DADOS REAIS:</strong> 1.149 leads captados em 4 dias com CPL R$ 15,23 (excelente). Faturamento previsto: R$ 355k. ROAS previsto: 2,90.
            <strong> Próxima fase: aquecimento em 08/09/2025.</strong>
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">ROAS</p>
                      <p className="text-2xl font-bold text-green-700">2,90</p>
                      <p className="text-xs text-green-600">✅ Previsto (só captação)</p>
                      <p className="text-lg font-bold text-red-600 mt-1">1,94</p>
                      <p className="text-xs text-red-600">Total (com aquecimento)</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

          <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CAC</p>
                  <p className="text-3xl font-bold text-blue-600">R$ {dados.cac}</p>
                  <p className="text-xs text-blue-500">Excelente CPL</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leads</p>
                  <p className="text-3xl font-bold text-purple-600">{dados.total_leads.toLocaleString()}</p>
                  <p className="text-xs text-purple-500">4 dias captação</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Faturamento</p>
                  <p className="text-3xl font-bold text-orange-600">R$ {(dados.faturamento_previsto / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-orange-500">Previsto</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Meta</p>
                  <p className="text-2xl font-bold text-indigo-600">{((dados.total_leads / dados.meta_leads) * 100).toFixed(1)}%</p>
                  <p className="text-xs text-indigo-500">{dados.total_leads.toLocaleString()} / {dados.meta_leads.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Segmentos Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Crown className="h-5 w-5" />
                Profissionais da Saúde
              </CardTitle>
              <CardDescription className="text-green-600">
                Segmento premium com maior LTV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">688</div>
                  <div className="text-sm text-green-600">Leads Premium</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">59,9%</div>
                  <div className="text-sm text-green-600">do Total</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">1º Médicos:</span>
                  <span className="font-medium">173 leads (15,1%) - CRÍTICA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">2º Dentistas:</span>
                  <span className="font-medium">259 leads (22,5%) - ALTA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Target className="h-5 w-5" />
                Canais de Captação de Leads
              </CardTitle>
              <CardDescription className="text-blue-600">
                Ranking dos canais por performance e importância
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700">1.149</div>
                  <div className="text-sm text-blue-600">Total Leads</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700">96,2%</div>
                  <div className="text-sm text-blue-600">Top 2 Canais</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">1º Facebook:</span>
                  <span className="font-medium">1.012 leads (88,1%) - ALTA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">2º Instagram:</span>
                  <span className="font-medium">93 leads (8,1%) - CRÍTICA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Origem & Conversão
            </TabsTrigger>
            <TabsTrigger value="segments" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Segmentos Estratégicos
            </TabsTrigger>
            <TabsTrigger value="regional" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Análise Regional
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Insights de IA
            </TabsTrigger>
            <TabsTrigger value="projections" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Projeções do Resultado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Distribuição por Canal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dadosGraficoPizza}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, value}) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dadosGraficoPizza.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Evolução Diária
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dadosCorrigidosCHT.evolucao_diaria}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="leads" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="acumulado" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Cronograma */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Cronograma do Lançamento CHT22
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dadosCorrigidosCHT.cronograma.map((item, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 ${
                      item.status === 'concluido' ? 'bg-green-50 border-green-200' :
                      item.status === 'pendente' ? 'bg-orange-50 border-orange-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${
                            item.status === 'concluido' ? 'text-green-700' :
                            item.status === 'pendente' ? 'text-orange-700' :
                            'text-gray-700'
                          }`}>
                            {item.data.split('/')[0]}
                          </div>
                          <div className={`text-xs ${
                            item.status === 'concluido' ? 'text-green-600' :
                            item.status === 'pendente' ? 'text-orange-600' :
                            'text-gray-600'
                          }`}>
                            {item.data.split('/')[1]}
                          </div>
                        </div>
                        <div>
                          <div className={`font-medium ${
                            item.status === 'concluido' ? 'text-green-700' :
                            item.status === 'pendente' ? 'text-orange-700' :
                            'text-gray-700'
                          }`}>
                            {item.evento}
                          </div>
                          <div className={`text-sm ${
                            item.status === 'concluido' ? 'text-green-600' :
                            item.status === 'pendente' ? 'text-orange-600' :
                            'text-gray-600'
                          }`}>
                            {item.descricao}
                          </div>
                          <Badge className={`mt-1 ${
                            item.status === 'concluido' ? 'bg-green-100 text-green-700' :
                            item.status === 'pendente' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status === 'concluido' ? '✅ Concluído' :
                             item.status === 'pendente' ? '⏳ Pendente' : '🔄 Em Andamento'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Análise de Canais por Performance Real
                </CardTitle>
                <CardDescription>
                  Distribuição real de {dados.total_leads} leads por canal de origem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dadosCorrigidosCHT.canais_captacao.map((canal, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{color: canal.cor}}>
                            {canal.leads}
                          </div>
                          <div className="text-sm text-gray-500">{canal.canal}</div>
                        </div>
                        <div>
                          <div className="text-lg font-medium">{canal.percentual}%</div>
                          <div className="text-sm text-gray-600">dos leads totais</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`mb-2 ${
                          canal.prioridade === 'CRÍTICA' ? 'bg-red-100 text-red-700' :
                          canal.prioridade === 'ALTA' ? 'bg-orange-100 text-orange-700' :
                          canal.prioridade === 'MÉDIA' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {canal.prioridade}
                        </Badge>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-green-600">Curso:</span> 
                            <span className="font-medium ml-1">{canal.conversao_curso}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-blue-600">Mentoria:</span> 
                            <span className="font-medium ml-1">{canal.conversao_mentoria}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="segments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Segmentação por Profissão - Dados Reais
                </CardTitle>
                <CardDescription>
                  Distribuição real de {dados.total_leads} leads por especialidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dadosCorrigidosCHT.segmentos_profissao.map((segmento, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {segmento.leads}
                          </div>
                          <div className="text-sm text-gray-500">{segmento.profissao} 👨‍⚕️</div>
                        </div>
                        <div>
                          <div className="text-lg font-medium">{segmento.percentual}%</div>
                          <div className="text-sm text-gray-600">
                            LTV Previsto: R$ {(segmento.leads * segmento.ltv).toLocaleString()} | Meta histórica
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`mb-2 ${
                          segmento.prioridade === 'CRÍTICA' ? 'bg-red-100 text-red-700' :
                          segmento.prioridade === 'ALTA' ? 'bg-orange-100 text-orange-700' :
                          segmento.prioridade === 'MÉDIA' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {segmento.prioridade}
                        </Badge>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-green-600">Curso:</span> 
                            <span className="font-medium ml-1">{segmento.conversao_curso}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-blue-600">Mentoria:</span> 
                            <span className="font-medium ml-1">{segmento.conversao_mentoria}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Análise Regional por DDD - Dados Reais
                </CardTitle>
                <CardDescription>
                  Distribuição de 705 leads com telefone por estado brasileiro + Breakdown por profissão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {dadosCorrigidosCHT.regioes_leads.slice(0, 9).map((regiao, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-blue-50 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <div className="text-lg font-bold text-blue-700">{regiao.estado}</div>
                          <div className="text-sm text-blue-600">
                            {regiao.leads} leads ({regiao.percentual})
                          </div>
                        </div>
                        <div className="text-2xl">🏥</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-blue-600 font-medium">
                          DDD: {regiao.ddd} • Profissionais da Saúde: {regiao.profissionais_saude}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white p-2 rounded border">
                            <div className="font-medium text-red-600">👨‍⚕️ Médicos</div>
                            <div className="text-red-700 font-bold">{regiao.medicos}</div>
                          </div>
                          <div className="bg-white p-2 rounded border">
                            <div className="font-medium text-green-600">🦷 Dentistas</div>
                            <div className="text-green-700 font-bold">{regiao.dentistas}</div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          Outros Prof.: {regiao.outros_prof}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">📊 Resumo Nacional - Profissionais da Saúde por Região</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-red-600">👨‍⚕️ Médicos por Estado</h4>
                      {dadosCorrigidosCHT.regioes_leads.slice(0, 5).map((regiao, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                          <span className="text-sm">{regiao.estado}</span>
                          <span className="font-bold text-red-700">{regiao.medicos} médicos</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-green-600">🦷 Dentistas por Estado</h4>
                      {dadosCorrigidosCHT.regioes_leads.slice(0, 5).map((regiao, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                          <span className="text-sm">{regiao.estado}</span>
                          <span className="font-bold text-green-700">{regiao.dentistas} dentistas</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dadosCorrigidosCHT.regioes_leads.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="estado" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="leads" fill="#3b82f6" name="Total Leads" />
                    <Bar dataKey="medicos" fill="#dc2626" name="Médicos" />
                    <Bar dataKey="dentistas" fill="#16a34a" name="Dentistas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-green-100 text-green-700">CAPTAÇÃO</Badge>
                    </div>
                    <h3 className="font-semibold text-green-700 mb-2">3 Dias Excepcionais</h3>
                    <p className="text-sm text-green-600">
                      <strong>804 leads</strong> captados com CPL R$ {dados.cac} (excelente). 
                      Evolução consistente: 242 → 291 → 271 leads/dia.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-700">PROJEÇÃO</Badge>
                    </div>
                    <h3 className="font-semibold text-blue-700 mb-2">R$ 331k Previsto</h3>
                    <p className="text-sm text-blue-600">
                      <strong>Faturamento previsto</strong> baseado na qualidade dos leads. 
                      ROAS {dados.roas_previsto}. Ainda não há vendas.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-purple-100 text-purple-700">FACEBOOK</Badge>
                    </div>
                    <h3 className="font-semibold text-purple-700 mb-2">Canal Dominante</h3>
                    <p className="text-sm text-purple-600">
                      <strong>88,3% dos leads</strong> (710 leads) via Facebook. 
                      Qualidade excepcional para escalar.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Insights Estratégicos - Análise IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dadosCorrigidosCHT.insights_ia.map((insight, index) => (
                      <div key={index} className={`p-4 border rounded-lg ${
                        insight.categoria === 'CAPTAÇÃO' ? 'bg-green-50 border-green-200' :
                        insight.categoria === 'PROJEÇÃO' ? 'bg-blue-50 border-blue-200' :
                        insight.categoria === 'ESTRATÉGICO' ? 'bg-purple-50 border-purple-200' :
                        insight.categoria === 'CANAIS' ? 'bg-orange-50 border-orange-200' :
                        'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${
                            insight.categoria === 'CAPTAÇÃO' ? 'bg-green-100 text-green-700' :
                            insight.categoria === 'PROJEÇÃO' ? 'bg-blue-100 text-blue-700' :
                            insight.categoria === 'ESTRATÉGICO' ? 'bg-purple-100 text-purple-700' :
                            insight.categoria === 'CANAIS' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {insight.categoria}
                          </Badge>
                          <span className={`font-medium ${
                            insight.categoria === 'CAPTAÇÃO' ? 'text-green-700' :
                            insight.categoria === 'PROJEÇÃO' ? 'text-blue-700' :
                            insight.categoria === 'ESTRATÉGICO' ? 'text-purple-700' :
                            insight.categoria === 'CANAIS' ? 'text-orange-700' :
                            'text-yellow-700'
                          }`}>
                            {insight.insight}
                          </span>
                        </div>
                        <p className={`text-sm mb-2 ${
                          insight.categoria === 'CAPTAÇÃO' ? 'text-green-600' :
                          insight.categoria === 'PROJEÇÃO' ? 'text-blue-600' :
                          insight.categoria === 'ESTRATÉGICO' ? 'text-purple-600' :
                          insight.categoria === 'CANAIS' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}>
                          {insight.detalhes}
                        </p>
                        <div className={`text-xs font-medium ${
                          insight.categoria === 'CAPTAÇÃO' ? 'text-green-700' :
                          insight.categoria === 'PROJEÇÃO' ? 'text-blue-700' :
                          insight.categoria === 'ESTRATÉGICO' ? 'text-purple-700' :
                          insight.categoria === 'CANAIS' ? 'text-orange-700' :
                          'text-yellow-700'
                        }`}>
                          💡 Ação: {insight.acao}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projections">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Projeções Baseadas em Dados Reais (28 dias)
                </CardTitle>
                <CardDescription>
                  Projeção para o lançamento completo baseada na performance dos primeiros 4 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Premissas CHT22 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="text-lg font-bold text-blue-800 mb-4">📋 Premissas CHT22</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium">Meta Captação de LEADs</p>
                      <p className="text-xl font-bold text-blue-800">9.000</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium">TX Conversão</p>
                      <p className="text-xl font-bold text-blue-800">0,70%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium">Preço Ticket Médio de Venda do Curso</p>
                      <p className="text-xl font-bold text-blue-800">R$ 6.300,00</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium">% Vendas de Mentorias sobre as Vendas do Curso</p>
                      <p className="text-xl font-bold text-blue-800">30%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-blue-600 font-medium">Ticket Médio Mentoria</p>
                      <p className="text-xl font-bold text-blue-800">R$ 20.000,00</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">Métrica</th>
                        <th className="border border-gray-300 p-3 text-center">Performance Real (4 dias)</th>
                        <th className="border border-gray-300 p-3 text-center">Projeção 28 dias</th>
                        <th className="border border-gray-300 p-3 text-center">Potencial Otimista</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* SEÇÃO 1: CAPTAÇÃO */}
                      <tr className="bg-blue-50">
                        <td className="border border-gray-300 p-3 font-bold text-blue-800" colSpan="4">📊 CAPTAÇÃO DE LEADS</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Total de Leads</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">1.149</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">8.043</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">10.000+</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">CPL Médio</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">R$ 15,23</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">R$ 22,69</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">R$ 20,00</td>
                      </tr>
                      
                      {/* SEÇÃO 2: CONVERSÃO */}
                      <tr className="bg-green-50">
                        <td className="border border-gray-300 p-3 font-bold text-green-800" colSpan="4">💰 CONVERSÃO E VENDAS</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Quantidade de Vendas</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">0</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">56</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">80</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">Ticket Médio</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">R$ 6.300,00</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">R$ 6.300,00</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">R$ 6.300,00</td>
                      </tr>
                      
                      {/* SEÇÃO 3: FINANCEIRO */}
                      <tr className="bg-orange-50">
                        <td className="border border-gray-300 p-3 font-bold text-orange-800" colSpan="4">📈 RESULTADO FINANCEIRO</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Faturamento Previsto</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">R$ 0</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">R$ 354.696,30</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">R$ 1.008.000,00</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">Investimento Tráfego</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">R$ 17.493,77</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">R$ 122.456,39</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">R$ 200.000,00</td>
                      </tr>
                      <tr className="bg-yellow-50">
                        <td className="border border-gray-300 p-3 font-medium">Investimento Aquecimento + CPL (30%)</td>
                        <td className="border border-gray-300 p-3 text-center text-yellow-600 font-bold">R$ 0</td>
                        <td className="border border-gray-300 p-3 text-center text-yellow-600 font-bold">R$ 60.000,00</td>
                        <td className="border border-gray-300 p-3 text-center text-yellow-600 font-bold">R$ 80.000,00</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="border border-gray-300 p-3 font-medium font-bold">Lucro Bruto</td>
                        <td className="border border-gray-300 p-3 text-center text-green-700 font-bold">R$ 0</td>
                        <td className="border border-gray-300 p-3 text-center text-green-700 font-bold">R$ 172.239,91</td>
                        <td className="border border-gray-300 p-3 text-center text-green-700 font-bold">R$ 728.000,00</td>
                      </tr>
                      
                      {/* SEÇÃO 4: PERFORMANCE */}
                      <tr className="bg-purple-50">
                        <td className="border border-gray-300 p-3 font-bold text-purple-800" colSpan="4">🎯 MÉTRICAS DE PERFORMANCE</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">ROAS (só Captação)</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">-</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">2,90</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">3,50</td>
                      </tr>
                      <tr className="bg-red-50">
                        <td className="border border-gray-300 p-3 font-medium font-bold">ROAS Total (com Aquecimento)</td>
                        <td className="border border-gray-300 p-3 text-center text-red-600 font-bold">-</td>
                        <td className="border border-gray-300 p-3 text-center text-red-600 font-bold">1,94</td>
                        <td className="border border-gray-300 p-3 text-center text-red-600 font-bold">2,80</td>
                      </tr>
                      <tr className="bg-orange-50">
                        <td className="border border-gray-300 p-3 font-medium font-bold">CPL Total Previsto (com Aquecimento)</td>
                        <td className="border border-gray-300 p-3 text-center text-orange-600 font-bold">R$ 15,23</td>
                        <td className="border border-gray-300 p-3 text-center text-orange-600 font-bold">R$ 22,69</td>
                        <td className="border border-gray-300 p-3 text-center text-orange-600 font-bold">R$ 18,25</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Tabela Final de Resumo - Só Curso */}
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">📊 Resultado CHT22 - Apenas Curso</h4>
                  <table className="w-full border-collapse border-2 border-gray-400">
                    <thead>
                      <tr className="bg-yellow-100">
                        <th className="border-2 border-gray-400 p-3 text-center font-bold">FATURAMENTO</th>
                        <th className="border-2 border-gray-400 p-3 text-center font-bold">INVESTIMENTO TOTAL</th>
                        <th className="border-2 border-gray-400 p-3 text-center font-bold">LUCRO BRUTO</th>
                        <th className="border-2 border-gray-400 p-3 text-center font-bold">ROAS TOTAL</th>
                        <th className="border-2 border-gray-400 p-3 text-center font-bold">CPL TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-green-100">
                        <td className="border-2 border-gray-400 p-3 text-center font-bold text-green-700">R$ 354.696,30</td>
                        <td className="border-2 border-gray-400 p-3 text-center font-bold text-orange-700">R$ 182.456,39</td>
                        <td className="border-2 border-gray-400 p-3 text-center font-bold text-blue-700">R$ 172.239,91</td>
                        <td className="border-2 border-gray-400 p-3 text-center font-bold text-red-700">1,94</td>
                        <td className="border-2 border-gray-400 p-3 text-center font-bold text-purple-700">R$ 22,69</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Tabela Final de Resumo - Com Mentoria */}
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-gray-800 mb-4">🎯 Resultado Total - Curso + Mentoria</h4>
                  <table className="w-full border-collapse border-2 border-gray-400">
                    <thead>
                      <tr className="bg-yellow-100">
                        <th className="border-2 border-gray-400 p-3 text-center font-bold">FATURAMENTO</th>
                        <th className="border-2 border-gray-400 p-3 text-center font-bold">INVESTIMENTO TOTAL</th>
                        <th className="border-2 border-gray-400 p-3 text-center font-bold">LUCRO BRUTO</th>
                        <th className="border-2 border-gray-400 p-3 text-center font-bold">ROAS TOTAL</th>
                        <th className="border-2 border-gray-400 p-3 text-center font-bold">CPL TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-blue-100">
                        <td className="border-2 border-gray-400 p-3 text-center font-bold text-green-800">R$ 690.696,30</td>
                        <td className="border-2 border-gray-400 p-3 text-center font-bold text-orange-800">R$ 182.456,39</td>
                        <td className="border-2 border-gray-400 p-3 text-center font-bold text-blue-800">R$ 508.239,91</td>
                        <td className="border-2 border-gray-400 p-3 text-center font-bold text-red-800">3,79</td>
                        <td className="border-2 border-gray-400 p-3 text-center font-bold text-purple-800">R$ 22,69</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Inclui:</strong> 56 vendas do curso + 17 vendas de mentoria (30% das vendas do curso)</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-700 mb-2">🔗 URLs do Projeto CHT22</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-yellow-700">Página de Inscrição:</span>
                      <br />
                      <a href={dadosCorrigidosCHT.urls.inscricao} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {dadosCorrigidosCHT.urls.inscricao}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium text-yellow-700">Página de Vendas:</span>
                      <br />
                      <a href={dadosCorrigidosCHT.urls.vendas} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {dadosCorrigidosCHT.urls.vendas}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 border-t pt-6 mt-8">
          Dashboard IA Nanda Mac Lançamento Tradicional • CHT22 - Curso Viver de Pacientes High Ticket • 
          Dados Reais: 25-27/08/2025 • Atualização: {dados.data_atualizacao} • Build: {BUILD_VERSION}
        </div>
      </div>
    </div>
  )
}

export default App

