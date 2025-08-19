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
  UserCheck, Stethoscope, Activity, CheckCircle, AlertCircle, Crown, Star, MapPin
} from 'lucide-react'
import './App.css'

// Cache Busting - Força atualização
const CACHE_VERSION = Date.now();
const BUILD_VERSION = "20250817_" + CACHE_VERSION;

// Dados atualizados com foco em conversão histórica - 17/08/2025
const dadosAtualizados = {
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
  insights_ia: [
    {
      categoria: 'POSITIVO',
      insight: 'Crescimento Acelerado Sustentado',
      detalhes: 'Vendas cresceram 16.7% (98 vs 84) e faturamento 17.5% em 24h. Tendência de crescimento acelerada mantida por 4 dias consecutivos.',
      acao: 'Manter estratégia atual e intensificar campanhas para médicos nos próximos 2 dias para acelerar ainda mais o crescimento.'
    },
    {
      categoria: 'CRÍTICO',
      insight: 'Médicos Consolidam Posição de Liderança Absoluta',
      detalhes: 'Médicos cresceram 26.1% (58 vs 46 vendas) representando 59% das vendas. Confirmação definitiva como segmento premium prioritário.',
      acao: 'Concentrar 80% do budget diário em campanhas específicas para médicos por especialidade e região (RJ e SP como prioridade máxima).'
    },
    {
      categoria: 'ESTRATÉGICO',
      insight: 'Bio Instagram: Canal Orgânico em Expansão Acelerada',
      detalhes: 'Bio Instagram cresceu 20.0% (18 vs 15 vendas) mantendo CAC zero. Melhor performance orgânica histórica.',
      acao: 'Intensificar conteúdo diário: 3 posts/dia focados em médicos, cases de ROI, depoimentos por especialidade médica.'
    },
    {
      categoria: 'OPORTUNIDADE',
      insight: 'CAC e ROAS em Melhoria Gradual Consistente',
      detalhes: 'CAC melhorou 2.2% (R$ 350 vs R$ 358) e ROAS 1.8% (-0.54 vs -0.55). Otimizações funcionando.',
      acao: 'Replicar estratégias dos dias 12/08, 13/08 e 15/08 que tiveram melhor CAC para manter tendência de melhoria.'
    },
    {
      categoria: 'ALERTA',
      insight: 'Déficit Crescente Requer Atenção Estratégica',
      detalhes: 'Déficit atual de R$ 15.781 (vs R$ 14.923 anterior). Crescimento em vendas não compensa investimento ainda.',
      acao: 'Implementar controles rigorosos de CAC por campanha e pausar imediatamente campanhas com ROAS < -0.6.'
    }
  ],
  vendas_por_canal: [
    { 
      canal: 'Tráfego Pago', 
      vendas: 74, 
      percentual: 71.2, 
      cor: '#ef4444',
      conversao_curso: 'Média',
      conversao_mentoria: 'Baixa',
      prioridade: 'Alta'
    },
    { 
      canal: 'Bio Instagram', 
      vendas: 19, 
      percentual: 18.3, 
      cor: '#10b981',
      conversao_curso: 'Alta',
      conversao_mentoria: 'Média',
      prioridade: 'Premium'
    },
    { 
      canal: 'WhatsApp', 
      vendas: 2, 
      percentual: 1.9, 
      cor: '#8b5cf6',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa'
    },
    { 
      canal: 'Email', 
      vendas: 2, 
      percentual: 1.9, 
      cor: '#f59e0b',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa'
    },
    { 
      canal: 'YouTube', 
      vendas: 1, 
      percentual: 1.0, 
      cor: '#06b6d4',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa'
    },
    { 
      canal: 'Outras', 
      vendas: 6, 
      percentual: 5.8, 
      cor: '#64748b',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa'
    }
  ],
  vendas_por_profissao: [
    { 
      profissao: 'Médico', 
      vendas: 62, 
      percentual: 59.6, 
      cor: '#10b981', 
      ltv_estimado: 2500, 
      crescimento: '+34.8%',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'MÁXIMA',
      prioridade: 'CRÍTICA',
      foco_estrategico: true
    },
    { 
      profissao: 'Dentista', 
      vendas: 14, 
      percentual: 13.5, 
      cor: '#8b5cf6', 
      ltv_estimado: 1500, 
      crescimento: '+16.7%',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'ALTA',
      prioridade: 'ALTA',
      foco_estrategico: true
    },
    { 
      profissao: 'Fisioterapeuta', 
      vendas: 12, 
      percentual: 11.5, 
      cor: '#f59e0b', 
      ltv_estimado: 1200, 
      crescimento: '+9.1%',
      conversao_curso: 'MÉDIA',
      conversao_mentoria: 'MÉDIA',
      prioridade: 'MÉDIA',
      foco_estrategico: false
    },
    { 
      profissao: 'Psicólogo', 
      vendas: 7, 
      percentual: 6.7, 
      cor: '#06b6d4', 
      ltv_estimado: 1000, 
      crescimento: '+16.7%',
      conversao_curso: 'MÉDIA',
      conversao_mentoria: 'BAIXA',
      prioridade: 'MÉDIA',
      foco_estrategico: false
    },
    { 
      profissao: 'Outros', 
      vendas: 9, 
      percentual: 8.7, 
      cor: '#64748b', 
      ltv_estimado: 800, 
      crescimento: '+12.5%',
      conversao_curso: 'BAIXA',
      conversao_mentoria: 'BAIXA',
      prioridade: 'BAIXA',
      foco_estrategico: false
    }
   ],
  vendas_diarias: [
    { dia: '04/08', vendas: 2, gasto: 1569.65, cac: 784.83 },
    { dia: '05/08', vendas: 2, gasto: 1623.49, cac: 811.75 },
    { dia: '06/08', vendas: 8, gasto: 2374.10, cac: 296.76 },
    { dia: '07/08', vendas: 9, gasto: 2862.60, cac: 318.07 },
    { dia: '08/08', vendas: 8, gasto: 2525.23, cac: 315.65 },
    { dia: '09/08', vendas: 1, gasto: 2441.08, cac: 2441.08 },
    { dia: '10/08', vendas: 9, gasto: 2407.93, cac: 267.55 },
    { dia: '11/08', vendas: 7, gasto: 2925.37, cac: 417.91 },
    { dia: '12/08', vendas: 12, gasto: 3324.97, cac: 277.08 },
    { dia: '13/08', vendas: 12, gasto: 3158.70, cac: 263.23 },
    { dia: '14/08', vendas: 6, gasto: 1960.70, cac: 326.78 },
    { dia: '15/08', vendas: 8, gasto: 2225.36, cac: 278.17 },
    { dia: '16/08', vendas: 14, gasto: 2616.41, cac: 186.89 },
    { dia: '17/08', vendas: 6, gasto: 2655.27, cac: 442.55 }
  ]
};

// Dados adicionais para segmentos prioritários
const segmentosPrioritarios = {
  medicos_dentistas: {
    vendas: 76,
    percentual: 73.1,
    potencial_curso: 'MÁXIMO',
    potencial_mentoria: 'MÁXIMO',
    cac_medio: 350,
    ltv_medio: 2200
  },
  bio_instagram: {
    vendas: 19,
    percentual: 18.3,
    potencial_curso: 'MÁXIMO',
    potencial_mentoria: 'ALTO',
    cac_medio: 0,
    ltv_medio: 1800
  }
};
function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState(dadosAtualizados)

  useEffect(() => {
    document.body.setAttribute("data-version", BUILD_VERSION);
    console.log("🔄 Cache Busting ativo - Versão:", BUILD_VERSION);
  }, []);

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
          <p className="text-slate-600 text-lg">Análise de IA • Dados de 16/08/2025 • Foco em Conversão Histórica</p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="text-green-700 bg-green-100">
              🎯 Médicos + Dentistas: 69% das vendas
            </Badge>
            <Badge variant="secondary" className="text-blue-700 bg-blue-100">
              ⭐ Bio Instagram: Canal premium de conversão
            </Badge>
          </div>
        </div>

        {/* Navegação Principal - Mobile Responsiva */}
        <div className="flex justify-center px-2">
          <div className="bg-white rounded-xl shadow-lg p-2 border border-slate-200 w-full max-w-6xl">
            {/* Layout Desktop - Horizontal */}
            <div className="hidden md:flex gap-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap min-h-[48px] text-base ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('canais')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap min-h-[48px] text-base ${
                  activeTab === 'canais'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                Origem & Conversão
              </button>
              <button
                onClick={() => setActiveTab('profissoes')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap min-h-[48px] text-base ${
                  activeTab === 'profissoes'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                Segmentos Estratégicos
              </button>
              <button
                onClick={() => setActiveTab('regiao')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap min-h-[48px] text-base ${
                  activeTab === 'regiao'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                Análise Regional
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap min-h-[48px] text-base ${
                  activeTab === 'insights'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                Insights de IA
              </button>
              <button
                onClick={() => setActiveTab('projections')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap min-h-[48px] text-base ${
                  activeTab === 'projections'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                Projeções do Resultado
              </button>
            </div>
            
            {/* Layout Mobile - Grid 2x3 */}
            <div className="grid grid-cols-2 gap-2 md:hidden">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-3 rounded-lg font-medium transition-all duration-200 text-xs min-h-[48px] text-center ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('canais')}
                className={`px-3 py-3 rounded-lg font-medium transition-all duration-200 text-xs min-h-[48px] text-center ${
                  activeTab === 'canais'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                Origem & Conversão
              </button>
              <button
                onClick={() => setActiveTab('profissoes')}
                className={`px-3 py-3 rounded-lg font-medium transition-all duration-200 text-xs min-h-[48px] text-center ${
                  activeTab === 'profissoes'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                Segmentos Estratégicos
              </button>
              <button
                onClick={() => setActiveTab('regiao')}
                className={`px-3 py-3 rounded-lg font-medium transition-all duration-200 text-xs min-h-[48px] text-center ${
                  activeTab === 'regiao'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                Análise Regional
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-3 py-3 rounded-lg font-medium transition-all duration-200 text-xs min-h-[48px] text-center ${
                  activeTab === 'insights'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                Insights de IA
              </button>
              <button
                onClick={() => setActiveTab('projections')}
                className={`px-3 py-3 rounded-lg font-medium transition-all duration-200 text-xs min-h-[48px] text-center ${
                  activeTab === 'projections'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                Projeções do Resultado
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <div className="w-full">
          {activeTab === 'overview' && (
            <div className="space-y-4">
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

            {/* Métricas Principais - Responsivo */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">ROAS</CardTitle>
                  <TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold text-orange-600">{data.metricas_principais.roas.toFixed(2)}</div>
                  <p className="text-xs text-red-600">Piora de 3.4% vs. anterior</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">CAC</CardTitle>
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold text-red-600">R$ {data.metricas_principais.cac.toFixed(0)}</div>
                  <p className="text-xs text-red-600">Aumento de 7.3% vs. anterior</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">Vendas</CardTitle>
                  <Users className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold text-green-600">{data.metricas_principais.total_vendas}</div>
                  <p className="text-xs text-green-600">+34% vs. período anterior</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs md:text-sm font-medium">Ticket Médio</CardTitle>
                  <BarChart3 className="h-3 w-3 md:h-4 md:w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold text-purple-600">R$ {data.metricas_principais.ticket_medio.toFixed(0)}</div>
                  <p className="text-xs text-slate-600">Valor médio por venda</p>
                </CardContent>
              </Card>
            </div>

            {/* Segmentos Prioritários - Responsivo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center gap-2 text-sm md:text-base">
                    <Crown className="h-4 w-4 md:h-5 md:w-5" />
                    Segmento Premium: Médicos + Dentistas
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Melhor conversão histórica para curso e mentoria</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-green-600">{data.segmentos_prioritarios.medicos_dentistas.vendas}</div>
                      <div className="text-xs md:text-sm text-slate-600">Vendas (69%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-green-600">R$ {data.segmentos_prioritarios.medicos_dentistas.ltv_medio}</div>
                      <div className="text-xs md:text-sm text-slate-600">LTV Médio</div>
                    </div>
                  </div>
                  <Alert className="border-green-200 bg-green-100">
                    <Crown className="h-3 w-3 md:h-4 md:w-4" />
                    <AlertDescription className="text-green-700 text-xs md:text-sm">
                      <strong>Foco Estratégico:</strong> O foco para captação de leads (ingressos) deve ser nos <strong>Médicos</strong>, pois têm a maior probabilidade de conversão de compra tanto para curso quanto para mentoria.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center gap-2 text-sm md:text-base">
                    <Star className="h-4 w-4 md:h-5 md:w-5" />
                    Canal Premium: Bio Instagram
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Melhor taxa de conversão histórica para curso</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600">{data.segmentos_prioritarios.bio_instagram.vendas}</div>
                      <div className="text-xs md:text-sm text-slate-600">Vendas (15.4%)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold text-blue-600">R$ 0</div>
                      <div className="text-xs md:text-sm text-slate-600">CAC Orgânico</div>
                    </div>
                  </div>
                  <Alert className="border-blue-200 bg-blue-100">
                    <Star className="h-3 w-3 md:h-4 md:w-4" />
                    <AlertDescription className="text-blue-700 text-xs md:text-sm">
                      <strong>Qualidade Premium:</strong> Leads do Instagram têm maior taxa de conversão para curso. Intensificar estratégias orgânicas.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

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
                  59% das vendas. <strong>Maior probabilidade de conversão de compra para curso e mentoria</strong>. 
                  Foco estratégico principal para captação de leads.
                </AlertDescription>
              </Alert>
              <Alert className="border-purple-200 bg-purple-50">
                <Target className="h-4 w-4" />
                <AlertTitle className="text-purple-700">Dentistas - Segmento Estratégico</AlertTitle>
                <AlertDescription className="text-purple-700">
                  10% das vendas com crescimento de 100%. <strong>Alta conversão para curso (2º lugar)</strong>. 
                  Foco importante para o dia da oferta.
                </AlertDescription>
              </Alert>
            </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-4">
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
            </div>
          )}

          {activeTab === 'regiao' && (
            <div className="space-y-6">
              {/* Análise por Estado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Distribuição por Estado
                  </CardTitle>
                  <CardDescription>
                    Análise geográfica das vendas por estado brasileiro
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(data.dados_regiao.por_estado)
                      .sort(([,a], [,b]) => b.total_vendas - a.total_vendas)
                      .map(([estado, dados]) => (
                      <div key={estado} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{estado}</h3>
                          <Badge variant="secondary">{dados.percentual}%</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Vendas:</span>
                            <span className="font-medium">{dados.total_vendas}</span>
                          </div>
                          <div className="text-sm text-slate-600">
                            <strong>Profissões:</strong> {dados.profissoes.join(', ')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Análise por Profissão e Região */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Médicos por Região */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-green-600" />
                      Médicos por Região
                    </CardTitle>
                    <CardDescription>
                      Distribuição geográfica do segmento prioritário
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(data.dados_regiao.por_profissao.medicos.regioes)
                        .sort(([,a], [,b]) => b.vendas - a.vendas)
                        .map(([estado, dados]) => (
                        <div key={estado} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <div>
                            <div className="font-medium">{estado}</div>
                            <div className="text-sm text-slate-600">
                              {dados.cidades.join(', ')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-700">{dados.vendas} vendas</div>
                            <div className="text-sm text-slate-600">{dados.percentual}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Dentistas por Região */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-purple-600" />
                      Dentistas por Região
                    </CardTitle>
                    <CardDescription>
                      Distribuição geográfica do segundo segmento prioritário
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(data.dados_regiao.por_profissao.dentistas.regioes)
                        .sort(([,a], [,b]) => b.vendas - a.vendas)
                        .map(([estado, dados]) => (
                        <div key={estado} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                          <div>
                            <div className="font-medium">{estado}</div>
                            <div className="text-sm text-slate-600">
                              {dados.cidades.join(', ')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-purple-700">{dados.vendas} vendas</div>
                            <div className="text-sm text-slate-600">{dados.percentual}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights Regionais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Insights Regionais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Alert>
                      <MapPin className="h-4 w-4" />
                      <AlertTitle>Concentração Sudeste</AlertTitle>
                      <AlertDescription>
                        RJ (29.3%) + SP (27.6%) = 56.9% das vendas concentradas no Sudeste
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Crown className="h-4 w-4" />
                      <AlertTitle>Médicos RJ Dominam</AlertTitle>
                      <AlertDescription>
                        36.4% dos médicos estão no RJ, seguido por SP (24.2%)
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertTitle>Expansão Centro-Oeste</AlertTitle>
                      <AlertDescription>
                        GO (6.9%) mostra potencial com médicos e fisioterapeutas
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Target className="h-4 w-4" />
                      <AlertTitle>Oportunidade Nordeste</AlertTitle>
                      <AlertDescription>
                        PE com psicólogos e BA com dentistas indicam potencial regional
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'projections' && (
            <div className="space-y-6">
              {/* Título da Seção */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-800">Projeções do Resultado</h2>
                <p className="text-slate-600">Confronto entre Cenário Conservador Original e Projeção Realista Atualizada</p>
              </div>

              {/* Tabela Comparativa Principal */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Comparativo de Projeções: Original vs. Realista
                  </CardTitle>
                  <CardDescription>
                    Análise baseada nos dados realizados até 16/08 e projeção para o evento de 23/08
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-200">
                          <th className="text-left py-3 px-4 font-semibold text-slate-700">Indicador</th>
                          <th className="text-center py-3 px-4 font-semibold text-blue-700">Cenário Conservador (Original)</th>
                          <th className="text-center py-3 px-4 font-semibold text-green-700">Projeção Realista (Atualizada)</th>
                          <th className="text-center py-3 px-4 font-semibold text-orange-700">Diferença</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Custo por Lead (CPL)</td>
                          <td className="py-3 px-4 text-center">R$ 110</td>
                          <td className="py-3 px-4 text-center font-bold text-red-600">R$ 227</td>
                          <td className="py-3 px-4 text-center text-red-600">+106%</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Total de Leads Captados</td>
                          <td className="py-3 px-4 text-center">455</td>
                          <td className="py-3 px-4 text-center font-bold">141</td>
                          <td className="py-3 px-4 text-center text-red-600">-69%</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Comparecimento (90%)</td>
                          <td className="py-3 px-4 text-center">410 presentes</td>
                          <td className="py-3 px-4 text-center font-bold">127 presentes</td>
                          <td className="py-3 px-4 text-center text-red-600">-69%</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Taxa de Conversão (Curso)</td>
                          <td className="py-3 px-4 text-center">3%</td>
                          <td className="py-3 px-4 text-center">3%</td>
                          <td className="py-3 px-4 text-center text-slate-600">Mantida</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Vendas Curso (Ticket R$ 6.300)</td>
                          <td className="py-3 px-4 text-center">13 vendas</td>
                          <td className="py-3 px-4 text-center font-bold">4 vendas</td>
                          <td className="py-3 px-4 text-center text-red-600">-9 vendas</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Receita Curso</td>
                          <td className="py-3 px-4 text-center">R$ 81.900</td>
                          <td className="py-3 px-4 text-center font-bold">R$ 25.200</td>
                          <td className="py-3 px-4 text-center text-red-600">-R$ 56.700</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Conversão Mentoria (Ticket R$ 22.000)</td>
                          <td className="py-3 px-4 text-center">4 vendas</td>
                          <td className="py-3 px-4 text-center font-bold">1 venda</td>
                          <td className="py-3 px-4 text-center text-red-600">-3 vendas</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Receita Mentoria</td>
                          <td className="py-3 px-4 text-center">R$ 88.000</td>
                          <td className="py-3 px-4 text-center font-bold">R$ 22.000</td>
                          <td className="py-3 px-4 text-center text-red-600">-R$ 66.000</td>
                        </tr>
                        <tr className="hover:bg-slate-50 bg-blue-50">
                          <td className="py-3 px-4 font-bold">Receita Total Bruta</td>
                          <td className="py-3 px-4 text-center font-bold text-blue-600">R$ 224.500</td>
                          <td className="py-3 px-4 text-center font-bold text-green-600">R$ 70.387</td>
                          <td className="py-3 px-4 text-center font-bold text-red-600">-R$ 154.113</td>
                        </tr>
                        <tr className="hover:bg-slate-50 bg-green-50">
                          <td className="py-3 px-4 font-bold">Receita Líquida (Lucro)</td>
                          <td className="py-3 px-4 text-center font-bold text-blue-600">R$ 129.600</td>
                          <td className="py-3 px-4 text-center font-bold text-green-600">R$ 38.371</td>
                          <td className="py-3 px-4 text-center font-bold text-red-600">-R$ 91.229</td>
                        </tr>
                        <tr className="hover:bg-slate-50 bg-yellow-50">
                          <td className="py-3 px-4 font-bold">ROAS (Retorno sobre Invest.)</td>
                          <td className="py-3 px-4 text-center font-bold text-blue-600">4,49</td>
                          <td className="py-3 px-4 text-center font-bold text-green-600">2,20</td>
                          <td className="py-3 px-4 text-center font-bold text-red-600">-51%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Análise dos Resultados */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Principais Impactos */}
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-700 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Principais Impactos Identificados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-600">CPL Elevado</h4>
                      <p className="text-sm text-slate-600">
                        O custo para adquirir cada comprador de ingresso está em <strong>R$ 227</strong>, 
                        mais que o dobro do estimado (R$ 110). Este é o principal fator de impacto.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-600">Leads Abaixo do Esperado</h4>
                      <p className="text-sm text-slate-600">
                        Com <strong>141 leads</strong> projetados vs. 455 estimados (-69%), 
                        o número de vendas de curso e mentoria diminui proporcionalmente.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Resultado Final */}
                <Card className="border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-700 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Resultado Final Positivo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-600">Campanha Lucrativa</h4>
                      <p className="text-sm text-slate-600">
                        A <strong>Projeção Realista</strong> aponta para um lucro de <strong>R$ 38.371</strong> 
                        e ROAS de <strong>2,20</strong>. Resultado 70% menor que o original, mas ainda positivo.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-600">ROI Sustentável</h4>
                      <p className="text-sm text-slate-600">
                        Mesmo com os desafios, a campanha se paga e gera lucro, 
                        indicando que a estratégia tem fundamento sólido.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Conclusão */}
              <Alert className="border-blue-200 bg-blue-50">
                <Lightbulb className="h-4 w-4" />
                <AlertTitle className="text-blue-800">Conclusão da Análise</AlertTitle>
                <AlertDescription className="text-blue-700">
                  O confronto entre as projeções revela o impacto do Custo por Lead e do número de leads captados no resultado final. 
                  Embora a <strong>Projeção Realista</strong> seja significativamente menor que o cenário conservador original, 
                  ela ainda demonstra que a campanha é <strong>lucrativa e sustentável</strong>, com potencial de otimização 
                  focando na redução do CPL e aumento da taxa de conversão.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="text-center text-sm text-slate-500 border-t pt-4">
          Dashboard atualizado com foco em conversão histórica • Médicos + Dentistas: Segmentos prioritários • Bio Instagram: Canal premium
        </div>
      </div>
    </div>
  )
}

export default App

