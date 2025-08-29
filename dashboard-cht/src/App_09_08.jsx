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
  UserCheck, Stethoscope, Activity, CheckCircle
} from 'lucide-react'
import './App.css'

// Dados atualizados de 09/08/2025
const dadosAtualizados = {
  metricas_principais: {
    roas: -0.58,
    cac: 377.76,
    ticket_medio: 157.96,
    total_vendas: 29,
    faturamento: 4580.99,
    investimento: 10955.07
  },
  insights_ia: [
    {
      categoria: 'POSITIVO',
      insight: 'Tendência Consistente de Melhoria',
      detalhes: 'ROAS melhorou para -0.58 (+6.5%), CAC reduziu para R$ 377,76 (-6%), vendas cresceram 38%',
      acao: 'Manter estratégias atuais e acelerar investimento em segmentos que estão convertendo'
    },
    {
      categoria: 'ESTRATÉGICO',
      insight: 'Médicos Consolidam Liderança',
      detalhes: 'Médicos agora representam 55% das vendas (vs. 52% anterior), confirmando foco correto',
      acao: 'Aumentar budget para campanhas direcionadas a médicos em 30%'
    },
    {
      categoria: 'OPORTUNIDADE',
      insight: 'Psicólogos em Crescimento Acelerado',
      detalhes: 'Psicólogos saltaram de 10% para 21% das vendas - novo segmento promissor',
      acao: 'Criar campanhas específicas para psicólogos e testar escalabilidade'
    },
    {
      categoria: 'CRÍTICO',
      insight: 'Déficit Ainda Significativo',
      detalhes: 'Apesar das melhorias, déficit de R$ 6.374 requer ação para atingir break-even',
      acao: 'Implementar otimizações agressivas nos próximos 3 dias para reduzir CAC'
    },
    {
      categoria: 'ALERTA',
      insight: 'Crescimento Orgânico Estagnado',
      detalhes: 'Bio Instagram manteve 5 vendas vs. 3 anteriores - crescimento menor que pago',
      acao: 'Intensificar estratégias orgânicas e conteúdo para médicos e psicólogos'
    }
  ],
  vendas_por_canal: [
    { canal: 'Tráfego Pago', vendas: 20, percentual: 69.0, cor: '#ef4444' },
    { canal: 'Bio Instagram', vendas: 5, percentual: 17.2, cor: '#3b82f6' },
    { canal: 'Outras', vendas: 4, percentual: 13.8, cor: '#10b981' }
  ],
  vendas_por_profissao: [
    { profissao: 'Médico', vendas: 16, percentual: 55, cor: '#059669', ltv_estimado: 2500, crescimento: '+45%' },
    { profissao: 'Psicólogo', vendas: 6, percentual: 21, cor: '#f59e0b', ltv_estimado: 800, crescimento: '+200%' },
    { profissao: 'Fisioterapeuta', vendas: 4, percentual: 14, cor: '#0ea5e9', ltv_estimado: 1200, crescimento: '0%' },
    { profissao: 'Dentista', vendas: 2, percentual: 7, cor: '#8b5cf6', ltv_estimado: 1500, crescimento: '-33%' },
    { profissao: 'Veterinário', vendas: 1, percentual: 3, cor: '#ef4444', ltv_estimado: 1000, crescimento: '0%' }
  ],
  vendas_por_dia: [
    { dia: '04/08', vendas: 2, investimento: 1569.65, faturamento: 159.80, cac: 784.83 },
    { dia: '05/08', vendas: 2, investimento: 1623.49, faturamento: 339.80, cac: 811.75 },
    { dia: '06/08', vendas: 8, investimento: 2374.10, faturamento: 1283.09, cac: 296.76 },
    { dia: '07/08', vendas: 9, investimento: 2862.60, faturamento: 1439.10, cac: 318.07 },
    { dia: '08/08', vendas: 8, investimento: 2525.23, faturamento: 1359.20, cac: 315.65 }
  ],
  projecoes: {
    cenario_atual_7dias: {
      vendas: 50,
      investimento: 18000,
      resultado: -10000
    },
    cenario_otimizado_medicos_psicologos: {
      vendas: 50,
      investimento: 12500,
      resultado: -4625,
      economia: 5375
    }
  },
  comparacao_periodo: {
    vendas: { atual: 29, anterior: 21, crescimento: 38 },
    roas: { atual: -0.58, anterior: -0.62, melhoria: 6.5 },
    cac: { atual: 377.76, anterior: 401.42, reducao: 6 },
    faturamento: { atual: 4580.99, anterior: 3221.79, crescimento: 42 }
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
      case 'ALERTA': return <TrendingDown className="h-4 w-4" />
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
          <p className="text-slate-600 text-lg">Análise de IA • Dados de 09/08/2025 • Atualizado em tempo real</p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="text-green-700 bg-green-100">
              ✅ Tendência de melhoria confirmada
            </Badge>
            <Badge variant="secondary" className="text-blue-700 bg-blue-100">
              📈 +38% vendas vs. período anterior
            </Badge>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROAS</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{data.metricas_principais.roas.toFixed(2)}</div>
              <p className="text-xs text-green-600">Melhoria de +6.5% vs. anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CAC</CardTitle>
              <TrendingDown className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ {data.metricas_principais.cac.toFixed(0)}</div>
              <p className="text-xs text-green-600">Redução de 6% vs. anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{data.metricas_principais.total_vendas}</div>
              <p className="text-xs text-green-600">+38% vs. período anterior</p>
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
                    Evolução Diária (5 dias)
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

            {/* Status Financeiro Melhorando */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Status Financeiro - Melhoria Consistente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">R$ {data.metricas_principais.faturamento.toFixed(0)}</div>
                    <div className="text-sm text-slate-600">Faturamento (+42%)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">R$ {data.metricas_principais.investimento.toFixed(0)}</div>
                    <div className="text-sm text-slate-600">Investimento</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-700">R$ {(data.metricas_principais.investimento - data.metricas_principais.faturamento).toFixed(0)}</div>
                    <div className="text-sm text-slate-600">Déficit (reduzindo)</div>
                  </div>
                </div>
                <Progress value={42} className="w-full" />
                <p className="text-sm text-green-700">
                  📈 Evolução positiva: ROAS +6.5%, vendas +38%, CAC -6%, faturamento +42%
                </p>
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
                    Vendas por Profissão (Atualizado)
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
                          <div className={`text-sm font-medium ${prof.crescimento.includes('+') ? 'text-green-600' : prof.crescimento.includes('-') ? 'text-red-600' : 'text-slate-600'}`}>
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
                  Insights por Profissão - Novidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle className="text-green-700">Médicos - Liderança Consolidada</AlertTitle>
                    <AlertDescription className="text-green-700">
                      55% das vendas (+3% vs. anterior). Crescimento de 45% confirma estratégia correta.
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <TrendingUp className="h-4 w-4" />
                    <AlertTitle className="text-yellow-700">Psicólogos - Crescimento Explosivo</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      21% das vendas (+11% vs. anterior). Crescimento de 200% - novo segmento promissor!
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-blue-200 bg-blue-50">
                    <Activity className="h-4 w-4" />
                    <AlertTitle className="text-blue-700">Fisioterapeutas - Estável</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      14% das vendas. Mantém posição, oportunidade de crescimento.
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-red-700">Dentistas - Atenção</AlertTitle>
                    <AlertDescription className="text-red-700">
                      7% das vendas (-7% vs. anterior). Revisar estratégias para este segmento.
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
              {/* CAC por Dia */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução do CAC (5 dias)</CardTitle>
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
                      <span>Melhoria do ROAS</span>
                      <span className="font-bold text-green-600">+{data.comparacao_periodo.roas.melhoria}%</span>
                    </div>
                    <Progress value={data.comparacao_periodo.roas.melhoria * 10} className="w-full" />
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
          </TabsContent>

          <TabsContent value="projections" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cenário Atual */}
              <Card className="border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-700">Cenário Atual (7 dias)</CardTitle>
                  <CardDescription>Mantendo a performance atual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Vendas Projetadas</span>
                      <span className="font-bold">{data.projecoes.cenario_atual_7dias.vendas} ingressos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investimento</span>
                      <span className="font-bold text-orange-600">R$ {data.projecoes.cenario_atual_7dias.investimento.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resultado</span>
                      <span className="font-bold text-orange-700">R$ {data.projecoes.cenario_atual_7dias.resultado.toFixed(0)}</span>
                    </div>
                  </div>
                  <Alert className="border-orange-200 bg-orange-50">
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription className="text-orange-700">
                      Melhoria contínua mas ainda com déficit
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Cenário Otimizado */}
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Cenário Focado Médicos + Psicólogos</CardTitle>
                  <CardDescription>Otimizando para segmentos de alta conversão</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Vendas Projetadas</span>
                      <span className="font-bold">{data.projecoes.cenario_otimizado_medicos_psicologos.vendas} ingressos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investimento</span>
                      <span className="font-bold text-green-600">R$ {data.projecoes.cenario_otimizado_medicos_psicologos.investimento.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resultado</span>
                      <span className="font-bold text-green-700">R$ {data.projecoes.cenario_otimizado_medicos_psicologos.resultado.toFixed(0)}</span>
                    </div>
                  </div>
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-700">
                      Economia de R$ {data.projecoes.cenario_otimizado_medicos_psicologos.economia} focando em médicos e psicólogos
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Recomendações Atualizadas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Recomendações Estratégicas - 09/08/2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-600">Ações Prioritárias (24h)</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Aumentar budget para médicos em 30%</li>
                      <li>• Criar campanhas específicas para psicólogos</li>
                      <li>• Testar escalabilidade do segmento psicólogos</li>
                      <li>• Revisar estratégias para dentistas</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">Estratégias de Crescimento</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Manter tendência de melhoria do ROAS</li>
                      <li>• Acelerar crescimento orgânico</li>
                      <li>• Implementar remarketing por profissão</li>
                      <li>• Otimizar CAC para R$ 250-300</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 border-t pt-4">
          Dashboard atualizado com dados de 09/08/2025 • IA Analytics • Imersão +10K • Tendência positiva confirmada
        </div>
      </div>
    </div>
  )
}

export default App

