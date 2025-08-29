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
  GraduationCap, BookOpen, Clock, Zap, Shield, Award, Timer
} from 'lucide-react'
import { gerarDadosExemplo, prepararDadosGraficos } from './utils/regiaoAnalise.js'
import './App.css'

// Dados das previsões CHT - BASEADOS NA PLANILHA REAL
const previsoesCHT = {
  "data_analise": "23/08/2025",
  "periodo_captacao": "25/08/2025 a 21/09/2025",
  "duracao_dias": 28,
  "status_lancamento": "PRÉ-LANÇAMENTO",
  "dias_para_inicio": 2, // 25/08 - 23/08 = 2 dias
  
  // DADOS REAIS DA PLANILHA - CENÁRIO CONSERVADOR
  "cenario_conservador": {
    "cpl_medio": 21,
    "total_leads": 11000,
    "taxa_conversao_curso": 0.0062, // 0,62%
    "ticket_curso": 5627,
    "vendas_curso": 68.2,
    "receita_curso": 383761.4,
    "taxa_conversao_mentoria": 0.3, // 30%
    "ticket_mentoria": 22000,
    "vendas_mentoria": 20.46,
    "receita_mentoria": 450120,
    "receita_bruta": 833881.4,
    "custo_trafego": 231000,
    "receita_liquida": 602881.4,
    "roas": 3.6098761904761907
  },
  
  // CENÁRIO REALISTA (PROJEÇÃO OTIMISTA)
  "cenario_realista": {
    "cpl_medio": 18,
    "total_leads": 13000,
    "taxa_conversao_curso": 0.008, // 0,8%
    "ticket_curso": 5627,
    "vendas_curso": 104,
    "receita_curso": 585208,
    "taxa_conversao_mentoria": 0.35, // 35%
    "ticket_mentoria": 22000,
    "vendas_mentoria": 36.4,
    "receita_mentoria": 800800,
    "receita_bruta": 1386008,
    "custo_trafego": 234000,
    "receita_liquida": 1152008,
    "roas": 5.92
  },
  
  "cronograma": [
    {"data": "25/08/2025", "evento": "Início Captação", "descricao": "Início da captação de leads", "status": "pendente"},
    {"data": "08/09/2025", "evento": "Aquecimento", "descricao": "Início das aulas de aquecimento", "status": "pendente"},
    {"data": "15/09/2025", "evento": "CPL 1", "descricao": "Primeira aula gratuita do curso", "status": "pendente"},
    {"data": "17/09/2025", "evento": "CPL 2", "descricao": "Segunda aula gratuita do curso", "status": "pendente"},
    {"data": "19/09/2025", "evento": "CPL 3", "descricao": "Terceira aula gratuita do curso", "status": "pendente"},
    {"data": "21/09/2025", "evento": "CPL 4 + Carrinho", "descricao": "Quarta aula + Abertura do carrinho", "status": "pendente"}
  ],
  
  "fontes_previstas": [
    {"nome": "YouTube", "leads_previstos": 3850, "percentual": 35, "cor": "#ff6b6b", "prioridade": "CRÍTICA", "conversao_curso": "ALTA", "conversao_mentoria": "ALTA"},
    {"nome": "Facebook", "leads_previstos": 3300, "percentual": 30, "cor": "#4ecdc4", "prioridade": "CRÍTICA", "conversao_curso": "MÉDIA", "conversao_mentoria": "ALTA"},
    {"nome": "Google Search", "leads_previstos": 2200, "percentual": 20, "cor": "#45b7d1", "prioridade": "ALTA", "conversao_curso": "ALTA", "conversao_mentoria": "MÉDIA"},
    {"nome": "Instagram", "leads_previstos": 1100, "percentual": 10, "cor": "#96ceb4", "prioridade": "ALTA", "conversao_curso": "MÁXIMA", "conversao_mentoria": "MÁXIMA"},
    {"nome": "Email", "leads_previstos": 330, "percentual": 3, "cor": "#feca57", "prioridade": "Média", "conversao_curso": "Baixa", "conversao_mentoria": "Baixa"},
    {"nome": "WhatsApp", "leads_previstos": 220, "percentual": 2, "cor": "#ff9ff3", "prioridade": "Baixa", "conversao_curso": "Média", "conversao_mentoria": "Baixa"}
  ],
  
  "segmentos_previstos": [
    {"profissao": "Médico", "leads_previstos": 5500, "percentual": 50, "ltv": 2500, "conversao_curso": "ALTA", "conversao_mentoria": "MÁXIMA", "prioridade": "CRÍTICA"},
    {"profissao": "Dentista", "leads_previstos": 2200, "percentual": 20, "ltv": 1500, "conversao_curso": "ALTA", "conversao_mentoria": "MÉDIA", "prioridade": "ALTA"},
    {"profissao": "Fisioterapeuta", "leads_previstos": 1650, "percentual": 15, "ltv": 1200, "conversao_curso": "Média", "conversao_mentoria": "Baixa", "prioridade": "Média"},
    {"profissao": "Nutricionista", "leads_previstos": 880, "percentual": 8, "ltv": 800, "conversao_curso": "Baixa", "conversao_mentoria": "Baixa", "prioridade": "Baixa"},
    {"profissao": "Psicólogo", "leads_previstos": 550, "percentual": 5, "ltv": 700, "conversao_curso": "Baixa", "conversao_mentoria": "Baixa", "prioridade": "Baixa"},
    {"profissao": "Outros", "leads_previstos": 220, "percentual": 2, "ltv": 600, "conversao_curso": "Baixa", "conversao_mentoria": "Baixa", "prioridade": "Baixa"}
  ],
  
  "urls": {
    "inscricao": "https://nandamac.com/cht/inscricao-cht",
    "vendas": "https://nandamac.com/cht/pgv-cht"
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [dadosRegionais, setDadosRegionais] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
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

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const getPrioridadeColor = (prioridade) => {
    switch(prioridade) {
      case 'CRÍTICA': return 'text-red-600 bg-red-50 border-red-200'
      case 'ALTA': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'Média': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'Baixa': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getConversaoColor = (conversao) => {
    switch(conversao) {
      case 'MÁXIMA': return 'text-green-600'
      case 'ALTA': return 'text-green-500'
      case 'Média': return 'text-yellow-600'
      case 'Baixa': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando Dashboard CHT...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header - SEMPRE VISÍVEL */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Dashboard CHT
          </h1>
          <p className="text-gray-600 text-lg">
            Análise de IA • Projeção Realista dos Resultados • Curso Viver de Pacientes High Ticket
          </p>
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              🎯 Profissionais da Saúde: Público-alvo premium
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              ⭐ Curso + Mentoria: Dupla monetização
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              ⏰ Início em {previsoesCHT.dias_para_inicio} dias (25/08)
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="origem" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Origem & Conversão
            </TabsTrigger>
            <TabsTrigger value="segmentos" className="flex items-center gap-2">
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
            <TabsTrigger value="projecoes" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Projeções do Resultado
            </TabsTrigger>
          </TabsList>

          {/* Tab: Visão Geral - COMPLETA COM HEADER E MÉTRICAS */}
          <TabsContent value="overview" className="space-y-6">
            {/* Status Pré-Lançamento */}
            <Alert className="border-l-4 border-l-blue-500 bg-blue-50">
              <Timer className="h-4 w-4" />
              <AlertTitle className="text-blue-800">Status Pré-Lançamento - Projeção Realista dos Resultados</AlertTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(previsoesCHT.cenario_conservador.receita_bruta)}</div>
                  <div className="text-sm text-gray-600">Receita Bruta Prevista</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(previsoesCHT.cenario_conservador.receita_liquida)}</div>
                  <div className="text-sm text-gray-600">Receita Líquida</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{previsoesCHT.cenario_conservador.roas.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">ROAS</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-blue-800 text-sm">
                  ⏰ <strong>PRÉ-LANÇAMENTO:</strong> Dashboard configurado com projeção realista baseada em dados históricos. 
                  Lançamento inicia em <strong>{previsoesCHT.dias_para_inicio} dias (25/08/2025)</strong>. 
                  Dados reais serão atualizados na terça-feira (26/08).
                </p>
              </div>
            </Alert>

            {/* Métricas Principais - DADOS DA PLANILHA */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Taxa Conversão Curso</p>
                      <p className="text-2xl font-bold text-orange-600">{formatPercentage(previsoesCHT.cenario_conservador.taxa_conversao_curso)}</p>
                      <p className="text-xs text-gray-500">Cenário conservador</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">CPL Médio</p>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(previsoesCHT.cenario_conservador.cpl_medio)}</p>
                      <p className="text-xs text-gray-500">Custo por lead</p>
                    </div>
                    <Target className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total de Leads</p>
                      <p className="text-2xl font-bold text-green-600">{formatNumber(previsoesCHT.cenario_conservador.total_leads)}</p>
                      <p className="text-xs text-gray-500">Meta conservadora</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Vendas Totais</p>
                      <p className="text-2xl font-bold text-purple-600">{Math.round(previsoesCHT.cenario_conservador.vendas_curso + previsoesCHT.cenario_conservador.vendas_mentoria)}</p>
                      <p className="text-xs text-gray-500">Curso + Mentoria</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Segmentos Premium - DADOS DA PLANILHA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Crown className="h-5 w-5" />
                    Curso: Viver de Pacientes High Ticket
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Ticket: {formatCurrency(previsoesCHT.cenario_conservador.ticket_curso)} | Conversão: {formatPercentage(previsoesCHT.cenario_conservador.taxa_conversao_curso)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{Math.round(previsoesCHT.cenario_conservador.vendas_curso)}</div>
                      <div className="text-sm text-green-700">Vendas Previstas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{formatCurrency(previsoesCHT.cenario_conservador.receita_curso)}</div>
                      <div className="text-sm text-green-700">Receita</div>
                    </div>
                  </div>
                  <Alert className="bg-green-100 border-green-300">
                    <Star className="h-4 w-4" />
                    <AlertDescription className="text-green-800">
                      <strong>Produto Principal:</strong> Curso focado em profissionais da saúde que querem 
                      viver exclusivamente de pacientes high ticket.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Star className="h-5 w-5" />
                    Mentoria: Acompanhamento Premium
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Ticket: {formatCurrency(previsoesCHT.cenario_conservador.ticket_mentoria)} | Conversão: {formatPercentage(previsoesCHT.cenario_conservador.taxa_conversao_mentoria)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{Math.round(previsoesCHT.cenario_conservador.vendas_mentoria)}</div>
                      <div className="text-sm text-blue-700">Vendas Previstas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{formatCurrency(previsoesCHT.cenario_conservador.receita_mentoria)}</div>
                      <div className="text-sm text-blue-700">Receita</div>
                    </div>
                  </div>
                  <Alert className="bg-blue-100 border-blue-300">
                    <Star className="h-4 w-4" />
                    <AlertDescription className="text-blue-800">
                      <strong>Upsell Premium:</strong> 30% dos compradores do curso adquirem mentoria 
                      personalizada para implementação acelerada.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos - PREVISÕES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Distribuição Prevista por Canal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={previsoesCHT.fontes_previstas}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ nome, percentual }) => `${nome}: ${percentual}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="leads_previstos"
                      >
                        {previsoesCHT.fontes_previstas.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatNumber(value), 'Leads Previstos']} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Cronograma do Lançamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {previsoesCHT.cronograma.map((evento, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-center min-w-[60px]">
                          <div className="text-sm font-bold text-indigo-600">{evento.data.split('/')[0]}</div>
                          <div className="text-xs text-gray-600">{evento.data.split('/')[1]}</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{evento.evento}</div>
                          <div className="text-sm text-gray-600">{evento.descricao}</div>
                        </div>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700">
                          Pendente
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Origem & Conversão - PREVISÕES */}
          <TabsContent value="origem" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Previsão de Canais por Potencial de Conversão
                </CardTitle>
                <CardDescription>Baseado em meta de {formatNumber(previsoesCHT.cenario_conservador.total_leads)} leads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previsoesCHT.fontes_previstas.map((fonte, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4" style={{borderLeftColor: fonte.cor}}>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold" style={{color: fonte.cor}}>{formatNumber(fonte.leads_previstos)}</div>
                          <div className="text-sm text-gray-600">{fonte.percentual}%</div>
                          <div className="text-xs text-gray-500">Leads previstos</div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{fonte.nome}</h4>
                          <p className="text-sm text-gray-600">Meta baseada em histórico</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`mb-2 ${getPrioridadeColor(fonte.prioridade)}`}>
                          Prioridade: {fonte.prioridade}
                        </Badge>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Conversão Curso:</span>
                            <span className={`font-semibold ${getConversaoColor(fonte.conversao_curso)}`}>
                              {fonte.conversao_curso}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Conversão Mentoria:</span>
                            <span className={`font-semibold ${getConversaoColor(fonte.conversao_mentoria)}`}>
                              {fonte.conversao_mentoria}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Segmentos Estratégicos - PREVISÕES */}
          <TabsContent value="segmentos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Previsão de Segmentos por Potencial de Conversão
                </CardTitle>
                <CardDescription>Distribuição prevista de {formatNumber(previsoesCHT.cenario_conservador.total_leads)} leads por profissão</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previsoesCHT.segmentos_previstos.map((segmento, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-indigo-600">{formatNumber(segmento.leads_previstos)}</div>
                            <div className="text-sm text-gray-600">{segmento.percentual}%</div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg flex items-center gap-2">
                              {segmento.profissao}
                              {segmento.prioridade === 'CRÍTICA' && <Crown className="h-4 w-4 text-yellow-500" />}
                            </h4>
                            <p className="text-sm text-gray-600">LTV Previsto: {formatCurrency(segmento.ltv)} | Meta histórica</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`mb-2 ${getPrioridadeColor(segmento.prioridade)}`}>
                            {segmento.prioridade}
                          </Badge>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Curso:</span>
                              <span className={`font-semibold ${getConversaoColor(segmento.conversao_curso)}`}>
                                {segmento.conversao_curso}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Mentoria:</span>
                              <span className={`font-semibold ${getConversaoColor(segmento.conversao_mentoria)}`}>
                                {segmento.conversao_mentoria}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Análise Regional - PREVISÕES */}
          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Previsão de Distribuição Regional
                </CardTitle>
                <CardDescription>Distribuição prevista de {formatNumber(previsoesCHT.cenario_conservador.total_leads)} leads por estado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { estado: "SP", leads_previstos: 2970, percentual: 27, profissoes: "Médico, Dentista, Fisioterapeuta" },
                    { estado: "RJ", leads_previstos: 2200, percentual: 20, profissoes: "Médico, Dentista, Psicólogo" },
                    { estado: "MG", leads_previstos: 1650, percentual: 15, profissoes: "Médico, Fisioterapeuta" },
                    { estado: "RS", leads_previstos: 1100, percentual: 10, profissoes: "Médico, Dentista" },
                    { estado: "PR", leads_previstos: 880, percentual: 8, profissoes: "Dentista, Nutricionista" },
                    { estado: "SC", leads_previstos: 770, percentual: 7, profissoes: "Médico, Fisioterapeuta" },
                    { estado: "BA", leads_previstos: 660, percentual: 6, profissoes: "Médico, Psicólogo" },
                    { estado: "GO", leads_previstos: 550, percentual: 5, profissoes: "Médico, Dentista" },
                    { estado: "DF", leads_previstos: 220, percentual: 2, profissoes: "Médico, Nutricionista" }
                  ].map((estado, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xl font-bold text-indigo-600">{estado.estado}</h4>
                        <span className="text-sm text-gray-600">{estado.percentual}%</span>
                      </div>
                      <div className="mb-2">
                        <span className="text-lg font-semibold">Previsão: {formatNumber(estado.leads_previstos)} leads</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Profissões Principais:</span>
                        <p className="text-sm text-gray-600">{estado.profissoes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Insights de IA - PREVISÕES */}
          <TabsContent value="insights" className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Timer className="h-4 w-4" />
              <AlertTitle className="text-blue-800">⏰ PRÉ-LANÇAMENTO - INÍCIO EM {previsoesCHT.dias_para_inicio} DIAS</AlertTitle>
              <AlertDescription className="mt-2 text-blue-700">
                <p className="mb-2">Lançamento inicia em 25/08/2025. Dashboard configurado com projeção realista baseada em dados históricos de lançamentos similares.</p>
                <p><span className="font-semibold">💡 Ação Recomendada:</span> Finalizar preparativos de campanhas. Meta: {formatNumber(previsoesCHT.cenario_conservador.total_leads)} leads em 28 dias.</p>
              </AlertDescription>
            </Alert>

            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle className="text-green-800">
                ✅ PROJEÇÃO REALISTA - DUPLA MONETIZAÇÃO 
                <Badge className="ml-2 bg-green-500 text-white">ESTRATÉGICO</Badge>
              </AlertTitle>
              <AlertDescription className="mt-2 text-green-700">
                <p className="mb-2">Curso ({formatCurrency(previsoesCHT.cenario_conservador.receita_curso)}) + Mentoria ({formatCurrency(previsoesCHT.cenario_conservador.receita_mentoria)}) = {formatCurrency(previsoesCHT.cenario_conservador.receita_bruta)} bruto. ROAS: {previsoesCHT.cenario_conservador.roas.toFixed(2)}.</p>
                <p><span className="font-semibold">💡 Ação Recomendada:</span> Focar em médicos (50% dos leads) e YouTube (35% orgânico). Preparar funil de upsell para mentoria.</p>
              </AlertDescription>
            </Alert>

            <Alert className="bg-purple-50 border-purple-200">
              <Target className="h-4 w-4" />
              <AlertTitle className="text-purple-800">
                🎯 META AMBICIOSA - POTENCIAL DE CRESCIMENTO 
                <Badge className="ml-2 bg-purple-500 text-white">OTIMISTA</Badge>
              </AlertTitle>
              <AlertDescription className="mt-2 text-purple-700">
                <p className="mb-2">Com otimização: {formatNumber(previsoesCHT.cenario_realista.total_leads)} leads e melhor conversão = {formatCurrency(previsoesCHT.cenario_realista.receita_bruta)} bruto. ROAS: {previsoesCHT.cenario_realista.roas.toFixed(2)}.</p>
                <p><span className="font-semibold">💡 Ação Recomendada:</span> Intensificar conteúdo orgânico. Campanhas segmentadas para especialistas médicos premium.</p>
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Insights Estratégicos Pré-Lançamento</CardTitle>
                <CardDescription>Recomendações baseadas em projeção realista dos resultados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">🎯 Dupla Monetização</h4>
                    <p className="text-green-700 text-sm">
                      Curso ({formatPercentage(previsoesCHT.cenario_conservador.taxa_conversao_curso)}) + Mentoria ({formatPercentage(previsoesCHT.cenario_conservador.taxa_conversao_mentoria)} dos compradores) 
                      maximiza receita por lead. Foco em qualidade do funil.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">👨‍⚕️ Segmentação Premium</h4>
                    <p className="text-blue-700 text-sm">
                      Médicos (50% dos leads) têm maior LTV. Criar campanhas específicas destacando 
                      casos de consultórios que faturam R$ 100k+/mês com pacientes premium.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">📈 Otimização de CAC</h4>
                    <p className="text-purple-700 text-sm">
                      CPL de R$ {previsoesCHT.cenario_conservador.cpl_medio} permite ROAS de {previsoesCHT.cenario_conservador.roas.toFixed(2)}. 
                      YouTube orgânico (35%) reduz CAC médio e aumenta margem.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Projeções do Resultado - DADOS REAIS DA PLANILHA */}
          <TabsContent value="projecoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Projeção Realista dos Resultados</CardTitle>
                <CardDescription className="text-center">Baseado em dados históricos de lançamentos similares - Lançamento: 25/08/2025</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Indicadores Principais - Cenário Conservador
                </CardTitle>
                <CardDescription>
                  ⏰ Início em {previsoesCHT.dias_para_inicio} dias. Dados reais serão atualizados na terça-feira (26/08)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Indicador</th>
                        <th className="text-center p-3 text-blue-600">Cenário Conservador</th>
                        <th className="text-center p-3 text-green-600">Projeção Realista</th>
                        <th className="text-center p-3">Diferença</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 font-medium">CPL médio (custo por lead)</td>
                        <td className="text-center p-3 font-bold">{formatCurrency(previsoesCHT.cenario_conservador.cpl_medio)}</td>
                        <td className="text-center p-3 font-bold text-green-600">{formatCurrency(previsoesCHT.cenario_realista.cpl_medio)}</td>
                        <td className="text-center p-3 text-green-600">-{formatCurrency(previsoesCHT.cenario_conservador.cpl_medio - previsoesCHT.cenario_realista.cpl_medio)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Total de Leads Captados</td>
                        <td className="text-center p-3 font-bold">{formatNumber(previsoesCHT.cenario_conservador.total_leads)}</td>
                        <td className="text-center p-3 font-bold text-green-600">{formatNumber(previsoesCHT.cenario_realista.total_leads)}</td>
                        <td className="text-center p-3 text-green-600">+{formatNumber(previsoesCHT.cenario_realista.total_leads - previsoesCHT.cenario_conservador.total_leads)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Taxa de Conversão (Curso)</td>
                        <td className="text-center p-3">{formatPercentage(previsoesCHT.cenario_conservador.taxa_conversao_curso)}</td>
                        <td className="text-center p-3 text-green-600 font-bold">{formatPercentage(previsoesCHT.cenario_realista.taxa_conversao_curso)}</td>
                        <td className="text-center p-3 text-green-600">+{formatPercentage(previsoesCHT.cenario_realista.taxa_conversao_curso - previsoesCHT.cenario_conservador.taxa_conversao_curso)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Vendas Curso (Ticket {formatCurrency(previsoesCHT.cenario_conservador.ticket_curso)})</td>
                        <td className="text-center p-3 font-bold">{Math.round(previsoesCHT.cenario_conservador.vendas_curso)}</td>
                        <td className="text-center p-3 font-bold text-green-600">{Math.round(previsoesCHT.cenario_realista.vendas_curso)}</td>
                        <td className="text-center p-3 text-green-600">+{Math.round(previsoesCHT.cenario_realista.vendas_curso - previsoesCHT.cenario_conservador.vendas_curso)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Receita Curso</td>
                        <td className="text-center p-3 font-bold">{formatCurrency(previsoesCHT.cenario_conservador.receita_curso)}</td>
                        <td className="text-center p-3 font-bold text-green-600">{formatCurrency(previsoesCHT.cenario_realista.receita_curso)}</td>
                        <td className="text-center p-3 text-green-600">+{formatCurrency(previsoesCHT.cenario_realista.receita_curso - previsoesCHT.cenario_conservador.receita_curso)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Taxa Conversão Mentoria</td>
                        <td className="text-center p-3">{formatPercentage(previsoesCHT.cenario_conservador.taxa_conversao_mentoria)}</td>
                        <td className="text-center p-3 text-green-600 font-bold">{formatPercentage(previsoesCHT.cenario_realista.taxa_conversao_mentoria)}</td>
                        <td className="text-center p-3 text-green-600">+{formatPercentage(previsoesCHT.cenario_realista.taxa_conversao_mentoria - previsoesCHT.cenario_conservador.taxa_conversao_mentoria)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Vendas Mentoria (Ticket {formatCurrency(previsoesCHT.cenario_conservador.ticket_mentoria)})</td>
                        <td className="text-center p-3 font-bold">{Math.round(previsoesCHT.cenario_conservador.vendas_mentoria)}</td>
                        <td className="text-center p-3 font-bold text-green-600">{Math.round(previsoesCHT.cenario_realista.vendas_mentoria)}</td>
                        <td className="text-center p-3 text-green-600">+{Math.round(previsoesCHT.cenario_realista.vendas_mentoria - previsoesCHT.cenario_conservador.vendas_mentoria)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Receita Mentoria</td>
                        <td className="text-center p-3 font-bold">{formatCurrency(previsoesCHT.cenario_conservador.receita_mentoria)}</td>
                        <td className="text-center p-3 font-bold text-green-600">{formatCurrency(previsoesCHT.cenario_realista.receita_mentoria)}</td>
                        <td className="text-center p-3 text-green-600">+{formatCurrency(previsoesCHT.cenario_realista.receita_mentoria - previsoesCHT.cenario_conservador.receita_mentoria)}</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="p-3 font-bold">Receita Bruta</td>
                        <td className="text-center p-3 font-bold text-blue-600">{formatCurrency(previsoesCHT.cenario_conservador.receita_bruta)}</td>
                        <td className="text-center p-3 font-bold text-green-600">{formatCurrency(previsoesCHT.cenario_realista.receita_bruta)}</td>
                        <td className="text-center p-3 font-bold text-green-600">+{formatCurrency(previsoesCHT.cenario_realista.receita_bruta - previsoesCHT.cenario_conservador.receita_bruta)}</td>
                      </tr>
                      <tr className="bg-red-50">
                        <td className="p-3 font-bold">Custo Tráfego</td>
                        <td className="text-center p-3 font-bold text-red-600">{formatCurrency(previsoesCHT.cenario_conservador.custo_trafego)}</td>
                        <td className="text-center p-3 font-bold text-red-600">{formatCurrency(previsoesCHT.cenario_realista.custo_trafego)}</td>
                        <td className="text-center p-3 font-bold text-orange-600">+{formatCurrency(previsoesCHT.cenario_realista.custo_trafego - previsoesCHT.cenario_conservador.custo_trafego)}</td>
                      </tr>
                      <tr className="bg-green-50">
                        <td className="p-3 font-bold">Receita Líquida</td>
                        <td className="text-center p-3 font-bold text-green-600">{formatCurrency(previsoesCHT.cenario_conservador.receita_liquida)}</td>
                        <td className="text-center p-3 font-bold text-green-600">{formatCurrency(previsoesCHT.cenario_realista.receita_liquida)}</td>
                        <td className="text-center p-3 font-bold text-green-600">+{formatCurrency(previsoesCHT.cenario_realista.receita_liquida - previsoesCHT.cenario_conservador.receita_liquida)}</td>
                      </tr>
                      <tr className="bg-yellow-50">
                        <td className="p-3 font-bold">ROAS</td>
                        <td className="text-center p-3 font-bold text-blue-600">{previsoesCHT.cenario_conservador.roas.toFixed(2)}</td>
                        <td className="text-center p-3 font-bold text-green-600">{previsoesCHT.cenario_realista.roas.toFixed(2)}</td>
                        <td className="text-center p-3 font-bold text-green-600">+{(previsoesCHT.cenario_realista.roas - previsoesCHT.cenario_conservador.roas).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>URLs do Projeto</CardTitle>
                  <CardDescription>Links importantes do lançamento CHT</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Página de Inscrição</span>
                    <Button size="sm" asChild>
                      <a href={previsoesCHT.urls.inscricao} target="_blank" rel="noopener noreferrer">
                        Acessar
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Página de Vendas</span>
                    <Button size="sm" asChild>
                      <a href={previsoesCHT.urls.vendas} target="_blank" rel="noopener noreferrer">
                        Acessar
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumo Executivo</CardTitle>
                  <CardDescription>Principais métricas do lançamento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Período de Captação</span>
                    <span className="font-medium">{previsoesCHT.periodo_captacao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duração</span>
                    <span className="font-medium">{previsoesCHT.duracao_dias} dias</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Meta de Leads</span>
                    <span className="font-medium">{formatNumber(previsoesCHT.cenario_conservador.total_leads)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Receita Bruta Prevista</span>
                    <span className="font-medium text-green-600">{formatCurrency(previsoesCHT.cenario_conservador.receita_bruta)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ROAS Esperado</span>
                    <span className="font-medium text-blue-600">{previsoesCHT.cenario_conservador.roas.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Próxima Atualização</span>
                    <span className="font-medium text-blue-600">26/08/2025 (terça)</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 border-t pt-4">
          Dashboard CHT • Projeção Realista dos Resultados • Lançamento: 25/08/2025 • Atualização com dados reais: 26/08/2025
        </div>
      </div>
    </div>
  )
}

export default App

