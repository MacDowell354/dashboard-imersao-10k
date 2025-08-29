import { useState, useEffect } from 'react'
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
  UserCheck, Stethoscope, Activity, CheckCircle, AlertCircle, Crown, Star, MapPin,
  GraduationCap, BookOpen, Clock, Zap
} from 'lucide-react'
import { gerarDadosExemplo, prepararDadosGraficos } from './utils/regiaoAnalise.js'
import './App.css'

// Cache Busting - Força atualização
const CACHE_VERSION = Date.now();
const BUILD_VERSION = "CHT_20250822_" + CACHE_VERSION;

// Dados do Dashboard CHT - Curso Viver de Pacientes High Ticket
const dadosCHT = {
  metricas_principais: {
    total_leads: 346,
    valor_curso: 5997.00,
    taxa_conversao: 0.007, // 0.7%
    vendas_projetadas: 2,
    faturamento_projetado: 14524,
    periodo_captacao: "25/08/2025 a 21/09/2025",
    dias_captacao: 28,
    abertura_carrinho: "21/09/2025",
    data_atualizacao: "22/08/2025"
  },
  
  fontes_trafego: [
    { fonte: "YouTube", leads: 127, percentual: 36.7, cor: "#FF0000" },
    { fonte: "Facebook", leads: 90, percentual: 26.0, cor: "#1877F2" },
    { fonte: "Google Search", leads: 83, percentual: 24.0, cor: "#4285F4" },
    { fonte: "Instagram", leads: 39, percentual: 11.3, cor: "#E4405F" },
    { fonte: "ManyChat", leads: 5, percentual: 1.4, cor: "#00D2FF" },
    { fonte: "Email", leads: 2, percentual: 0.6, cor: "#34D399" }
  ],
  
  cronograma_aulas: [
    { data: "08/09/2025", tipo: "Aquecimento", descricao: "Início das aulas de aquecimento", status: "pendente" },
    { data: "15/09/2025", tipo: "CPL 1", descricao: "Primeira aula gratuita do curso", status: "pendente" },
    { data: "17/09/2025", tipo: "CPL 2", descricao: "Segunda aula gratuita do curso", status: "pendente" },
    { data: "19/09/2025", tipo: "CPL 3", descricao: "Terceira aula gratuita do curso", status: "pendente" },
    { data: "21/09/2025", tipo: "CPL 4 + Carrinho", descricao: "Quarta aula + Abertura do carrinho", status: "pendente" }
  ],
  
  insights_ia: [
    {
      categoria: 'INFORMATIVO',
      insight: '📊 DADOS DE TESTE - LANÇAMENTO REAL EM 25/08',
      detalhes: 'Dashboard configurado com dados de teste. Total atual: 346 leads. Lançamento real inicia em 25/08/2025.',
      acao: 'Aguardar início da captação real para análises precisas.',
      prioridade: 'info'
    },
    {
      categoria: 'PROJEÇÃO',
      insight: '🎯 PROJEÇÃO CONSERVADORA - 0,7% CONVERSÃO',
      detalhes: 'Com 346 leads atuais, projeção: 2 vendas = R$ 14.524,00. Meta conservadora baseada em histórico.',
      acao: 'Monitorar captação diária para ajustar projeções conforme performance real.',
      prioridade: 'success'
    },
    {
      categoria: 'ESTRATÉGICO',
      insight: '📅 CRONOGRAMA DE 28 DIAS DE CAPTAÇÃO',
      detalhes: 'Período otimizado: 25/08 a 21/09 (28 dias). Aulas de aquecimento a partir de 08/09. CPLs de 15/09 a 21/09.',
      acao: 'Focar captação intensa nos primeiros 14 dias para maximizar audiência nas CPLs.',
      prioridade: 'warning'
    },
    {
      categoria: 'OPORTUNIDADE',
      insight: '🚀 YOUTUBE COMO PRINCIPAL FONTE (36,7%)',
      detalhes: 'YouTube lidera com 127 leads (36,7%), seguido por Facebook (90 leads, 26%). Estratégia de conteúdo funcionando.',
      acao: 'Intensificar produção de conteúdo no YouTube e replicar estratégias de sucesso no Facebook.',
      prioridade: 'success'
    }
  ]
}

// Cores do tema CHT (baseado no dashboard anterior)
const CORES = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6'
}

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [dadosRegionais, setDadosRegionais] = useState(null)

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setIsLoading(false)
      // Gerar dados regionais de exemplo
      const distribuicao = gerarDadosExemplo()
      const dadosGraficos = prepararDadosGraficos(distribuicao)
      setDadosRegionais(dadosGraficos)
    }, 1000)
  }, [])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  const getStatusIcon = (categoria) => {
    switch (categoria) {
      case 'POSITIVO':
      case 'OPORTUNIDADE':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'CRÍTICO':
      case 'ATENÇÃO':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'ESTRATÉGICO':
      case 'PROJEÇÃO':
        return <Target className="h-5 w-5 text-blue-500" />
      default:
        return <Brain className="h-5 w-5 text-purple-500" />
    }
  }

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case 'success': return 'border-l-green-500 bg-green-50'
      case 'warning': return 'border-l-yellow-500 bg-yellow-50'
      case 'danger': return 'border-l-red-500 bg-red-50'
      default: return 'border-l-blue-500 bg-blue-50'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando Dashboard CHT...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard CHT</h1>
                <p className="text-sm text-gray-600">Curso Viver de Pacientes High Ticket</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                Ativo
              </Badge>
              <div className="text-right">
                <p className="text-sm text-gray-500">Última atualização</p>
                <p className="text-sm font-medium text-gray-900">{dadosCHT.metricas_principais.data_atualizacao}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total de Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{formatNumber(dadosCHT.metricas_principais.total_leads)}</p>
                  <p className="text-xs opacity-75 mt-1">Dados de teste</p>
                </div>
                <Users className="h-8 w-8 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Faturamento Projetado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{formatCurrency(dadosCHT.metricas_principais.faturamento_projetado)}</p>
                  <p className="text-xs opacity-75 mt-1">Taxa 0,7%</p>
                </div>
                <DollarSign className="h-8 w-8 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Valor do Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{formatCurrency(dadosCHT.metricas_principais.valor_curso)}</p>
                  <p className="text-xs opacity-75 mt-1">High Ticket</p>
                </div>
                <Crown className="h-8 w-8 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Vendas Projetadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{dadosCHT.metricas_principais.vendas_projetadas}</p>
                  <p className="text-xs opacity-75 mt-1">Cenário conservador</p>
                </div>
                <Target className="h-8 w-8 opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="fontes" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Fontes de Tráfego
            </TabsTrigger>
            <TabsTrigger value="regional" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Análise Regional
            </TabsTrigger>
            <TabsTrigger value="cronograma" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Cronograma
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Insights IA
            </TabsTrigger>
          </TabsList>

          {/* Tab: Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações do Lançamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    Informações do Lançamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Período de Captação</p>
                      <p className="font-semibold">{dadosCHT.metricas_principais.periodo_captacao}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duração</p>
                      <p className="font-semibold">{dadosCHT.metricas_principais.dias_captacao} dias</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Abertura do Carrinho</p>
                      <p className="font-semibold">{dadosCHT.metricas_principais.abertura_carrinho}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Taxa de Conversão</p>
                      <p className="font-semibold">{(dadosCHT.metricas_principais.taxa_conversao * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">URLs do Projeto</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Página de Inscrição</span>
                        <Button variant="outline" size="sm" onClick={() => window.open('https://nandamac.com/cht/inscricao-cht', '_blank')}>
                          Acessar
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Página de Vendas</span>
                        <Button variant="outline" size="sm" onClick={() => window.open('https://nandamac.com/cht/pgv-cht', '_blank')}>
                          Acessar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progresso da Captação */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Progresso da Captação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-indigo-600">{formatNumber(dadosCHT.metricas_principais.total_leads)}</p>
                    <p className="text-sm text-gray-500">Leads Captados (Teste)</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Meta Conservadora (1000 leads)</span>
                      <span>{((dadosCHT.metricas_principais.total_leads / 1000) * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={(dadosCHT.metricas_principais.total_leads / 1000) * 100} className="h-2" />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{dadosCHT.metricas_principais.vendas_projetadas}</p>
                        <p className="text-xs text-gray-500">Vendas Projetadas</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(dadosCHT.metricas_principais.faturamento_projetado)}</p>
                        <p className="text-xs text-gray-500">Faturamento</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Fontes de Tráfego */}
          <TabsContent value="fontes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Pizza */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Fonte</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dadosCHT.fontes_trafego}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ fonte, percentual }) => `${fonte}: ${percentual}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="leads"
                      >
                        {dadosCHT.fontes_trafego.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatNumber(value), 'Leads']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Lista de Fontes */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalhamento por Fonte</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dadosCHT.fontes_trafego.map((fonte, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: fonte.cor }}
                          ></div>
                          <span className="font-medium">{fonte.fonte}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatNumber(fonte.leads)}</p>
                          <p className="text-sm text-gray-500">{fonte.percentual}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Análise Regional */}
          <TabsContent value="regional" className="space-y-6">
            <Alert className="border-l-4 border-l-blue-500 bg-blue-50">
              <MapPin className="h-4 w-4" />
              <AlertTitle>Análise Regional por DDD</AlertTitle>
              <AlertDescription>
                Esta análise será baseada nos prefixos telefônicos dos leads captados. 
                Dados de exemplo são mostrados para demonstração da funcionalidade.
              </AlertDescription>
            </Alert>

            {dadosRegionais && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribuição por Região */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Região</CardTitle>
                    <CardDescription>Leads por região geográfica do Brasil</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dadosRegionais.por_regiao}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ regiao, percentual }) => `${regiao}: ${percentual}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="leads"
                        >
                          {dadosRegionais.por_regiao.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [formatNumber(value), 'Leads']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top Estados */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Estados</CardTitle>
                    <CardDescription>Estados com maior captação de leads</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dadosRegionais.por_estado.slice(0, 8).map((estado, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-indigo-600">{estado.estado}</span>
                            </div>
                            <span className="font-medium">{estado.estado}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatNumber(estado.leads)}</p>
                            <p className="text-sm text-gray-500">{estado.percentual}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Gráfico de Barras por Estado */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Distribuição Detalhada por Estado</CardTitle>
                    <CardDescription>Comparativo de leads por estado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dadosRegionais.por_estado.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="estado" />
                        <YAxis />
                        <Tooltip formatter={(value) => [formatNumber(value), 'Leads']} />
                        <Bar dataKey="leads" fill="#6366f1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Detalhamento por DDD */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Detalhamento por DDD</CardTitle>
                    <CardDescription>Análise detalhada por código de área</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dadosRegionais.por_ddd.slice(0, 12).map((ddd, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-bold text-indigo-600">({ddd.ddd})</span>
                            <Badge variant="outline">{ddd.estado}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{ddd.cidade}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{formatNumber(ddd.leads)} leads</span>
                            <span className="text-sm text-gray-500">{ddd.percentual}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Tab: Cronograma */}
          <TabsContent value="cronograma" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Cronograma do Lançamento CHT
                </CardTitle>
                <CardDescription>
                  Acompanhe as datas importantes do lançamento do Curso Viver de Pacientes High Ticket
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dadosCHT.cronograma_aulas.map((aula, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          {aula.tipo.includes('CPL') ? (
                            <BookOpen className="h-6 w-6 text-indigo-600" />
                          ) : aula.tipo === 'Aquecimento' ? (
                            <Zap className="h-6 w-6 text-orange-600" />
                          ) : (
                            <Crown className="h-6 w-6 text-purple-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{aula.tipo}</h3>
                          <Badge variant="outline" className="text-xs">
                            {aula.data}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{aula.descricao}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Pendente
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Insights IA */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              {dadosCHT.insights_ia.map((insight, index) => (
                <Alert key={index} className={`border-l-4 ${getPriorityColor(insight.prioridade)}`}>
                  <div className="flex items-start gap-3">
                    {getStatusIcon(insight.categoria)}
                    <div className="flex-grow">
                      <AlertTitle className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.categoria}
                        </Badge>
                        {insight.insight}
                      </AlertTitle>
                      <AlertDescription className="space-y-2">
                        <p className="text-sm text-gray-700">{insight.detalhes}</p>
                        <div className="bg-white p-3 rounded border-l-2 border-indigo-200">
                          <p className="text-sm font-medium text-indigo-800">
                            <Lightbulb className="h-4 w-4 inline mr-1" />
                            Ação Recomendada:
                          </p>
                          <p className="text-sm text-indigo-700 mt-1">{insight.acao}</p>
                        </div>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Brain className="h-4 w-4" />
              Dashboard CHT - Powered by IA
            </div>
            <div className="text-sm text-gray-500">
              Build: {BUILD_VERSION}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

