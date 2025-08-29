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
  TrendingUp, Target, Users, DollarSign, CheckCircle, AlertTriangle, 
  BarChart3, Stethoscope, MapPin, Brain, Calendar, ExternalLink
} from 'lucide-react'

const CACHE_VERSION = Date.now();
const BUILD_VERSION = "20250828_CHT_REORGANIZADO_" + CACHE_VERSION;

// Dados CORRETOS do lançamento CHT - 28/08/2025 - CAPTAÇÃO EM ANDAMENTO
const dadosCorrigidosCHT = {
  metricas_principais: {
    cac: "15,22",  // CPL CORRETO da planilha (formato brasileiro)
    total_leads: 804,
    roas_previsto: "2,9",  // PREVISTO (correto da planilha - formato brasileiro)
    faturamento_previsto: 330926.40,  // PREVISTO
    investimento_3_dias: "12.237,68",  // 804 × R$ 15,22 (formato brasileiro)
    data_atualizacao: '28/08/2025 - CAPTAÇÃO EM ANDAMENTO (3 dias)'
  },
  insights_ia: [
    {
      categoria: 'CAPTAÇÃO',
      insight: '🚀 CAPTAÇÃO CHT EM ANDAMENTO - 3 DIAS EXCEPCIONAIS',
      detalhes: 'Primeiros 3 dias com 804 leads captados e CPL R$ 15,22 (excelente). Evolução: 25/08 (242) → 26/08 (291) → 27/08 (271). Estamos na fase de captação, não vendas.',
      acao: 'Continuar estratégia atual. Meta: 7.500+ leads em 28 dias. Próxima fase: aquecimento em 08/09.'
    },
    {
      categoria: 'PROJEÇÃO',
      insight: 'Faturamento Previsto: R$ 330.926,40',
      detalhes: 'Baseado nos dados reais de captação e taxas históricas de conversão. ROAS previsto: 2,9. Ainda não há vendas, apenas projeções baseadas na qualidade dos leads.',
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
      detalhes: 'São Paulo e Rio de Janeiro concentram 43,5% dos leads. Padrão esperado para profissionais da saúde com maior poder aquisitivo.',
      acao: 'Manter foco nos grandes centros. Explorar Minas Gerais e Sul como expansão secundária.'
    }
  ],
  // Dados dos canais
  canais: [
    { nome: 'Facebook', leads: 710, percentual: 88.3, prioridade: 'CRÍTICA', cor: '#1877f2', conversao_curso: 0.8, conversao_mentoria: 0.3 },
    { nome: 'Instagram', leads: 69, percentual: 8.6, prioridade: 'ALTA', cor: '#e4405f', conversao_curso: 0.9, conversao_mentoria: 0.4 },
    { nome: 'YouTube', leads: 14, percentual: 1.7, prioridade: 'ALTA', cor: '#ff0000', conversao_curso: 1.2, conversao_mentoria: 0.5 },
    { nome: 'Google Search', leads: 6, percentual: 0.7, prioridade: 'Baixa', cor: '#4285f4', conversao_curso: 0.6, conversao_mentoria: 0.2 },
    { nome: 'Outros', leads: 5, percentual: 0.6, prioridade: 'Baixa', cor: '#6b7280', conversao_curso: 0.4, conversao_mentoria: 0.1 }
  ],
  // Dados dos segmentos
  segmentos: [
    { profissao: 'Dentista', leads: 181, percentual: 22.5, prioridade: 'CRÍTICA', ltv: 8500, cor: '#10b981' },
    { profissao: 'Fisioterapeuta', leads: 128, percentual: 15.9, prioridade: 'ALTA', ltv: 7200, cor: '#3b82f6' },
    { profissao: 'Médico', leads: 122, percentual: 15.2, prioridade: 'CRÍTICA', ltv: 12000, cor: '#8b5cf6' },
    { profissao: 'Nutricionista', leads: 58, percentual: 7.2, prioridade: 'MÉDIA', ltv: 6800, cor: '#f59e0b' },
    { profissao: 'Psicólogo', leads: 30, percentual: 3.7, prioridade: 'MÉDIA', ltv: 6500, cor: '#ef4444' },
    { profissao: 'Outras', leads: 285, percentual: 35.4, prioridade: 'Baixa', ltv: 5500, cor: '#6b7280' }
  ],
  // Dados regionais
  regioes: [
    { estado: 'SP', leads: 200, percentual: 28.4, ddd: ['11', '12', '13', '14', '15', '16', '17', '18', '19'] },
    { estado: 'RJ', leads: 112, percentual: 15.9, ddd: ['21', '22', '24'] },
    { estado: 'MG', leads: 70, percentual: 9.9, ddd: ['31', '32', '33', '34', '35', '37', '38'] },
    { estado: 'PR', leads: 51, percentual: 7.2, ddd: ['41', '42', '43', '44', '45', '46'] },
    { estado: 'RS', leads: 49, percentual: 7.0, ddd: ['51', '53', '54', '55'] },
    { estado: 'SC', leads: 38, percentual: 5.4, ddd: ['47', '48', '49'] },
    { estado: 'BA', leads: 35, percentual: 5.0, ddd: ['71', '73', '74', '75', '77'] },
    { estado: 'GO', leads: 28, percentual: 4.0, ddd: ['62', '64'] },
    { estado: 'PE', leads: 25, percentual: 3.5, ddd: ['81', '87'] },
    { estado: 'CE', leads: 22, percentual: 3.1, ddd: ['85', '88'] },
    { estado: 'Outros', leads: 75, percentual: 10.6, ddd: ['Diversos'] }
  ]
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const dados = dadosCorrigidosCHT.metricas_principais;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-purple-600 mb-2">Dashboard CHT</h2>
          <p className="text-gray-600">Carregando análise de IA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header - APENAS na aba Visão Geral */}
      {activeTab === 'overview' && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Dashboard IA Nanda Mac Lançamento Tradicional</h1>
              <p className="text-xl opacity-90 mb-6">
                Análise de IA • Dados Reais da Captação CHT • Curso Viver de Pacientes High Ticket
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge className="bg-green-100 text-green-700 px-3 py-1">
                  🩺 Profissionais da Saúde: Público-alvo premium
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-700 px-3 py-1">
                  ⭐ Curso + Mentoria: Dupla monetização
                </Badge>
                <Badge className="bg-red-100 text-red-700 px-3 py-1">
                  🚀 Captação em andamento: 3 dias
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Abas de Navegação - SEMPRE VISÍVEIS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
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

          {/* ABA VISÃO GERAL */}
          <TabsContent value="overview">
            {/* Status Financeiro - APENAS na Visão Geral */}
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle className="text-green-800">
                🚀 CAPTAÇÃO CHT EM ANDAMENTO - PERFORMANCE EXCEPCIONAL
              </AlertTitle>
              <AlertDescription className="text-green-700">
                <strong>✅ DADOS REAIS:</strong> {dados.total_leads} leads captados em 3 dias com CPL R$ {dados.cac} (excelente). 
                Faturamento previsto: R$ {(dados.faturamento_previsto / 1000).toFixed(0)}k. ROAS previsto: {dados.roas_previsto}. 
                <strong>Próxima fase: aquecimento em 08/09/2025.</strong>
              </AlertDescription>
            </Alert>

            {/* Cards de Métricas - APENAS na Visão Geral */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ROAS</p>
                      <p className="text-3xl font-bold text-green-600">{dados.roas_previsto}</p>
                      <p className="text-xs text-green-500">✅ Previsto</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
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
                      <p className="text-xs text-purple-500">3 dias captação</p>
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
            </div>

            {/* Segmentos Premium - APENAS na Visão Geral */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Stethoscope className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-700">👑 Profissionais da Saúde</h3>
                      <p className="text-sm text-green-600">Segmento premium com maior LTV</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">519</div>
                      <div className="text-sm text-green-500">Leads Premium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">64,6%</div>
                      <div className="text-sm text-green-500">do Total</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Dentistas:</span>
                      <span className="font-medium">181 leads (22,5%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fisioterapeutas:</span>
                      <span className="font-medium">128 leads (15,9%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Médicos:</span>
                      <span className="font-medium">122 leads (15,2%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-700">⭐ Facebook Premium</h3>
                      <p className="text-sm text-blue-600">Canal dominante com excelente qualidade</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">710</div>
                      <div className="text-sm text-blue-500">Leads Facebook</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">88,3%</div>
                      <div className="text-sm text-blue-500">Participação</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>CPL:</span>
                      <span className="font-medium">R$ 15,22 (excelente)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Qualidade:</span>
                      <span className="font-medium">ALTA conversão</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estratégia:</span>
                      <span className="font-medium">Escalar investimento</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ABA ORIGEM & CONVERSÃO */}
          <TabsContent value="sources">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Análise por Canal de Origem</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dadosCorrigidosCHT.canais.map((canal, index) => (
                  <Card key={index} className={`border-l-4 hover:shadow-lg transition-shadow`} 
                        style={{borderLeftColor: canal.cor}}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold" style={{color: canal.cor}}>
                            {canal.nome}
                          </h3>
                          <Badge className={`mt-1 ${
                            canal.prioridade === 'CRÍTICA' ? 'bg-red-100 text-red-700' :
                            canal.prioridade === 'ALTA' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {canal.prioridade}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{color: canal.cor}}>
                            {canal.leads}
                          </div>
                          <div className="text-sm text-gray-500">
                            {canal.percentual}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Conversão Curso:</span>
                          <span className="font-medium">{canal.conversao_curso}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conversão Mentoria:</span>
                          <span className="font-medium">{canal.conversao_mentoria}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ABA SEGMENTOS ESTRATÉGICOS */}
          <TabsContent value="segments">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🩺 Segmentação por Profissão</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dadosCorrigidosCHT.segmentos.map((segmento, index) => (
                  <Card key={index} className={`border-l-4 hover:shadow-lg transition-shadow`} 
                        style={{borderLeftColor: segmento.cor}}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold" style={{color: segmento.cor}}>
                            {segmento.profissao}
                          </h3>
                          <Badge className={`mt-1 ${
                            segmento.prioridade === 'CRÍTICA' ? 'bg-red-100 text-red-700' :
                            segmento.prioridade === 'ALTA' ? 'bg-yellow-100 text-yellow-700' :
                            segmento.prioridade === 'MÉDIA' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {segmento.prioridade}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{color: segmento.cor}}>
                            {segmento.leads}
                          </div>
                          <div className="text-sm text-gray-500">
                            {segmento.percentual}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-lg font-medium" style={{color: segmento.cor}}>
                        {segmento.percentual}%
                      </div>
                      <div className="text-sm text-gray-600">
                        LTV Previsto: R$ {(segmento.leads * segmento.ltv).toLocaleString()} | Meta histórica
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ABA ANÁLISE REGIONAL */}
          <TabsContent value="regional">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🗺️ Distribuição Regional</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dadosCorrigidosCHT.regioes.map((regiao, index) => (
                  <Card key={index} className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-blue-700">
                            {regiao.estado}
                          </h3>
                          <div className="text-sm text-gray-500">
                            DDDs: {regiao.ddd.join(', ')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {regiao.leads}
                          </div>
                          <div className="text-sm text-gray-500">
                            {regiao.percentual}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ABA INSIGHTS DE IA */}
          <TabsContent value="insights">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🧠 Insights Estratégicos de IA</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dadosCorrigidosCHT.insights_ia.map((insight, index) => (
                  <Card key={index} className={`border-l-4 ${
                    insight.categoria === 'CAPTAÇÃO' ? 'border-green-500 bg-green-50' :
                    insight.categoria === 'PROJEÇÃO' ? 'border-blue-500 bg-blue-50' :
                    insight.categoria === 'ESTRATÉGICO' ? 'border-purple-500 bg-purple-50' :
                    insight.categoria === 'CANAIS' ? 'border-yellow-500 bg-yellow-50' :
                    'border-gray-500 bg-gray-50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${
                          insight.categoria === 'CAPTAÇÃO' ? 'bg-green-100 text-green-700' :
                          insight.categoria === 'PROJEÇÃO' ? 'bg-blue-100 text-blue-700' :
                          insight.categoria === 'ESTRATÉGICO' ? 'bg-purple-100 text-purple-700' :
                          insight.categoria === 'CANAIS' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {insight.categoria}
                        </Badge>
                      </div>
                      <h3 className={`font-semibold mb-2 ${
                        insight.categoria === 'CAPTAÇÃO' ? 'text-green-700' :
                        insight.categoria === 'PROJEÇÃO' ? 'text-blue-700' :
                        insight.categoria === 'ESTRATÉGICO' ? 'text-purple-700' :
                        insight.categoria === 'CANAIS' ? 'text-yellow-700' :
                        'text-gray-700'
                      }`}>
                        {insight.insight}
                      </h3>
                      <p className={`text-sm mb-3 ${
                        insight.categoria === 'CAPTAÇÃO' ? 'text-green-600' :
                        insight.categoria === 'PROJEÇÃO' ? 'text-blue-600' :
                        insight.categoria === 'ESTRATÉGICO' ? 'text-purple-600' :
                        insight.categoria === 'CANAIS' ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {insight.detalhes}
                      </p>
                      <div className={`text-xs font-medium ${
                        insight.categoria === 'CAPTAÇÃO' ? 'text-green-700' :
                        insight.categoria === 'PROJEÇÃO' ? 'text-blue-700' :
                        insight.categoria === 'ESTRATÉGICO' ? 'text-purple-700' :
                        insight.categoria === 'CANAIS' ? 'text-yellow-700' :
                        'text-gray-700'
                      }`}>
                        💡 Ação: {insight.acao}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* ABA PROJEÇÕES DO RESULTADO */}
          <TabsContent value="projections">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Projeções e Cenários</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Comparativo de Cenários - 28 Dias</CardTitle>
                  <CardDescription>Baseado nos dados reais de captação dos primeiros 3 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-3 text-left font-medium">Métrica</th>
                          <th className="border border-gray-300 p-3 text-center font-medium text-gray-600">Atual (3 dias)</th>
                          <th className="border border-gray-300 p-3 text-center font-medium text-blue-600">Conservador (28 dias)</th>
                          <th className="border border-gray-300 p-3 text-center font-medium text-purple-600">Realista (28 dias)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium">Total de Leads</td>
                          <td className="border border-gray-300 p-3 text-center text-gray-600 font-bold">804</td>
                          <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">7.504</td>
                          <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">9.380</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium">CPL Médio</td>
                          <td className="border border-gray-300 p-3 text-center text-gray-600 font-bold">R$ 15,22</td>
                          <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">R$ 15,22</td>
                          <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">R$ 14,50</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium">Investimento Total</td>
                          <td className="border border-gray-300 p-3 text-center text-gray-600 font-bold">R$ 12.237</td>
                          <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">R$ 114.211</td>
                          <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">R$ 136.010</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium">Vendas Curso</td>
                          <td className="border border-gray-300 p-3 text-center text-gray-600 font-bold">0</td>
                          <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">47</td>
                          <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">75</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium">Vendas Mentoria</td>
                          <td className="border border-gray-300 p-3 text-center text-gray-600 font-bold">0</td>
                          <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">14</td>
                          <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">23</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium">Receita Bruta</td>
                          <td className="border border-gray-300 p-3 text-center text-gray-600 font-bold">R$ 0</td>
                          <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">R$ {(dados.faturamento_previsto / 1000).toFixed(0)}k</td>
                          <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">R$ 1.008k</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-3 font-medium">ROAS</td>
                          <td className="border border-gray-300 p-3 text-center text-gray-600 font-bold">-</td>
                          <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">{dados.roas_previsto}</td>
                          <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">7,41</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-700">📊 Cenário Conservador</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• 7.504 leads projetados</li>
                      <li>• R$ {(dados.faturamento_previsto / 1000).toFixed(0)}k receita bruta</li>
                      <li>• ROAS {dados.roas_previsto} previsto</li>
                      <li>• Baseado em dados reais</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-purple-700">🚀 Cenário Realista</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-purple-600 space-y-1">
                      <li>• 9.380 leads otimizados</li>
                      <li>• R$ 1.008k receita bruta</li>
                      <li>• ROAS 7,41+</li>
                      <li>• Com otimizações</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>🔗 URLs do Projeto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Página de Inscrição</div>
                        <div className="text-sm text-gray-600">Para captação de leads</div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://nandamac.com/cht/inscricao-cht" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Acessar
                        </a>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Página de Vendas</div>
                        <div className="text-sm text-gray-600">Para conversão em vendas</div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href="https://nandamac.com/cht/pgv-cht" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Acessar
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Dashboard;

