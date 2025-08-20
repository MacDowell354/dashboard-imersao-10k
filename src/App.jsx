import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import {
  PieChart as PieChartIcon, TrendingDown, TrendingUp, AlertTriangle, Target, CheckCircle,
  AlertCircle, Brain, Lightbulb, BarChart3, Users, Calendar, Crown, Star, MapPin
} from 'lucide-react'
import {
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'
import './App.css'

// 🔗 importa o helper que você criou
import { fetchDadosSeguro, normalizarDados } from './lib/fetchDados'

// Cache busting
const CACHE_VERSION = Date.now()
const BUILD_VERSION = '20250817_' + CACHE_VERSION

// ======================================
// FALLBACKS ESTÁTICOS (mantidos do seu arquivo)
// ======================================
const dadosAtualizadosFallback = {
  metricas_principais: {
    roas: -0.51,
    cac: 333.37,
    total_vendas: 104,
    faturamento: 16845.05,
    investimento: 34670.86,
    deficit: 17825.81,
    ticket_medio: 162.07,
    data_atualizacao: '17/08/2025'
  },
  vendas_por_canal: [
    { canal: 'Tráfego Pago', vendas: 74, percentual: 71.2, cor: '#ef4444', conversao_curso: 'Média', conversao_mentoria: 'Baixa', prioridade: 'Alta' },
    { canal: 'Bio Instagram', vendas: 19, percentual: 18.3, cor: '#10b981', conversao_curso: 'Alta', conversao_mentoria: 'Média', prioridade: 'Premium' },
    { canal: 'WhatsApp', vendas: 2, percentual: 1.9, cor: '#8b5cf6', conversao_curso: 'Baixa', conversao_mentoria: 'Baixa', prioridade: 'Baixa' },
    { canal: 'Email', vendas: 2, percentual: 1.9, cor: '#f59e0b', conversao_curso: 'Baixa', conversao_mentoria: 'Baixa', prioridade: 'Baixa' },
    { canal: 'YouTube', vendas: 1, percentual: 1.0, cor: '#06b6d4', conversao_curso: 'Baixa', conversao_mentoria: 'Baixa', prioridade: 'Baixa' },
    { canal: 'Outras', vendas: 6, percentual: 5.8, cor: '#64748b', conversao_curso: 'Baixa', conversao_mentoria: 'Baixa', prioridade: 'Baixa' },
  ],
  vendas_por_profissao: [
    { profissao: 'Médico', vendas: 62, percentual: 59.6, cor: '#10b981', ltv_estimado: 2500, crescimento: '+34.8%', conversao_curso: 'ALTA', conversao_mentoria: 'MÁXIMA', prioridade: 'CRÍTICA', foco_estrategico: true },
    { profissao: 'Dentista', vendas: 14, percentual: 13.5, cor: '#8b5cf6', ltv_estimado: 1500, crescimento: '+16.7%', conversao_curso: 'ALTA', conversao_mentoria: 'ALTA', prioridade: 'ALTA', foco_estrategico: true },
    { profissao: 'Fisioterapeuta', vendas: 12, percentual: 11.5, cor: '#f59e0b', ltv_estimado: 1200, crescimento: '+9.1%', conversao_curso: 'MÉDIA', conversao_mentoria: 'MÉDIA', prioridade: 'MÉDIA', foco_estrategico: false },
    { profissao: 'Psicólogo', vendas: 7, percentual: 6.7, cor: '#06b6d4', ltv_estimado: 1000, crescimento: '+16.7%', conversao_curso: 'MÉDIA', conversao_mentoria: 'BAIXA', prioridade: 'MÉDIA', foco_estrategico: false },
    { profissao: 'Outros', vendas: 9, percentual: 8.7, cor: '#64748b', ltv_estimado: 800, crescimento: '+12.5%', conversao_curso: 'BAIXA', conversao_mentoria: 'BAIXA', prioridade: 'BAIXA', foco_estrategico: false },
  ],
  // o seu UI usa "vendas_por_dia"; mantemos um array vazio como fallback
  vendas_por_dia: [],
  segmentos_prioritarios: {
    medicos_dentistas: { vendas: 76, percentual: 73.1, ltv_medio: 2200 },
    bio_instagram: { vendas: 19, percentual: 18.3, ltv_medio: 1800 },
  },
}

// ======================================
// MAPEADOR -> backend JSON  ➜  formato do UI
// ======================================
function mapearBackendParaUI(raw) {
  // normaliza (garante medicos_dentistas etc.)
  const norm = normalizarDados(raw)
  if (!norm) return null

  // métrica principal vem de raw.vendas
  const v = norm.vendas || {}
  const metricas_principais = {
    roas: Number(v.roas ?? 0),
    cac: Number(v.cac ?? 0),
    total_vendas: Number(v.total ?? 0),
    faturamento: Number(v.faturamento ?? 0),
    investimento: Number(v.investimento ?? 0),
    deficit: Number(v.investimento ?? 0) - Number(v.faturamento ?? 0),
    ticket_medio: Number(v.ticketMedio ?? 0),
    data_atualizacao: norm.dataAtualizacao || '',
  }

  // canais -> vendas_por_canal (cores padrão)
  const paleta = ['#ef4444','#10b981','#8b5cf6','#f59e0b','#06b6d4','#64748b']
  const vendas_por_canal = (norm.canais || []).map((c, i) => ({
    canal: c.nome,
    vendas: Number(c.vendas ?? 0),
    percentual: Number(c.percentual ?? 0),
    cor: paleta[i % paleta.length],
    conversao_curso: 'MÉDIA',
    conversao_mentoria: 'MÉDIA',
    prioridade: 'Média',
  }))

  // profissoes -> vendas_por_profissao
  const profCor = { 'médicos':'#10b981', 'dentistas':'#8b5cf6', 'fisioterapeutas':'#f59e0b' }
  const vendas_por_profissao = (norm.profissoes || []).map(p => {
    const nome = String(p.nome || '')
    const key = nome.toLowerCase()
    return {
      profissao: nome.replace(/s$/,'').replace(/^médicos$/i,'Médico').replace(/^dentistas$/i,'Dentista'),
      vendas: Number(p.vendas ?? 0),
      percentual: Number(p.percentual ?? 0),
      cor: profCor[key] || '#64748b',
      ltv_estimado: 0,
      crescimento: (p.crescimento != null ? String(p.crescimento) : '0') + (String(p.crescimento).includes('%') ? '' : '%'),
      conversao_curso: 'MÉDIA',
      conversao_mentoria: 'MÉDIA',
      prioridade: key.includes('médico') || key.includes('medico') ? 'CRÍTICA' : key.includes('dent') ? 'ALTA' : 'MÉDIA',
      foco_estrategico: key.includes('médico') || key.includes('medico') || key.includes('dent'),
    }
  })

  // alias para o seu gráfico diário (se não houver no backend)
  const vendas_por_dia = []

  // segmentos_prioritarios simples a partir de medicos_dentistas
  const md = norm.medicos_dentistas || {}
  const segmentos_prioritarios = {
    medicos_dentistas: {
      vendas: Number((md.medicos?.vendas || 0) + (md.dentistas?.vendas || 0)),
      percentual: Number((md.medicos?.percentual || 0) + (md.dentistas?.percentual || 0)),
      ltv_medio: 0,
    },
    bio_instagram: {
      vendas: Number((norm.canais || []).find(c => (c.nome || '').toLowerCase().includes('instagram'))?.vendas || 0),
      percentual: Number((norm.canais || []).find(c => (c.nome || '').toLowerCase().includes('instagram'))?.percentual || 0),
      ltv_medio: 0,
    },
  }

  return {
    metricas_principais,
    vendas_por_canal,
    vendas_por_profissao,
    vendas_por_dia,
    segmentos_prioritarios,
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState(dadosAtualizadosFallback)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    document.body.setAttribute('data-version', BUILD_VERSION)
    // tenta buscar do backend e mapear
    ;(async () => {
      try {
        const bruto = await fetchDadosSeguro()
        const mapeado = bruto ? mapearBackendParaUI(bruto) : null
        if (mapeado) {
          setData(mapeado)
        } else {
          // mantém fallback sem quebrar
          console.warn('Usando fallback estático (sem dados do backend).')
        }
      } catch (e) {
        console.error('Falha ao carregar dados:', e)
        setErro('Falha ao carregar dados do servidor.')
      }
    })()
  }, [])

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
      case 'MÉDIA':
      case 'Média': return 'text-blue-700 bg-blue-100'
      case 'Baixa': return 'text-gray-700 bg-gray-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  if (erro) {
    return <div style={{ padding: 16, color: 'crimson' }}>Erro: {erro}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Imersão +10K
          </h1>
          <p className="text-slate-600 text-lg">
            Análise de IA • Dados de {data.metricas_principais?.data_atualizacao || '—'}
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="text-green-700 bg-green-100">
              🎯 Médicos + Dentistas (estim.): {(data.segmentos_prioritarios?.medicos_dentistas?.percentual ?? 0).toFixed(1)}%
            </Badge>
            <Badge variant="secondary" className="text-blue-700 bg-blue-100">
              ⭐ Bio Instagram (estim.): {(data.segmentos_prioritarios?.bio_instagram?.percentual ?? 0).toFixed(1)}%
            </Badge>
          </div>
        </div>

        {/* Navegação Principal */}
        <div className="flex justify-center px-2">
          <div className="bg-white rounded-xl shadow-lg p-2 border border-slate-200 w-full max-w-6xl">
            <div className="hidden md:flex gap-1">
              {[
                ['overview','Visão Geral'],
                ['canais','Origem & Conversão'],
                ['profissoes','Segmentos Estratégicos'],
                ['regiao','Análise Regional'],
                ['insights','Insights de IA'],
                ['projections','Projeções do Resultado'],
              ].map(([key,label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap min-h-[48px] text-base ${
                    activeTab === key ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* Layout Mobile */}
            <div className="grid grid-cols-2 gap-2 md:hidden">
              {[
                ['overview','Visão Geral'],
                ['canais','Origem & Conversão'],
                ['profissoes','Segmentos Estratégicos'],
                ['regiao','Análise Regional'],
                ['insights','Insights de IA'],
                ['projections','Projeções do Resultado'],
              ].map(([key,label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-3 rounded-lg font-medium transition-all duration-200 text-xs min-h-[48px] text-center ${
                    activeTab === key ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <div className="w-full">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Status Financeiro */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-700 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Status Financeiro
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        R$ {(data.metricas_principais?.faturamento ?? 0).toFixed(0)}
                      </div>
                      <div className="text-sm text-slate-600">Faturamento</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        R$ {(data.metricas_principais?.investimento ?? 0).toFixed(0)}
                      </div>
                      <div className="text-sm text-slate-600">Investimento</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-700">
                        R$ {((data.metricas_principais?.investimento ?? 0) - (data.metricas_principais?.faturamento ?? 0)).toFixed(0)}
                      </div>
                      <div className="text-sm text-slate-600">Déficit</div>
                    </div>
                  </div>
                  <Progress value={40} className="w-full" />
                </CardContent>
              </Card>

              {/* Métricas Principais */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">ROAS</CardTitle>
                    <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg md:text-2xl font-bold text-orange-600">
                      {(data.metricas_principais?.roas ?? 0).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">CAC</CardTitle>
                    <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg md:text-2xl font-bold text-red-600">
                      R$ {(data.metricas_principais?.cac ?? 0).toFixed(0)}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">Vendas</CardTitle>
                    <Users className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg md:text-2xl font-bold text-green-600">
                      {data.metricas_principais?.total_vendas ?? 0}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs md:text-sm font-medium">Ticket Médio</CardTitle>
                    <BarChart3 className="h-3 w-3 md:h-4 md:w-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg md:text-2xl font-bold text-purple-600">
                      R$ {(data.metricas_principais?.ticket_medio ?? 0).toFixed(0)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Segmentos Prioritários */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-700 flex items-center gap-2 text-sm md:text-base">
                      <Crown className="h-4 w-4 md:h-5 md:w-5" />
                      Segmento Premium: Médicos + Dentistas
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">Estimativa com base no backend</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-2xl md:text-3xl font-bold text-green-600">
                      {data.segmentos_prioritarios?.medicos_dentistas?.vendas ?? 0}
                    </div>
                    <div className="text-sm text-slate-600">
                      {(data.segmentos_prioritarios?.medicos_dentistas?.percentual ?? 0).toFixed(1)}% das vendas
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-blue-700 flex items-center gap-2 text-sm md:text-base">
                      <Star className="h-4 w-4 md:h-5 md:w-5" />
                      Canal Premium: Bio Instagram
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">Estimativa com base no backend</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-2xl md:text-3xl font-bold text-blue-600">
                      {data.segmentos_prioritarios?.bio_instagram?.vendas ?? 0}
                    </div>
                    <div className="text-sm text-slate-600">
                      {(data.segmentos_prioritarios?.bio_instagram?.percentual ?? 0).toFixed(1)}% das vendas
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Vendas por Canal */}
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
                        data={data.vendas_por_canal || []}
                        cx="50%" cy="50%" outerRadius={80}
                        dataKey="vendas"
                        label={({ canal, percentual }) => `${canal}: ${percentual}%`}
                      >
                        {(data.vendas_por_canal || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor || '#999'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Evolução Diária (se houver dados) */}
              {(data.vendas_por_dia && data.vendas_por_dia.length > 0) && (
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
              )}
            </div>
          )}

          {activeTab === 'canais' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Análise de Canais por Conversão Histórica
                  </CardTitle>
                  <CardDescription>Foco na qualidade de conversão</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(data.vendas_por_canal || []).map((canal, index) => (
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
                        <div className="text-right">
                          <Badge className={getPrioridadeColor(canal.prioridade || 'MÉDIA')}>
                            Prioridade: {canal.prioridade || 'MÉDIA'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'profissoes' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Segmentos por Potencial de Conversão
                  </CardTitle>
                  <CardDescription>Baseado nos dados do backend (profissões)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(data.vendas_por_profissao || []).map((prof, index) => (
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
                            <div className="text-sm text-slate-600">Crescimento: {prof.crescimento}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getPrioridadeColor(prof.prioridade)}>{prof.prioridade}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* As abas 'insights', 'regiao' e 'projections' continuam como estavam,
              mas se usarem chaves não existentes no backend, mantenha-as
              condicionais ou alimente com dados próprios. */}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 border-t pt-4">
          Dashboard atualizado • Médicos + Dentistas • Bio Instagram
        </div>
      </div>
    </div>
  )
}

export default App
