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
  UserCheck, Stethoscope, Activity, CheckCircle, AlertCircle
} from 'lucide-react'
import './App.css'

// Dados atualizados de 10/08/2025
const dadosAtualizados = {
  metricas_principais: {
    roas: -0.60,
    cac: 405.23,
    ticket_medio: 161.38,
    total_vendas: 39,
    faturamento: 6293.98,
    investimento: 15804.08
  },
  insights_ia: [
    {
      categoria: 'CRÍTICO',
      insight: 'Volatilidade Preocupante no Desempenho',
      detalhes: 'Dia 09/08 teve apenas 1 venda com CAC de R$ 2.441, seguido de recuperação no dia 10/08 com 9 vendas',
      acao: 'Investigar causas da volatilidade e implementar controles de qualidade diários'
    },
    {
      categoria: 'POSITIVO',
      insight: 'Médicos Consolidam Ainda Mais a Liderança',
      detalhes: 'Médicos agora representam 59% das vendas (vs. 55% anterior), crescimento consistente',
      acao: 'Manter foco em médicos e aumentar budget para este segmento'
    },
    {
      categoria: 'ALERTA',
      insight: 'Queda Drástica dos Psicólogos',
      detalhes: 'Psicólogos caíram de 21% para apenas 5% das vendas - perda significativa',
      acao: 'Revisar campanhas para psicólogos e identificar causas da queda'
    },
    {
      categoria: 'ESTRATÉGICO',
      insight: 'Diversificação de Profissões',
      detalhes: 'Apareceram fonoaudiólogos e nutricionistas, mostrando expansão do público',
      acao: 'Testar campanhas específicas para estas novas profissões'
    },
    {
      categoria: 'OPORTUNIDADE',
      insight: 'Recuperação Forte no Dia 10/08',
      detalhes: 'Melhor CAC dos últimos dias (R$ 267,55) com 9 vendas, mostra potencial',
      acao: 'Analisar e replicar estratégias que funcionaram no dia 10/08'
    }
  ],
  vendas_por_canal: [
    { canal: 'Tráfego Pago', vendas: 29, percentual: 74.4, cor: '#ef4444' },
    { canal: 'Bio Instagram', vendas: 6, percentual: 15.4, cor: '#3b82f6' },
    { canal: 'Outras', vendas: 4, percentual: 10.3, cor: '#10b981' }
  ],
  vendas_por_profissao: [
    { profissao: 'Médico', vendas: 23, percentual: 59, cor: '#059669', ltv_estimado: 2500, crescimento: '+44%' },
    { profissao: 'Fisioterapeuta', vendas: 7, percentual: 18, cor: '#0ea5e9', ltv_estimado: 1200, crescimento: '+75%' },
    { profissao: 'Dentista', vendas: 4, percentual: 10, cor: '#8b5cf6', ltv_estimado: 1500, crescimento: '+100%' },
    { profissao: 'Psicólogo', vendas: 2, percentual: 5, cor: '#f59e0b', ltv_estimado: 800, crescimento: '-67%' },
    { profissao: 'Fonoaudiólogo', vendas: 1, percentual: 3, cor: '#06b6d4', ltv_estimado: 1000, crescimento: 'NOVO' },
    { profissao: 'Nutricionista', vendas: 1, percentual: 3, cor: '#84cc16', ltv_estimado: 1000, crescimento: 'NOVO' },
    { profissao: 'Veterinário', vendas: 1, percentual: 3, cor: '#ef4444', ltv_estimado: 1000, crescimento: '0%' }
  ],
  vendas_por_dia: [
    { dia: '04/08', vendas: 2, investimento: 1569.65, faturamento: 159.80, cac: 784.83 },
    { dia: '05/08', vendas: 2, investimento: 1623.49, faturamento: 339.80, cac: 811.75 },
    { dia: '06/08', vendas: 8, investimento: 2374.10, faturamento: 1283.09, cac: 296.76 },
    { dia: '07/08', vendas: 9, investimento: 2862.60, faturamento: 1439.10, cac: 318.07 },
    { dia: '08/08', vendas: 8, investimento: 2525.23, faturamento: 1359.20, cac: 315.65 },
    { dia: '09/08', vendas: 1, investimento: 2441.08, faturamento: 169.90, cac: 2441.08 },
    { dia: '10/08', vendas: 9, investimento: 2407.93, faturamento: 1543.09, cac: 267.55 }
  ],
  projecoes: {
    cenario_atual_7dias: {
      vendas: 65,
      investimento: 26000,
      resultado: -15500
    },
    cenario_otimizado_estabilidade: {
      vendas: 65,
      investimento: 17500,
      resultado: -7000,
      economia: 8500
    }
  },
  comparacao_periodo: {
    vendas: { atual: 39, anterior: 29, crescimento: 34 },
    roas: { atual: -0.60, anterior: -0.58, piora: 3.4 },
    cac: { atual: 405.23, anterior: 377.76, aumento: 7.3 },
    faturamento: { atual: 6293.98, anterior: 4580.99, crescimento: 37 }
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState(dadosAtualizados)

  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case 'CRÍTICO': return 'destructive'
      case 'ALERTA': return 'destructive'
      case 'ESTRATÉGICO': return 'default'
      case 'OPORTUNIDADE': return 'secondary'
      case 'POSITIVO': return 'secondary'
      default: return 'default'
    }
  }

  const getCategoriaIcon = (categoria) => {
    switch (categoria) {
      case 'CRÍTICO': return <AlertTriangle className="h-4 w-4" />
      case 'ALERTA': return <AlertCircle className="h-4 w-4" />
      case 'ESTRATÉGICO': return <Target className="h-4 w-4" />
      case 'OPORTUNIDADE': return <TrendingUp className="h-4 w-4" />
      case 'POSITIVO': return <CheckCircle className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Imersão +10K
          </h1>
          <p className="text-slate-600 text-lg">Análise de IA • Dados de 10/08/2025 • Atualizado em tempo real</p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="text-orange-700 bg-orange-100">
              ⚠️ Volatilidade detectada - atenção necessária
            </Badge>
            <Badge variant="secondary" className="text-blue-700 bg-blue-100">
              📈 +34% vendas totais vs. período anterior
            </Badge>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROAS</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{data.metricas_principais.roas.toFixed(2)}</div>
              <p className="text-xs text-red-600">Piora de 3.4% vs. anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CAC</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">R$ {data.metricas_principais.cac.toFixed(0)}</div>
              <p className="text-xs text-red-600">Aumento de 7.3% vs. anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{data.metricas_principais.total_vendas}</div>
              <p className="text-xs text-green-600">+34% vs. período anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">R$ {data.metricas_principais.ticket_medio.toFixed(0)}</div>
              <p className="text-xs text-slate-600">Valor médio por venda</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="profissoes">Por Profissão</TabsTrigger>
            <TabsTrigger value="insights">Insights de IA</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="projections">Projeções</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Vendas por Canal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Vendas por Canal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.vendas_por_canal}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="vendas"
                        label={({ canal, percentual }) => `${canal}: ${percentual}%`}
                      >
                        {data.vendas_por_canal.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Evolução Diária */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Evolução Diária (7 dias)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data.vendas_por_dia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="vendas" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Status Financeiro com Volatilidade */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-700 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Status Financeiro - Volatilidade Detectada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">R$ {data.metricas_principais.faturamento.toFixed(0)}</div>
                    <div className="text-sm text-slate-600">Faturamento (+37%)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">R$ {data.metricas_principais.investimento.toFixed(0)}</div>
                    <div className="text-sm text-slate-600">Investimento</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-700">R$ {(data.metricas_principais.investimento - data.metricas_principais.faturamento).toFixed(0)}</div>
                    <div className="text-sm text-slate-600">Déficit (aumentando)</div>
                  </div>
                </div>
                <Progress value={40} className="w-full" />
                <Alert className="border-orange-200 bg-orange-100">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-orange-700">
                    ⚠️ Dia 09/08: apenas 1 venda com CAC R$ 2.441 | Dia 10/08: recuperação com 9 vendas e CAC R$ 267
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profissoes" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico por Profissão */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Vendas por Profissão (Diversificação)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.vendas_por_profissao}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="vendas"
                        label={({ profissao, percentual }) => `${profissao}: ${percentual}%`}
                      >
                        {data.vendas_por_profissao.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Análise por Profissão com Crescimento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Análise de Crescimento por Segmento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.vendas_por_profissao.map((prof, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: prof.cor }}
                          ></div>
                          <div>
                            <div className="font-semibold">{prof.profissao}</div>
                            <div className="text-sm text-slate-600">{prof.vendas} vendas ({prof.percentual}%)</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">LTV: R$ {prof.ltv_estimado}</div>
                          <div className={`text-sm font-medium ${
                            prof.crescimento.includes('+') ? 'text-green-600' : 
                            prof.crescimento.includes('-') ? 'text-red-600' : 
                            prof.crescimento === 'NOVO' ? 'text-blue-600' : 'text-slate-600'
                          }`}>
                            {prof.crescimento}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Insights por Profissão Atualizados */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Insights por Profissão - Mudanças Significativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle className="text-green-700">Médicos - Dominância Crescente</AlertTitle>
                    <AlertDescription className="text-green-700">
                      59% das vendas (+4% vs. anterior). Crescimento de 44% confirma estratégia.
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-red-700">Psicólogos - Queda Drástica</AlertTitle>
                    <AlertDescription className="text-red-700">
                      5% das vendas (-16% vs. anterior). Queda de 67% - investigar urgente!
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-blue-200 bg-blue-50">
                    <Activity className="h-4 w-4" />
                    <AlertTitle className="text-blue-700">Fisioterapeutas - Crescimento Forte</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      18% das vendas. Crescimento de 75% - segmento em expansão.
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-purple-200 bg-purple-50">
                    <Target className="h-4 w-4" />
                    <AlertTitle className="text-purple-700">Novas Profissões</AlertTitle>
                    <AlertDescription className="text-purple-700">
                      Fonoaudiólogos e nutricionistas aparecem - diversificação do público.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4">
              {data.insights_ia.map((insight, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getCategoriaIcon(insight.categoria)}
                      <span>{insight.insight}</span>
                      <Badge variant={getCategoriaColor(insight.categoria)}>
                        {insight.categoria}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-slate-700">{insight.detalhes}</p>
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertTitle>Ação Recomendada</AlertTitle>
                      <AlertDescription>{insight.acao}</AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CAC por Dia com Volatilidade */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do CAC (7 dias) - Volatilidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.vendas_por_dia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="cac" stroke="#ef4444" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Comparação de Períodos */}
              <Card>
                <CardHeader>
                  <CardTitle>Comparação vs. Período Anterior</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Crescimento de Vendas</span>
                      <span className="font-bold text-green-600">+{data.comparacao_periodo.vendas.crescimento}%</span>
                    </div>
                    <Progress value={data.comparacao_periodo.vendas.crescimento} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Piora do ROAS</span>
                      <span className="font-bold text-red-600">-{data.comparacao_periodo.roas.piora}%</span>
                    </div>
                    <Progress value={data.comparacao_periodo.roas.piora * 10} className="w-full bg-red-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Crescimento do Faturamento</span>
                      <span className="font-bold text-green-600">+{data.comparacao_periodo.faturamento.crescimento}%</span>
                    </div>
                    <Progress value={data.comparacao_periodo.faturamento.crescimento} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Análise de Volatilidade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Análise de Volatilidade Diária
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-red-700">Dia 09/08 - Performance Crítica</AlertTitle>
                    <AlertDescription className="text-red-700">
                      Apenas 1 venda com CAC de R$ 2.441 - pior dia do período
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle className="text-green-700">Dia 10/08 - Recuperação Forte</AlertTitle>
                    <AlertDescription className="text-green-700">
                      9 vendas com CAC de R$ 267 - melhor CAC dos últimos dias
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projections" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cenário Atual */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">Cenário Atual (7 dias)</CardTitle>
                  <CardDescription>Mantendo a volatilidade atual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Vendas Projetadas</span>
                      <span className="font-bold">{data.projecoes.cenario_atual_7dias.vendas} ingressos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investimento</span>
                      <span className="font-bold text-red-600">R$ {data.projecoes.cenario_atual_7dias.investimento.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resultado</span>
                      <span className="font-bold text-red-700">R$ {data.projecoes.cenario_atual_7dias.resultado.toFixed(0)}</span>
                    </div>
                  </div>
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-700">
                      Volatilidade alta pode gerar resultados imprevisíveis
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Cenário Otimizado */}
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Cenário com Estabilidade</CardTitle>
                  <CardDescription>Controlando volatilidade e focando em médicos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Vendas Projetadas</span>
                      <span className="font-bold">{data.projecoes.cenario_otimizado_estabilidade.vendas} ingressos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investimento</span>
                      <span className="font-bold text-green-600">R$ {data.projecoes.cenario_otimizado_estabilidade.investimento.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resultado</span>
                      <span className="font-bold text-green-700">R$ {data.projecoes.cenario_otimizado_estabilidade.resultado.toFixed(0)}</span>
                    </div>
                  </div>
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-700">
                      Economia de R$ {data.projecoes.cenario_otimizado_estabilidade.economia} com controle de volatilidade
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Recomendações Urgentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recomendações Urgentes - 10/08/2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-600">Ações Críticas (24h)</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Investigar causas da volatilidade do dia 09/08</li>
                      <li>• Replicar estratégias do dia 10/08 (CAC R$ 267)</li>
                      <li>• Revisar campanhas para psicólogos urgente</li>
                      <li>• Implementar controles de qualidade diários</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-600">Oportunidades</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Escalar foco em médicos (59% das vendas)</li>
                      <li>• Testar campanhas para fonoaudiólogos</li>
                      <li>• Expandir para nutricionistas</li>
                      <li>• Estabilizar performance diária</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 border-t pt-4">
          Dashboard atualizado com dados de 10/08/2025 • IA Analytics • Imersão +10K • Volatilidade detectada - atenção necessária
        </div>
      </div>
    </div>
  )
}

export default App

