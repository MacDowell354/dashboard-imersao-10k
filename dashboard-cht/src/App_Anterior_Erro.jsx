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
const BUILD_VERSION = "20250828_CHT_REAL_" + CACHE_VERSION;

// Dados REAIS do lançamento CHT - 28/08/2025 - LANÇAMENTO EM ANDAMENTO
const dadosReaisCHT = {
  metricas_principais: {
    roas: 2.29,
    cac: 25.00,
    total_leads: 804,
    faturamento: 45988.00,
    investimento: 20100.00,
    lucro: 25888.00,
    ticket_medio: 57.22,
    data_atualizacao: '28/08/2025 - LANÇAMENTO EM ANDAMENTO (3 dias)'
  },
  insights_ia: [
    {
      categoria: 'POSITIVO',
      insight: '🚀 LANÇAMENTO CHT EM ANDAMENTO - 3 DIAS',
      detalhes: 'Primeiros 3 dias EXCEPCIONAIS: 804 leads captados com CPL R$ 25 (excelente). Evolução: 25/08 (242) → 26/08 (291) → 27/08 (271). Facebook dominante com 88,3% dos leads.',
      acao: 'Continuar estratégia atual. Meta: 7.500+ leads em 28 dias. Próxima fase: aquecimento em 08/09.'
    },
    {
      categoria: 'ESTRATÉGICO',
      insight: 'Segmentação Premium Confirmada - Profissionais da Saúde',
      detalhes: 'Profissionais da saúde: 75,5% dos leads (519 leads). Dentistas lideram (181), seguidos por Fisioterapeutas (128) e Médicos (122). Público premium validado.',
      acao: 'Focar conteúdo específico para cada especialidade. Dentistas e Médicos têm maior LTV potencial.'
    },
    {
      categoria: 'SUCESSO',
      insight: 'Facebook: Canal Dominante com Performance Excepcional',
      detalhes: 'Facebook: 710 leads (88,3%) com excelente qualidade. Instagram: 69 leads (8,6%). YouTube: 14 leads (1,7%). Concentração estratégica funcionando.',
      acao: 'Escalar investimento no Facebook. Testar expansão gradual para Instagram e YouTube mantendo qualidade.'
    },
    {
      categoria: 'REGIONAL',
      insight: 'Concentração SP/RJ - Grandes Centros Urbanos',
      detalhes: 'SP (200 leads - 28,4%) e RJ (112 leads - 15,9%) representam 44,3% dos leads com telefone. MG (70), PR (51), RS (49) completam top 5.',
      acao: 'Aproveitar concentração em grandes centros. Considerar eventos presenciais em SP/RJ para maximizar conversões.'
    },
    {
      categoria: 'PROJEÇÃO',
      insight: 'Projeção 28 Dias: R$ 583k Receita Bruta',
      detalhes: 'Projeção baseada em dados reais: 7.504 leads → 46 vendas curso + 14 mentoria → R$ 583k receita bruta → R$ 396k líquida → ROAS 3,11.',
      acao: 'Manter qualidade da captação. Preparar estrutura para volume 10x maior. Evento será decisivo para conversões.'
    }
  ],
  leads_por_canal: [
    { 
      canal: 'Facebook', 
      leads: 710, 
      percentual: 88.3, 
      cor: '#4267B2',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'ALTA',
      prioridade: 'CRÍTICA'
    },
    { 
      canal: 'Instagram', 
      leads: 69, 
      percentual: 8.6, 
      cor: '#E4405F',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'MÁXIMA',
      prioridade: 'ALTA'
    },
    { 
      canal: 'YouTube', 
      leads: 14, 
      percentual: 1.7, 
      cor: '#FF0000',
      conversao_curso: 'MÁXIMA',
      conversao_mentoria: 'MÁXIMA',
      prioridade: 'ALTA'
    },
    { 
      canal: 'Google Search', 
      leads: 6, 
      percentual: 0.7, 
      cor: '#4285F4',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'MÉDIA',
      prioridade: 'MÉDIA'
    },
    { 
      canal: 'Outros', 
      leads: 5, 
      percentual: 0.6, 
      cor: '#6b7280',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa'
    }
  ],
  segmentos_profissao: [
    { 
      profissao: 'Outras', 
      leads: 285, 
      percentual: 35.4, 
      ltv: 1200,
      conversao_curso: 'MÉDIA',
      conversao_mentoria: 'BAIXA',
      prioridade: 'MÉDIA'
    },
    { 
      profissao: 'Dentista', 
      leads: 181, 
      percentual: 22.5, 
      ltv: 1500,
      conversao_curso: 'ALTA',
      conversao_mentoria: 'ALTA',
      prioridade: 'CRÍTICA'
    },
    { 
      profissao: 'Fisioterapeuta', 
      leads: 128, 
      percentual: 15.9, 
      ltv: 1200,
      conversao_curso: 'MÉDIA',
      conversao_mentoria: 'MÉDIA',
      prioridade: 'ALTA'
    },
    { 
      profissao: 'Médico', 
      leads: 122, 
      percentual: 15.2, 
      ltv: 2500,
      conversao_curso: 'ALTA',
      conversao_mentoria: 'MÁXIMA',
      prioridade: 'CRÍTICA'
    },
    { 
      profissao: 'Nutricionista', 
      leads: 58, 
      percentual: 7.2, 
      ltv: 800,
      conversao_curso: 'MÉDIA',
      conversao_mentoria: 'BAIXA',
      prioridade: 'MÉDIA'
    },
    { 
      profissao: 'Psicólogo', 
      leads: 30, 
      percentual: 3.7, 
      ltv: 700,
      conversao_curso: 'BAIXA',
      conversao_mentoria: 'BAIXA',
      prioridade: 'Baixa'
    }
  ],
  regioes_leads: [
    { estado: 'SP', leads: 200, percentual: 28.4, ddd: '11' },
    { estado: 'RJ', leads: 112, percentual: 15.9, ddd: '21' },
    { estado: 'MG', leads: 70, percentual: 9.9, ddd: '31' },
    { estado: 'PR', leads: 51, percentual: 7.2, ddd: '41' },
    { estado: 'RS', leads: 49, percentual: 7.0, ddd: '51' },
    { estado: 'BA', leads: 37, percentual: 5.2, ddd: '71' },
    { estado: 'SC', leads: 32, percentual: 4.5, ddd: '47' },
    { estado: 'PE', leads: 22, percentual: 3.1, ddd: '81' },
    { estado: 'DF', leads: 19, percentual: 2.7, ddd: '61' },
    { estado: 'CE', leads: 18, percentual: 2.6, ddd: '85' },
    { estado: 'Outros', leads: 135, percentual: 19.1, ddd: 'XX' }
  ],
  evolucao_diaria: [
    { dia: '25/08', leads: 242, acumulado: 242 },
    { dia: '26/08', leads: 291, acumulado: 533 },
    { dia: '27/08', leads: 271, acumulado: 804 }
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

  const dados = dadosReaisCHT.metricas_principais

  // Preparar dados para gráficos
  const dadosGraficoPizza = dadosReaisCHT.leads_por_canal.map(canal => ({
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
          <p className="text-gray-600">Processando dados reais do lançamento...</p>
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
              Dashboard IA para Eventos Imersivos
            </h1>
            <p className="text-gray-600 text-lg">
              Análise de IA • Dados Reais do Lançamento CHT • Curso Viver de Pacientes High Ticket
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Badge className="bg-green-100 text-green-700 px-3 py-1">
                🎯 Profissionais da Saúde: Público-alvo premium
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-700 px-3 py-1">
                ⭐ Curso + Mentoria: Dupla monetização
              </Badge>
              <Badge className="bg-red-100 text-red-700 px-3 py-1">
                🚀 Lançamento em andamento: 3 dias
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Status Financeiro */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="text-green-800">
            🚀 LANÇAMENTO CHT EM ANDAMENTO - PERFORMANCE EXCEPCIONAL
          </AlertTitle>
          <AlertDescription className="text-green-700">
            <strong>✅ DADOS REAIS:</strong> {dados.total_leads} leads captados em 3 dias com CPL R$ {dados.cac} (excelente). 
            ROAS {dados.roas} positivo. Facebook dominante (88,3%). Profissionais da saúde: 75,5% dos leads. 
            <strong>Próxima fase: aquecimento em 08/09/2025.</strong>
          </AlertDescription>
        </Alert>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROAS</p>
                  <p className="text-3xl font-bold text-green-600">{dados.roas}</p>
                  <p className="text-xs text-green-500">✅ Positivo</p>
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
                  <p className="text-3xl font-bold text-orange-600">R$ {(dados.faturamento / 1000).toFixed(0)}k</p>
                  <p className="text-xs text-orange-500">Receita atual</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
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
                  <div className="text-3xl font-bold text-green-700">519</div>
                  <div className="text-sm text-green-600">Leads Premium</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">75,5%</div>
                  <div className="text-sm text-green-600">do Total</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Dentistas:</span>
                  <span className="font-medium">181 leads (22,5%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Fisioterapeutas:</span>
                  <span className="font-medium">128 leads (15,9%)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Médicos:</span>
                  <span className="font-medium">122 leads (15,2%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Star className="h-5 w-5" />
                Facebook Premium
              </CardTitle>
              <CardDescription className="text-blue-600">
                Canal dominante com excelente qualidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700">710</div>
                  <div className="text-sm text-blue-600">Leads Facebook</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-700">88,3%</div>
                  <div className="text-sm text-blue-600">Participação</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Qualidade:</span>
                  <span className="font-medium">ALTA conversão</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Estratégia:</span>
                  <span className="font-medium">Escalar investimento</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Potencial:</span>
                  <span className="font-medium">Expandir para IG/YT</span>
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
                    <AreaChart data={dadosReaisCHT.evolucao_diaria}>
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
                  Cronograma do Lançamento CHT
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dadosReaisCHT.cronograma.map((item, index) => (
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
                  {dadosReaisCHT.leads_por_canal.map((canal, index) => (
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
                  {dadosReaisCHT.segmentos_profissao.map((segmento, index) => (
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
                  Distribuição de 705 leads com telefone por estado brasileiro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {dadosReaisCHT.regioes_leads.slice(0, 9).map((regiao, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-blue-50 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-bold text-blue-700">{regiao.estado}</div>
                          <div className="text-sm text-blue-600">
                            {regiao.leads} leads ({regiao.percentual}%)
                          </div>
                        </div>
                        <div className="text-2xl">🏥</div>
                      </div>
                      <div className="mt-2 text-xs text-blue-600">
                        DDD: {regiao.ddd} • Profissionais da Saúde
                      </div>
                    </div>
                  ))}
                </div>
                
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={dadosReaisCHT.regioes_leads.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="estado" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="leads" fill="#3b82f6" />
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
                      <Badge className="bg-green-100 text-green-700">LANÇAMENTO</Badge>
                    </div>
                    <h3 className="font-semibold text-green-700 mb-2">3 Dias Excepcionais</h3>
                    <p className="text-sm text-green-600">
                      <strong>804 leads</strong> captados com CPL R$ 25 (excelente). 
                      Evolução consistente: 242 → 291 → 271 leads/dia.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-100 text-blue-700">FACEBOOK</Badge>
                    </div>
                    <h3 className="font-semibold text-blue-700 mb-2">Canal Dominante</h3>
                    <p className="text-sm text-blue-600">
                      <strong>88,3% dos leads</strong> (710 leads) via Facebook. 
                      Qualidade excepcional, estratégia de escalar investimento.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-purple-100 text-purple-700">SEGMENTAÇÃO</Badge>
                    </div>
                    <h3 className="font-semibold text-purple-700 mb-2">Premium Validado</h3>
                    <p className="text-sm text-purple-600">
                      <strong>75,5% profissionais da saúde</strong> (519 leads). 
                      Dentistas (181), Fisioterapeutas (128), Médicos (122).
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
                    {dadosReaisCHT.insights_ia.map((insight, index) => (
                      <div key={index} className={`p-4 border rounded-lg ${
                        insight.categoria === 'POSITIVO' ? 'bg-green-50 border-green-200' :
                        insight.categoria === 'ESTRATÉGICO' ? 'bg-blue-50 border-blue-200' :
                        insight.categoria === 'SUCESSO' ? 'bg-purple-50 border-purple-200' :
                        insight.categoria === 'REGIONAL' ? 'bg-orange-50 border-orange-200' :
                        'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${
                            insight.categoria === 'POSITIVO' ? 'bg-green-100 text-green-700' :
                            insight.categoria === 'ESTRATÉGICO' ? 'bg-blue-100 text-blue-700' :
                            insight.categoria === 'SUCESSO' ? 'bg-purple-100 text-purple-700' :
                            insight.categoria === 'REGIONAL' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {insight.categoria}
                          </Badge>
                          <span className={`font-medium ${
                            insight.categoria === 'POSITIVO' ? 'text-green-700' :
                            insight.categoria === 'ESTRATÉGICO' ? 'text-blue-700' :
                            insight.categoria === 'SUCESSO' ? 'text-purple-700' :
                            insight.categoria === 'REGIONAL' ? 'text-orange-700' :
                            'text-yellow-700'
                          }`}>
                            {insight.insight}
                          </span>
                        </div>
                        <p className={`text-sm mb-2 ${
                          insight.categoria === 'POSITIVO' ? 'text-green-600' :
                          insight.categoria === 'ESTRATÉGICO' ? 'text-blue-600' :
                          insight.categoria === 'SUCESSO' ? 'text-purple-600' :
                          insight.categoria === 'REGIONAL' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}>
                          {insight.detalhes}
                        </p>
                        <div className={`text-xs font-medium ${
                          insight.categoria === 'POSITIVO' ? 'text-green-700' :
                          insight.categoria === 'ESTRATÉGICO' ? 'text-blue-700' :
                          insight.categoria === 'SUCESSO' ? 'text-purple-700' :
                          insight.categoria === 'REGIONAL' ? 'text-orange-700' :
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
                  Projeção para o lançamento completo baseada na performance dos primeiros 3 dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">Métrica</th>
                        <th className="border border-gray-300 p-3 text-center">Performance Real (3 dias)</th>
                        <th className="border border-gray-300 p-3 text-center">Projeção 28 dias</th>
                        <th className="border border-gray-300 p-3 text-center">Potencial Otimista</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Total de Leads</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">804</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">7.504</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">10.000+</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">CPL Médio</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">R$ 25,00</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">R$ 25,00</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">R$ 22,00</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Vendas Curso (0,62%)</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">4</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">46</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">80</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">Vendas Mentoria (30%)</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">1</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">14</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">24</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-3 font-medium">Receita Bruta</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">R$ 45.988</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">R$ 583.862</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">R$ 1.007.600</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 p-3 font-medium">ROAS</td>
                        <td className="border border-gray-300 p-3 text-center text-green-600 font-bold">2,29</td>
                        <td className="border border-gray-300 p-3 text-center text-blue-600 font-bold">3,11</td>
                        <td className="border border-gray-300 p-3 text-center text-purple-600 font-bold">4,58</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-700 mb-2">📈 Performance Real (3 dias)</h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• 804 leads com CPL R$ 25</li>
                      <li>• Facebook dominante (88,3%)</li>
                      <li>• Profissionais saúde (75,5%)</li>
                      <li>• ROAS positivo (2,29)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">🎯 Projeção Conservadora (28 dias)</h4>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li>• 7.504 leads projetados</li>
                      <li>• R$ 583k receita bruta</li>
                      <li>• R$ 396k receita líquida</li>
                      <li>• ROAS 3,11</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-700 mb-2">🚀 Cenário Otimista</h4>
                    <ul className="text-sm text-purple-600 space-y-1">
                      <li>• 10.000+ leads (otimização)</li>
                      <li>• R$ 1M+ receita bruta</li>
                      <li>• R$ 787k+ receita líquida</li>
                      <li>• ROAS 4,58+</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-700 mb-2">🔗 URLs do Projeto CHT</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-yellow-700">Página de Inscrição:</span>
                      <br />
                      <a href={dadosReaisCHT.urls.inscricao} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {dadosReaisCHT.urls.inscricao}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium text-yellow-700">Página de Vendas:</span>
                      <br />
                      <a href={dadosReaisCHT.urls.vendas} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {dadosReaisCHT.urls.vendas}
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
          Dashboard IA para Eventos Imersivos • CHT - Curso Viver de Pacientes High Ticket • 
          Dados Reais: 25-27/08/2025 • Atualização: {dados.data_atualizacao} • Build: {BUILD_VERSION}
        </div>
      </div>
    </div>
  )
}

export default App

