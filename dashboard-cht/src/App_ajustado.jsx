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
  UserCheck, Stethoscope, Activity, CheckCircle, AlertCircle, Crown, Star
} from 'lucide-react'
import './App.css'

// Dados atualizados com foco em conversão histórica
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
      categoria: 'ESTRATÉGICO',
      insight: 'Foco em Segmentos de Alta Conversão',
      detalhes: 'Médicos (59%) e dentistas (10%) representam 69% das vendas - segmentos com melhor conversão histórica para curso e mentoria',
      acao: 'Aumentar investimento em médicos e dentistas para maximizar conversão no dia da oferta'
    },
    {
      categoria: 'OPORTUNIDADE',
      insight: 'Bio Instagram - Canal Premium de Conversão',
      detalhes: 'Bio Instagram tem 15.4% das vendas mas historicamente melhor taxa de conversão para curso',
      acao: 'Intensificar estratégias orgânicas no Instagram para captar leads de alta qualidade'
    },
    {
      categoria: 'CRÍTICO',
      insight: 'Volatilidade Preocupante no Desempenho',
      detalhes: 'Dia 09/08 teve apenas 1 venda com CAC de R$ 2.441, seguido de recuperação no dia 10/08 com 9 vendas',
      acao: 'Investigar causas da volatilidade e implementar controles de qualidade diários'
    },
    {
      categoria: 'ALERTA',
      insight: 'Queda Drástica dos Psicólogos',
      detalhes: 'Psicólogos caíram de 21% para apenas 5% das vendas - perda de segmento',
      acao: 'Revisar campanhas para psicólogos mas manter foco em médicos e dentistas'
    },
    {
      categoria: 'POSITIVO',
      insight: 'Recuperação Forte no Dia 10/08',
      detalhes: 'Melhor CAC dos últimos dias (R$ 267,55) com 9 vendas, mostra potencial',
      acao: 'Analisar e replicar estratégias que funcionaram no dia 10/08'
    }
  ],
  vendas_por_canal: [
    { 
      canal: 'Tráfego Pago', 
      vendas: 29, 
      percentual: 74.4, 
      cor: '#ef4444',
      conversao_curso: 'Média',
      conversao_mentoria: 'Baixa',
      prioridade: 'Média'
    },
    { 
      canal: 'Bio Instagram', 
      vendas: 6, 
      percentual: 15.4, 
      cor: '#3b82f6',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'Alta',
      prioridade: 'MÁXIMA'
    },
    { 
      canal: 'Outras', 
      vendas: 4, 
      percentual: 10.3, 
      cor: '#10b981',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa'
    }
  ],
  vendas_por_profissao: [
    { 
      profissao: 'Médico', 
      vendas: 23, 
      percentual: 59, 
      cor: '#059669', 
      ltv_estimado: 2500, 
      crescimento: '+44%',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'MÁXIMA',
      prioridade: 'CRÍTICA',
      foco_estrategico: true
    },
    { 
      profissao: 'Dentista', 
      vendas: 4, 
      percentual: 10, 
      cor: '#8b5cf6', 
      ltv_estimado: 1500, 
      crescimento: '+100%',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'Média',
      prioridade: 'ALTA',
      foco_estrategico: true
    },
    { 
      profissao: 'Fisioterapeuta', 
      vendas: 7, 
      percentual: 18, 
      cor: '#0ea5e9', 
      ltv_estimado: 1200, 
      crescimento: '+75%',
      conversao_curso: 'Média',
      conversao_mentoria: 'Baixa',
      prioridade: 'Média',
      foco_estrategico: false
    },
    { 
      profissao: 'Psicólogo', 
      vendas: 2, 
      percentual: 5, 
      cor: '#f59e0b', 
      ltv_estimado: 800, 
      crescimento: '-67%',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    },
    { 
      profissao: 'Outras Profissões', 
      vendas: 3, 
      percentual: 8, 
      cor: '#6b7280', 
      ltv_estimado: 1000, 
      crescimento: 'NOVO',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    }
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
  segmentos_prioritarios: {
    medicos_dentistas: {
      vendas: 27,
      percentual: 69,
      potencial_curso: 'MÁXIMO',
      potencial_mentoria: 'MÁXIMO',
      cac_medio: 380,
      ltv_medio: 2200
    },
    bio_instagram: {
      vendas: 6,
      percentual: 15.4,
      taxa_conversao_curso: 'ALTA',
      cac_organico: 0,
      qualidade_lead: 'PREMIUM'
    }
  },
  projecoes: {
    cenario_atual_7dias: {
      vendas: 65,
      investimento: 26000,
      resultado: -15500
    },
    cenario_otimizado_foco: {
      vendas: 65,
      investimento: 16000,
      resultado: -5500,
      economia: 10000,
      descricao: 'Focando 80% do budget em médicos e dentistas + intensificação do orgânico'
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

  const getPrioridadeColor = (prioridade) => {
    switch (prioridade) {
      case 'CRÍTICA': return 'text-red-700 bg-red-100'
      case 'MÁXIMA': return 'text-red-700 bg-red-100'
      case 'ALTA': return 'text-orange-700 bg-orange-100'
      case 'Média': return 'text-blue-700 bg-blue-100'
      case 'Baixa': return 'text-gray-700 bg-gray-100'
      default: return 'text-gray-700 bg-gray-100'
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
          <p className="text-slate-600 text-lg">Análise de IA • Dados de 10/08/2025 • Foco em Conversão Histórica</p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="text-green-700 bg-green-100">
              🎯 Médicos + Dentistas: 69% das vendas
            </Badge>
            <Badge variant="secondary" className="text-blue-700 bg-blue-100">
              ⭐ Bio Instagram: Canal premium de conversão
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

        {/* Segmentos Prioritários */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Segmento Premium: Médicos + Dentistas
              </CardTitle>
              <CardDescription>Melhor conversão histórica para curso e mentoria</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{data.segmentos_prioritarios.medicos_dentistas.vendas}</div>
                  <div className="text-sm text-slate-600">Vendas (69%)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">R$ {data.segmentos_prioritarios.medicos_dentistas.ltv_medio}</div>
                  <div className="text-sm text-slate-600">LTV Médio</div>
                </div>
              </div>
              <Alert className="border-green-200 bg-green-100">
                <Crown className="h-4 w-4" />
                <AlertDescription className="text-green-700">
                  <strong>Foco Estratégico:</strong> Médicos têm conversão máxima para mentoria. Dentistas têm alta conversão para curso.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Canal Premium: Bio Instagram
              </CardTitle>
              <CardDescription>Melhor taxa de conversão histórica para curso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{data.segmentos_prioritarios.bio_instagram.vendas}</div>
                  <div className="text-sm text-slate-600">Vendas (15.4%)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">R$ 0</div>
                  <div className="text-sm text-slate-600">CAC Orgânico</div>
                </div>
              </div>
              <Alert className="border-blue-200 bg-blue-100">
                <Star className="h-4 w-4" />
                <AlertDescription className="text-blue-700">
                  <strong>Qualidade Premium:</strong> Leads do Instagram têm maior taxa de conversão para curso. Intensificar estratégias orgânicas.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Conteúdo */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="canais">Origem & Conversão</TabsTrigger>
            <TabsTrigger value="profissoes">Segmentos Estratégicos</TabsTrigger>
            <TabsTrigger value="insights">Insights de IA</TabsTrigger>
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

          <TabsContent value="canais" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Análise de Canais por Conversão Histórica
                </CardTitle>
                <CardDescription>Foco na qualidade de conversão para curso e mentoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.vendas_por_canal.map((canal, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-l-4" style={{ borderLeftColor: canal.cor }}>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: canal.cor }}>{canal.vendas}</div>
                          <div className="text-sm text-slate-600">{canal.percentual}%</div>
                        </div>
                        <div>
                          <div className="font-semibold text-lg">{canal.canal}</div>
                          <div className="text-sm text-slate-600">Vendas de ingressos</div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex gap-2">
                          <Badge className={getPrioridadeColor(canal.prioridade)}>
                            Prioridade: {canal.prioridade}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <div>Conversão Curso: <span className={canal.conversao_curso === 'ALTA' ? 'font-bold text-green-600' : 'text-slate-600'}>{canal.conversao_curso}</span></div>
                          <div>Conversão Mentoria: <span className={canal.conversao_mentoria === 'Alta' ? 'font-bold text-green-600' : 'text-slate-600'}>{canal.conversao_mentoria}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert className="border-blue-200 bg-blue-50">
              <Star className="h-4 w-4" />
              <AlertTitle className="text-blue-700">Estratégia de Canais</AlertTitle>
              <AlertDescription className="text-blue-700">
                <strong>Bio Instagram:</strong> Apesar de apenas 15.4% das vendas, tem a melhor taxa de conversão histórica para curso. 
                <strong> Intensificar conteúdo orgânico para captar leads premium.</strong>
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="profissoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Segmentos por Potencial de Conversão
                </CardTitle>
                <CardDescription>Baseado em dados históricos de conversão para curso e mentoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.vendas_por_profissao.map((prof, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-lg border-2 ${prof.foco_estrategico ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{ color: prof.cor }}>{prof.vendas}</div>
                          <div className="text-sm text-slate-600">{prof.percentual}%</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-lg">{prof.profissao}</div>
                            {prof.foco_estrategico && <Crown className="h-4 w-4 text-yellow-600" />}
                          </div>
                          <div className="text-sm text-slate-600">LTV: R$ {prof.ltv_estimado} | {prof.crescimento}</div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex gap-2">
                          <Badge className={getPrioridadeColor(prof.prioridade)}>
                            {prof.prioridade}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <div>Curso: <span className={prof.conversao_curso === 'ALTA' ? 'font-bold text-green-600' : prof.conversao_curso === 'MÁXIMA' ? 'font-bold text-red-600' : 'text-slate-600'}>{prof.conversao_curso}</span></div>
                          <div>Mentoria: <span className={prof.conversao_mentoria === 'MÁXIMA' ? 'font-bold text-red-600' : prof.conversao_mentoria === 'Média' ? 'font-bold text-orange-600' : 'text-slate-600'}>{prof.conversao_mentoria}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Alert className="border-green-200 bg-green-50">
                <Crown className="h-4 w-4" />
                <AlertTitle className="text-green-700">Médicos - Segmento Crítico</AlertTitle>
                <AlertDescription className="text-green-700">
                  59% das vendas. <strong>Conversão máxima para mentoria</strong> e alta para curso. 
                  Maioria absoluta das vendas de mentoria vem de médicos.
                </AlertDescription>
              </Alert>
              <Alert className="border-purple-200 bg-purple-50">
                <Target className="h-4 w-4" />
                <AlertTitle className="text-purple-700">Dentistas - Segmento Estratégico</AlertTitle>
                <AlertDescription className="text-purple-700">
                  10% das vendas com crescimento de 100%. <strong>Alta conversão para curso</strong>. 
                  Foco importante para o dia da oferta.
                </AlertDescription>
              </Alert>
            </div>
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

          <TabsContent value="projections" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cenário Atual */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">Cenário Atual (7 dias)</CardTitle>
                  <CardDescription>Mantendo a estratégia atual</CardDescription>
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
                      Estratégia dispersa sem foco nos segmentos de alta conversão
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Cenário Otimizado */}
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Cenário Focado em Conversão</CardTitle>
                  <CardDescription>{data.projecoes.cenario_otimizado_foco.descricao}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Vendas Projetadas</span>
                      <span className="font-bold">{data.projecoes.cenario_otimizado_foco.vendas} ingressos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investimento</span>
                      <span className="font-bold text-green-600">R$ {data.projecoes.cenario_otimizado_foco.investimento.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resultado</span>
                      <span className="font-bold text-green-700">R$ {data.projecoes.cenario_otimizado_foco.resultado.toFixed(0)}</span>
                    </div>
                  </div>
                  <Alert className="border-green-200 bg-green-50">
                    <Crown className="h-4 w-4" />
                    <AlertDescription className="text-green-700">
                      Economia de R$ {data.projecoes.cenario_otimizado_foco.economia} focando em segmentos de alta conversão
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Estratégia de Foco */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Estratégia de Foco para Maximizar Conversão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-600">Foco em Segmentos Premium</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• <strong>80% do budget</strong> para médicos e dentistas</li>
                      <li>• Campanhas específicas por especialidade médica</li>
                      <li>• Criativos focados em ROI e resultados</li>
                      <li>• Remarketing para médicos que visitaram LP</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">Intensificar Bio Instagram</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Conteúdo diário de valor para médicos</li>
                      <li>• Stories com cases de sucesso</li>
                      <li>• Lives com especialistas</li>
                      <li>• CTAs diretos para inscrição</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 border-t pt-4">
          Dashboard atualizado com foco em conversão histórica • Médicos + Dentistas: Segmentos prioritários • Bio Instagram: Canal premium
        </div>
      </div>
    </div>
  )
}

export default App

