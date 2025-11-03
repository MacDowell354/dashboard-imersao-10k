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
const BUILD_VERSION = "20250822_FINAL_" + CACHE_VERSION;

// Dados FINAIS da campanha - 22/08/2025 - CAMPANHA ENCERRADA
const dadosAtualizados = {
  metricas_principais: {
    roas: -0.48,
    cac: 309.95,
    total_vendas: 152,
    faturamento: 24513.40,
    investimento: 47112.29,
    deficit: 22598.89,
    ticket_medio: 161.27,
    data_atualizacao: '22/08/2025 - CAMPANHA ENCERRADA'
  },
  insights_ia: [
    {
      categoria: 'POSITIVO',
      insight: '🎉 CAMPANHA ENCERRADA COM SUCESSO - 22/08',
      detalhes: 'Último dia EXCEPCIONAL: 15 vendas com CAC R$ 157,86 (MELHOR CAC da campanha). Recuperação confirmada nos últimos 4 dias (10→12→8→15). Total final: 152 leads captados.',
      acao: 'Campanha oficialmente encerrada. Focar na preparação do evento com os 152 leads finais para maximizar conversões.'
    },
    {
      categoria: 'ESTRATÉGICO',
      insight: 'Projeção Final do Evento - 152 Leads Captados',
      detalhes: 'Com 152 leads finais: Curso (3% conversão) = 4-5 vendas × R$ 6.300 = R$ 25-31k. Mentoria (30% das vendas curso) = 1-2 vendas × R$ 22k = R$ 22-44k. Total: R$ 47-75k.',
      acao: 'Preparar evento com estratégias específicas para médicos (66% dos leads). Foco na qualidade da apresentação para maximizar conversões.'
    },
    {
      categoria: 'SUCESSO',
      insight: 'Bio Instagram: Canal Premium Consolidado',
      detalhes: 'Bio Instagram: 34 vendas (22.4%) com CAC zero. Crescimento de +5 vendas no último dia. Leads orgânicos têm maior probabilidade de conversão no evento.',
      acao: 'Usar cases de sucesso do Bio Instagram no evento. Leads orgânicos são premium para conversão em curso e mentoria.'
    },
    {
      categoria: 'RESULTADO',
      insight: 'Déficit Controlável - Evento Decisivo para Lucro',
      detalhes: 'Déficit final R$ 22.599. Com projeção conservadora do evento (R$ 47k), resultado final: +R$ 24k lucro. Cenário otimista (R$ 75k): +R$ 52k lucro.',
      acao: 'Evento é decisivo para transformar déficit em lucro. Focar qualidade da apresentação e follow-up para maximizar conversões dos 152 leads.'
    },
    {
      categoria: 'ANÁLISE',
      insight: 'Métricas Finais - Melhoria Consistente',
      detalhes: 'CAC final R$ 309,95 (melhoria vs R$ 327). ROAS -0.48 (melhoria vs -0.50). Último dia com melhor CAC da campanha (R$ 157,86). Tendência positiva confirmada.',
      acao: 'Replicar estratégias do último dia em futuras campanhas. CAC abaixo de R$ 200 é o benchmark ideal para próximas captações.'
    }
  ],
  vendas_por_canal: [
    { 
      canal: 'Tráfego Pago', 
      vendas: 101, 
      percentual: 66.4, 
      cor: '#ef4444',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'ALTA',
      prioridade: 'CRÍTICA'
    },
    { 
      canal: 'Bio Instagram', 
      vendas: 34, 
      percentual: 22.4, 
      cor: '#10b981',
      conversao_curso: 'MÁXIMA',
      conversao_mentoria: 'MÁXIMA',
      prioridade: 'CRÍTICA'
    },
    { 
      canal: 'Outras', 
      vendas: 8, 
      percentual: 5.3, 
      cor: '#6b7280',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa'
    },
    { 
      canal: 'Email', 
      vendas: 4, 
      percentual: 2.6, 
      cor: '#3b82f6',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa'
    },
    { 
      canal: 'YouTube', 
      vendas: 3, 
      percentual: 2.0, 
      cor: '#8b5cf6',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa'
    },
    { 
      canal: 'WhatsApp', 
      vendas: 2, 
      percentual: 1.3, 
      cor: '#22c55e',
      conversao_curso: 'Média',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa'
    }
  ],
  vendas_por_profissao: [
    { 
      profissao: 'Médico', 
      vendas: 69, 
      percentual: 59.0, 
      cor: '#10b981', 
      ltv_estimado: 2500, 
      crescimento: '+37.0%',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'MÁXIMA',
      prioridade: 'CRÍTICA',
      foco_estrategico: true
    },
    { 
      profissao: 'Dentista', 
      vendas: 16, 
      percentual: 13.7, 
      cor: '#8b5cf6', 
      ltv_estimado: 1500, 
      crescimento: '+25.0%',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'Média',
      prioridade: 'ALTA',
      foco_estrategico: true
    },
    { 
      profissao: 'Fisioterapeuta', 
      vendas: 13, 
      percentual: 11.1, 
      cor: '#0ea5e9', 
      ltv_estimado: 1200, 
      crescimento: '+8.3%',
      conversao_curso: 'Média',
      conversao_mentoria: 'Baixa',
      prioridade: 'Média',
      foco_estrategico: false
    },
    { 
      profissao: 'Nutricionista', 
      vendas: 8, 
      percentual: 6.8, 
      cor: '#f59e0b', 
      ltv_estimado: 800, 
      crescimento: '+14.3%',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    },
    { 
      profissao: 'Psicólogo', 
      vendas: 6, 
      percentual: 5.1, 
      cor: '#ec4899', 
      ltv_estimado: 700, 
      crescimento: '-14.3%',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    },
    { 
      profissao: 'Outros', 
      vendas: 5, 
      percentual: 4.3, 
      cor: '#6b7280', 
      ltv_estimado: 600, 
      crescimento: '-16.7%',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    },
    { 
      profissao: 'Veterinário', 
      vendas: 2, 
      percentual: 3, 
      cor: '#84cc16', 
      ltv_estimado: 1000, 
      crescimento: '+0%',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    },
    { 
      profissao: 'Nutricionista', 
      vendas: 1, 
      percentual: 1, 
      cor: '#06b6d4', 
      ltv_estimado: 700, 
      crescimento: '+0%',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    },
    { 
      profissao: 'Fonoaudiólogo', 
      vendas: 1, 
      percentual: 1, 
      cor: '#a855f7', 
      ltv_estimado: 800, 
      crescimento: '+0%',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    },
    { 
      profissao: 'Outras', 
      vendas: 1, 
      percentual: 1, 
      cor: '#6b7280', 
      ltv_estimado: 600, 
      crescimento: 'NOVO',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    }
  ],
  vendas_por_dia: [
    { dia: '12/08', vendas: 12, investimento: 3324.97, faturamento: 1960.00, cac: 277.08 },
    { dia: '13/08', vendas: 12, investimento: 3158.70, faturamento: 1948.80, cac: 263.22 },
    { dia: '14/08', vendas: 6, investimento: 1960.70, faturamento: 937.79, cac: 326.78 },
    { dia: '15/08', vendas: 8, investimento: 2225.36, faturamento: 1367.59, cac: 278.17 },
    { dia: '16/08', vendas: 14, investimento: 2616.41, faturamento: 2386.99, cac: 186.89 },
    { dia: '17/08', vendas: 6, investimento: 2655.27, faturamento: 839.40, cac: 442.55 },
    { dia: '18/08', vendas: 3, investimento: 2654.30, faturamento: 518.09, cac: 884.77 },
    { dia: '19/08', vendas: 10, investimento: 2730.05, faturamento: 1631.38, cac: 273.01 },
    { dia: '20/08', vendas: 12, investimento: 2403.51, faturamento: 1954.40, cac: 200.29 },
    { dia: '21/08', vendas: 8, investimento: 2285.74, faturamento: 1277.59, cac: 285.72 },
    { dia: '22/08', vendas: 15, investimento: 2367.83, faturamento: 2286.89, cac: 157.86 }
  ],
  segmentos_prioritarios: {
    medicos_dentistas: {
      vendas: 58,
      percentual: 69,
      potencial_curso: 'MÁXIMO',
      potencial_mentoria: 'MÁXIMO',
      cac_medio: 350,
      ltv_medio: 2200
    },
    bio_instagram: {
      vendas: 15,
      percentual: 17.9,
      potencial_curso: 'MÁXIMO',
      potencial_mentoria: 'ALTO',
      cac_medio: 0,
      ltv_medio: 1800
    }
  },
  dados_regiao: {
    por_profissao: {
      medicos: {
        total_vendas: 38,
        regioes: {
          'RJ': { vendas: 14, cidades: ['Rio de Janeiro', 'Niterói'], percentual: 36.8 },
          'SP': { vendas: 10, cidades: ['São Paulo', 'Campinas', 'Marília'], percentual: 26.3 },
          'MG': { vendas: 5, cidades: ['Belo Horizonte', 'Uberlândia'], percentual: 13.2 },
          'GO': { vendas: 3, cidades: ['Goiânia'], percentual: 7.9 },
          'RS': { vendas: 2, cidades: ['Porto Alegre', 'Gramado'], percentual: 5.3 },
          'RO': { vendas: 2, cidades: ['Porto Velho'], percentual: 5.3 },
          'ES': { vendas: 1, cidades: ['Vitória'], percentual: 2.6 },
          'DF': { vendas: 1, cidades: ['Brasília'], percentual: 2.6 }
        }
      },
      dentistas: {
        total_vendas: 12,
        regioes: {
          'SP': { vendas: 5, cidades: ['São Paulo', 'Campinas'], percentual: 41.7 },
          'RJ': { vendas: 4, cidades: ['Rio de Janeiro'], percentual: 33.3 },
          'PR': { vendas: 2, cidades: ['Curitiba'], percentual: 16.7 },
          'BA': { vendas: 1, cidades: ['Salvador'], percentual: 8.3 }
        }
      },
      fisioterapeutas: {
        total_vendas: 10,
        regioes: {
          'SP': { vendas: 4, cidades: ['São Paulo', 'Campinas'], percentual: 40.0 },
          'RJ': { vendas: 2, cidades: ['Rio de Janeiro'], percentual: 20.0 },
          'GO': { vendas: 2, cidades: ['Goiânia'], percentual: 20.0 },
          'MS': { vendas: 1, cidades: ['Campo Grande'], percentual: 10.0 },
          'MT': { vendas: 1, cidades: ['Lucas do Rio Verde'], percentual: 10.0 }
        }
      },
      psicologos: {
        total_vendas: 5,
        regioes: {
          'SP': { vendas: 2, cidades: ['São Paulo'], percentual: 40.0 },
          'PE': { vendas: 2, cidades: ['João Pessoa', 'Serra Talhada'], percentual: 40.0 },
          'PI': { vendas: 1, cidades: ['Teresina'], percentual: 20.0 }
        }
      }
    },
    por_estado: {
      'RJ': { total_vendas: 20, percentual: 28.6, profissoes: ['Médico', 'Dentista', 'Fisioterapeuta', 'Fonoaudiólogo'] },
      'SP': { total_vendas: 19, percentual: 27.1, profissoes: ['Médico', 'Dentista', 'Fisioterapeuta', 'Psicólogo'] },
      'MG': { total_vendas: 5, percentual: 7.1, profissoes: ['Médico'] },
      'GO': { total_vendas: 5, percentual: 7.1, profissoes: ['Médico', 'Fisioterapeuta'] },
      'RS': { total_vendas: 3, percentual: 4.3, profissoes: ['Médico'] },
      'RO': { total_vendas: 2, percentual: 2.9, profissoes: ['Médico'] },
      'PE': { total_vendas: 3, percentual: 4.3, profissoes: ['Psicólogo'] },
      'PR': { total_vendas: 3, percentual: 4.3, profissoes: ['Dentista', 'Nutricionista'] },
      'BA': { total_vendas: 2, percentual: 2.9, profissoes: ['Dentista', 'Psicoterapeuta'] },
      'ES': { total_vendas: 2, percentual: 2.9, profissoes: ['Médico', 'Veterinário'] },
      'AM': { total_vendas: 1, percentual: 1.4, profissoes: ['Veterinário'] },
      'MS': { total_vendas: 1, percentual: 1.4, profissoes: ['Fisioterapeuta'] },
      'MT': { total_vendas: 1, percentual: 1.4, profissoes: ['Fisioterapeuta'] },
      'PI': { total_vendas: 1, percentual: 1.4, profissoes: ['Psicólogo'] },
      'DF': { total_vendas: 2, percentual: 2.9, profissoes: ['Médico'] }
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
          <p className="text-slate-600 text-lg">Análise de IA • Dados FINAIS 22/08/2025 • CAMPANHA ENCERRADA</p>
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
                <Alert className="border-red-200 bg-red-100">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">
                    🚨 CRÍTICO: Queda acentuada 16/08: 14 vendas → 17/08: 6 vendas → 18/08: 3 vendas | CAC disparou: R$ 187 → R$ 443 → R$ 885
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
                <p className="text-slate-600">Análise Realista com Taxas de Conversão Confirmadas - Prazo Final: 22/08/25</p>
              </div>

              {/* Tabela Comparativa Principal */}
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Projeção Realista do Evento - Taxas Confirmadas
                  </CardTitle>
                  <CardDescription>
                    ✅ RECUPERAÇÃO: 19/08 mostrou recuperação (10 vendas, CAC R$ 273). Último dia de captação: 22/08/25
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
                          <th className="text-center py-3 px-4 font-semibold text-purple-700">Realizado até 25-08</th>
                          <th className="text-center py-3 px-4 font-semibold text-orange-700">Diferença</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Custo por Lead (CPL)</td>
                          <td className="py-3 px-4 text-center">R$ 110</td>
                          <td className="py-3 px-4 text-center font-bold text-red-600">R$ 342</td>
                          <td className="py-3 px-4 text-center font-bold text-purple-600">R$ 300,08</td>
                          <td className="py-3 px-4 text-center text-green-600">-R$ 41,92</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Total de Leads Captados (Ingressos)</td>
                          <td className="py-3 px-4 text-center">455</td>
                          <td className="py-3 px-4 text-center font-bold">152</td>
                          <td className="py-3 px-4 text-center font-bold text-purple-600">157</td>
                          <td className="py-3 px-4 text-center text-green-600">+5 leads</td>
                        </tr>
                        <tr className="hover:bg-slate-50 bg-blue-50">
                          <td className="py-3 px-4 font-medium">Receita Ingressos</td>
                          <td className="py-3 px-4 text-center">R$ 54.600</td>
                          <td className="py-3 px-4 text-center font-bold">R$ 18.240</td>
                          <td className="py-3 px-4 text-center font-bold text-purple-600">R$ 25.113</td>
                          <td className="py-3 px-4 text-center text-green-600">+R$ 6.873</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Comparecimento (90%)</td>
                          <td className="py-3 px-4 text-center">410 presentes</td>
                          <td className="py-3 px-4 text-center font-bold">137 presentes</td>
                          <td className="py-3 px-4 text-center font-bold text-purple-600">116 presentes (pico)</td>
                          <td className="py-3 px-4 text-center text-red-600">-21 presentes</td>
                        </tr>
                        <tr className="hover:bg-slate-50 bg-gray-100">
                          <td className="py-3 px-4 font-medium">Taxa de Conversão (Curso)</td>
                          <td className="py-3 px-4 text-center">3%</td>
                          <td className="py-3 px-4 text-center">3%</td>
                          <td className="py-3 px-4 text-center font-bold text-purple-600">6%</td>
                          <td className="py-3 px-4 text-center text-green-600">+3%</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Vendas Curso (Ticket R$ 6.300)</td>
                          <td className="py-3 px-4 text-center">13 vendas</td>
                          <td className="py-3 px-4 text-center font-bold">4 vendas</td>
                          <td className="py-3 px-4 text-center font-bold text-purple-600">9 vendas</td>
                          <td className="py-3 px-4 text-center text-green-600">+5 vendas</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Receita Curso</td>
                          <td className="py-3 px-4 text-center">R$ 81.900</td>
                          <td className="py-3 px-4 text-center font-bold">R$ 25.200</td>
                          <td className="py-3 px-4 text-center font-bold text-purple-600">R$ 58.615</td>
                          <td className="py-3 px-4 text-center text-green-600">+R$ 33.415</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Conversão Mentoria (Ticket R$ 22.000)</td>
                          <td className="py-3 px-4 text-center">4 vendas</td>
                          <td className="py-3 px-4 text-center font-bold">1 venda</td>
                          <td className="py-3 px-4 text-center font-bold text-purple-600">0 vendas</td>
                          <td className="py-3 px-4 text-center text-red-600">-1 venda</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">Receita Mentoria</td>
                          <td className="py-3 px-4 text-center">R$ 88.000</td>
                          <td className="py-3 px-4 text-center font-bold">R$ 22.000</td>
                          <td className="py-3 px-4 text-center font-bold text-purple-600">R$ 0</td>
                          <td className="py-3 px-4 text-center text-red-600">-R$ 22.000</td>
                        </tr>
                        <tr className="hover:bg-slate-50 bg-blue-50">
                          <td className="py-3 px-4 font-bold">Receita Total Bruta</td>
                          <td className="py-3 px-4 text-center font-bold text-blue-600">R$ 224.500</td>
                          <td className="py-3 px-4 text-center font-bold text-green-600">R$ 65.440</td>
                          <td className="py-3 px-4 text-center font-bold text-purple-600">R$ 83.728</td>
                          <td className="py-3 px-4 text-center text-green-600">+R$ 18.288</td>
                        </tr>
                        <tr className="hover:bg-slate-50 bg-green-50">
                          <td className="py-3 px-4 font-bold">Receita Líquida (Lucro)</td>
                          <td className="py-3 px-4 text-center font-bold text-blue-600">R$ 208.448</td>
                          <td className="py-3 px-4 text-center font-bold text-green-600">R$ 60.761</td>
                          <td className="py-3 px-4 text-center font-bold text-purple-600">R$ 77.742</td>
                          <td className="py-3 px-4 text-center text-green-600">+R$ 16.981</td>
                        </tr>
                        <tr className="hover:bg-slate-50 bg-yellow-50">
                          <td className="py-3 px-4 font-bold">ROAS (Retorno sobre Invest.)</td>
                          <td className="py-3 px-4 text-center font-bold text-blue-600">4,486</td>
                          <td className="py-3 px-4 text-center font-bold text-green-600">1,259</td>
                          <td className="py-3 px-4 text-center font-bold text-purple-600">1,777</td>
                          <td className="py-3 px-4 text-center text-green-600">+0,518</td>
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
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-700 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Resultado Final e Aprendizados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-600">Campanha com Aprendizados Importantes</h4>
                      <p className="text-sm text-slate-600">
                        O <strong>Realizado até 25/08</strong> confirma <strong>ROAS de 1,777</strong> com receita total de 
                        R$ 83.728 (ingressos + curso), mas <strong>não foi suficiente para gerar um ROI positivo</strong> 
                        quando considerados todos os custos operacionais. ROI final de <strong>-0,306</strong>, o que significa que 
                        <strong>para cada R$ 1 investido no projeto total, houve perda de R$ 0,31</strong>.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-red-600">Principais Impactos Identificados</h4>
                      <p className="text-sm text-slate-600">
                        <strong className="text-red-600">CAC Elevado:</strong> O custo por lead (R$ 300,08) ficou <strong className="text-red-600">172,8% acima</strong> 
                        da meta (R$ 110), sendo o principal fator de impacto negativo na rentabilidade da campanha.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-600">Análise de Receita Detalhada</h4>
                      <p className="text-sm text-slate-600">
                        <strong>Receita Ingressos:</strong> R$ 25.113 (157 leads captados)<br/>
                        <strong>Receita Curso:</strong> R$ 58.615 (9 vendas High Ticket)<br/>
                        <strong>Receita Total Bruta:</strong> R$ 83.728<br/>
                        <strong>Receita Líquida:</strong> R$ 77.742 (após impostos)<br/>
                        <strong>Taxa de Conversão:</strong> 5,7%
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-600">Análise de Custos Crítica</h4>
                      <p className="text-sm text-slate-600">
                        <strong>Investimento Tráfego:</strong> R$ 47.112<br/>
                        <strong>Serviços Terceiros:</strong> R$ 32.900<br/>
                        <strong>Software/Licenças:</strong> R$ 23.566<br/>
                        <strong>Outros Custos:</strong> R$ 11.011<br/>
                        <strong>Impostos:</strong> R$ 5.987<br/>
                        <strong>Custos Totais:</strong> R$ 120.576<br/>
                        <strong>Prejuízo Final:</strong> R$ 36.848
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-600">Métricas de Performance</h4>
                      <p className="text-sm text-slate-600">
                        <strong>ROAS:</strong> 1,777 (tráfego eficiente)<br/>
                        <strong>CPL:</strong> R$ 300,08 (172,8% acima da meta)<br/>
                        <strong>Custo por Venda:</strong> R$ 5.235<br/>
                        <strong>ROI Final:</strong> -0,306 (incluindo impostos)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-slate-600">Aprendizados Estratégicos</h4>
                      <p className="text-sm text-slate-600">
                        ROAS positivo (1,777) demonstra eficiência do tráfego, mas <strong className="text-red-600">CPL 172,8% acima da meta</strong> 
                        foi o principal fator de impacto. Próximas campanhas devem focar na <strong className="text-red-600">otimização do CAC</strong> 
                        para viabilizar rentabilidade com a estrutura atual.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Alerta sobre Prazo Final e Recuperação */}
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle className="text-green-800">✅ RECUPERAÇÃO CONFIRMADA + PRAZO FINAL</AlertTitle>
                <AlertDescription className="text-green-700">
                  <strong>Recuperação Significativa:</strong> Dia 19/08 mostrou excelente recuperação:
                  <br />• 18/08: 3 vendas (CAC R$ 885) - Pior dia
                  <br />• 19/08: 10 vendas (CAC R$ 273) - Recuperação de 233%
                  <br />• 22/08: 15 vendas (CAC R$ 158) - MELHOR CAC DA CAMPANHA
                  <br /><br />
                  <strong>🎉 CAMPANHA ENCERRADA:</strong> <strong>152 leads captados</strong> em 22/08/2025.
                  <br />Último dia excepcional com 15 vendas e melhor CAC da campanha (R$ 157,86).
                </AlertDescription>
              </Alert>

              {/* Conclusão Atualizada */}
              <Alert className="border-blue-200 bg-blue-50">
                <Lightbulb className="h-4 w-4" />
                <AlertTitle className="text-blue-800">Conclusão da Análise Realista</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Com as <strong>taxas de conversão confirmadas</strong> (3% curso, 30% mentoria) e <strong>152 leads captados</strong> em 22/08, 
                  o evento tem potencial de gerar <strong>R$ 47-75k</strong>, resultando em lucro final de <strong>R$ 26-54k</strong>. 
                  A campanha é <strong>lucrativa e sustentável</strong>, mesmo com o déficit atual de R$ 21k. 
                  Foco deve ser na <strong>qualidade dos leads</strong> e <strong>otimização da apresentação</strong> para médicos (59% dos leads).
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

