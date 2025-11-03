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
  UserCheck, Stethoscope, Activity
} from 'lucide-react'
import './App.css'

// Dados atualizados baseados na planilha do SharePoint
const dadosAtualizados = {
  metricas_principais: {
    roas: -0.62,
    cac: 401.42,
    ticket_medio: 153.42,
    total_vendas: 21,
    faturamento: 3221.79,
    investimento: 8429.84
  },
  insights_ia: [
    {
      categoria: 'CRÍTICO',
      insight: 'ROI Ainda Negativo mas Melhorando',
      detalhes: 'ROAS de -0.62 mostra melhoria de 6% em relação aos -0.66 anteriores, mas ainda crítico',
      acao: 'Continuar otimização das campanhas focando nos médicos (52% das vendas)'
    },
    {
      categoria: 'POSITIVO',
      insight: 'Crescimento Significativo nas Vendas',
      detalhes: 'Vendas aumentaram 75% (de 12 para 21 ingressos) com melhoria no CAC',
      acao: 'Escalar estratégias que estão funcionando, especialmente para médicos'
    },
    {
      categoria: 'ESTRATÉGICO',
      insight: 'Médicos Dominam as Conversões',
      detalhes: '52% das vendas são de médicos (11 de 21), confirmando maior valor de LTV',
      acao: 'Criar campanhas específicas para médicos e aumentar investimento neste segmento'
    },
    {
      categoria: 'ALERTA',
      insight: 'CAC Ainda Alto mas Melhorando',
      detalhes: 'CAC reduziu de R$ 463,94 para R$ 401,42 (redução de 13%)',
      acao: 'Meta: reduzir CAC para R$ 200-250 focando em médicos'
    },
    {
      categoria: 'OPORTUNIDADE',
      insight: 'Potencial de Segmentação por Profissão',
      detalhes: 'Dados por profissão permitem otimização direcionada e personalização',
      acao: 'Criar funis específicos para cada profissão com ofertas personalizadas'
    }
  ],
  vendas_por_canal: [
    { canal: 'Tráfego Pago', vendas: 15, percentual: 71.4, cor: '#ef4444' },
    { canal: 'Bio Instagram', vendas: 3, percentual: 14.3, cor: '#3b82f6' },
    { canal: 'Outras', vendas: 3, percentual: 14.3, cor: '#10b981' }
  ],
  vendas_por_profissao: [
    { profissao: 'Médico', vendas: 11, percentual: 52, cor: '#059669', ltv_estimado: 2500 },
    { profissao: 'Fisioterapeuta', vendas: 4, percentual: 19, cor: '#0ea5e9', ltv_estimado: 1200 },
    { profissao: 'Dentista', vendas: 3, percentual: 14, cor: '#8b5cf6', ltv_estimado: 1500 },
    { profissao: 'Psicólogo', vendas: 2, percentual: 10, cor: '#f59e0b', ltv_estimado: 800 },
    { profissao: 'Veterinário', vendas: 1, percentual: 5, cor: '#ef4444', ltv_estimado: 1000 }
  ],
  vendas_por_dia: [
    { dia: '04/08', vendas: 2, investimento: 1569.65, faturamento: 159.80, cac: 784.83 },
    { dia: '05/08', vendas: 2, investimento: 1623.49, faturamento: 339.80, cac: 811.75 },
    { dia: '06/08', vendas: 8, investimento: 2374.10, faturamento: 1283.09, cac: 296.76 },
    { dia: '07/08', vendas: 9, investimento: 2862.60, faturamento: 1439.10, cac: 318.07 }
  ],
  projecoes: {
    cenario_atual_7dias: {
      vendas: 35,
      investimento: 14000,
      resultado: -8500
    },
    cenario_otimizado_medicos: {
      vendas: 35,
      investimento: 8750,
      resultado: -3375,
      economia: 5125
    }
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
      case 'POSITIVO': return <TrendingUp className="h-4 w-4" />
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
          <p className="text-slate-600 text-lg">Análise de IA • Dados Atualizados • {new Date().toLocaleDateString('pt-BR')}</p>
          <Badge variant="secondary" className="text-green-700 bg-green-100">
            ✅ Dados atualizados com informações por profissão
          </Badge>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROAS</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{data.metricas_principais.roas.toFixed(2)}</div>
              <p className="text-xs text-green-600">Melhoria de 6% vs. anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CAC</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ {data.metricas_principais.cac.toFixed(0)}</div>
              <p className="text-xs text-green-600">Redução de 13% vs. anterior</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{data.metricas_principais.total_vendas}</div>
              <p className="text-xs text-green-600">+75% vs. período anterior</p>
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
                    Evolução Diária
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

            {/* Status Financeiro Melhorado */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-700 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Status Financeiro - Melhorando
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">R$ {data.metricas_principais.faturamento.toFixed(0)}</div>
                    <div className="text-sm text-slate-600">Faturamento (+70%)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">R$ {data.metricas_principais.investimento.toFixed(0)}</div>
                    <div className="text-sm text-slate-600">Investimento</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-700">R$ {(data.metricas_principais.investimento - data.metricas_principais.faturamento).toFixed(0)}</div>
                    <div className="text-sm text-slate-600">Déficit (melhorando)</div>
                  </div>
                </div>
                <Progress value={38} className="w-full" />
                <p className="text-sm text-orange-700">
                  📈 Tendência positiva: ROAS melhorou 6%, vendas cresceram 75%, CAC reduziu 13%
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
                    Vendas por Profissão
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

              {/* Análise por Profissão */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Análise por Segmento
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
                          <div className="text-sm text-slate-600">Estimado</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Insights por Profissão */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Insights por Profissão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert className="border-green-200 bg-green-50">
                    <TrendingUp className="h-4 w-4" />
                    <AlertTitle className="text-green-700">Médicos - Segmento Premium</AlertTitle>
                    <AlertDescription className="text-green-700">
                      52% das vendas com maior LTV estimado (R$ 2.500). Foco principal das campanhas.
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-blue-200 bg-blue-50">
                    <Target className="h-4 w-4" />
                    <AlertTitle className="text-blue-700">Fisioterapeutas - Potencial</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      19% das vendas. Segundo maior grupo, oportunidade de crescimento.
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-purple-200 bg-purple-50">
                    <Activity className="h-4 w-4" />
                    <AlertTitle className="text-purple-700">Dentistas - Estável</AlertTitle>
                    <AlertDescription className="text-purple-700">
                      14% das vendas com bom LTV. Manter estratégias atuais.
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="text-orange-700">Outros - Otimizar</AlertTitle>
                    <AlertDescription className="text-orange-700">
                      Psicólogos e veterinários: menor LTV, revisar estratégias.
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
                  <CardTitle>Evolução do CAC por Dia</CardTitle>
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

              {/* Métricas de Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Conversão Médicos</span>
                      <span className="font-bold text-green-600">52%</span>
                    </div>
                    <Progress value={52} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Eficiência do Investimento</span>
                      <span className="font-bold text-orange-600">38%</span>
                    </div>
                    <Progress value={38} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Crescimento vs. Período Anterior</span>
                      <span className="font-bold text-green-600">75%</span>
                    </div>
                    <Progress value={75} className="w-full" />
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
                      Situação melhorando mas ainda com déficit
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Cenário Otimizado */}
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Cenário Focado em Médicos</CardTitle>
                  <CardDescription>Otimizando para o segmento premium</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Vendas Projetadas</span>
                      <span className="font-bold">{data.projecoes.cenario_otimizado_medicos.vendas} ingressos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investimento</span>
                      <span className="font-bold text-green-600">R$ {data.projecoes.cenario_otimizado_medicos.investimento.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resultado</span>
                      <span className="font-bold text-green-700">R$ {data.projecoes.cenario_otimizado_medicos.resultado.toFixed(0)}</span>
                    </div>
                  </div>
                  <Alert className="border-green-200 bg-green-50">
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription className="text-green-700">
                      Economia de R$ {data.projecoes.cenario_otimizado_medicos.economia} focando em médicos
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
                  Recomendações Estratégicas Atualizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-600">Ações Prioritárias (24h)</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Escalar campanhas para médicos (52% das vendas)</li>
                      <li>• Criar funis específicos por profissão</li>
                      <li>• Otimizar criativos para cada segmento</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-600">Estratégias de Crescimento</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Aumentar investimento em médicos</li>
                      <li>• Desenvolver ofertas premium</li>
                      <li>• Implementar remarketing por profissão</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 border-t pt-4">
          Dashboard atualizado com dados por profissão • IA Analytics • Imersão +10K
        </div>
      </div>
    </div>
  )
}

export default App

