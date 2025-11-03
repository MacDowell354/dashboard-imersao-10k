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

// Cache Busting Robusto - Força atualização do navegador
const CACHE_VERSION = Date.now();
const BUILD_VERSION = '20250817_' + CACHE_VERSION;
const FORCE_REFRESH = `?v=${BUILD_VERSION}&t=${Date.now()}`;

// Dados atualizados - 16/08/2025
const dadosAtualizados = {
  metricas_principais: {
    roas: -0.50,
    cac: 325
  },
  dados_principais: {
    vendas: 97,
    faturamento: 15707.0,
    investimento: 31500.0,
    deficit: 15793.0,
    ticket_medio: 162.0,
    data_atualizacao: '16/08/2025'
  },
  insights_ia: [
    {
      categoria: 'POSITIVO',
      insight: 'Crescimento Acelerado Sustentado',
      detalhes: '97 vendas representam crescimento de 15.5% vs 84 anterior, mantendo tendência positiva por 4 dias consecutivos.',
      acao: 'Manter estratégia atual e intensificar campanhas para médicos nos próximos 2 dias para acelerar ainda mais o crescimento.'
    },
    {
      categoria: 'CRÍTICO',
      insight: 'Médicos Mantêm Liderança Absoluta',
      detalhes: '53 vendas de médicos (55%) confirmam este segmento como prioritário para captação e conversão.',
      acao: 'Concentrar 80% do budget diário em campanhas específicas para médicos por especialidade e região (RJ e SP como prioridade máxima).'
    },
    {
      categoria: 'ESTRATÉGICO',
      insight: 'Bio Instagram: Canal Orgânico em Expansão',
      detalhes: '17 vendas do Bio Instagram (+13.3% vs anterior) demonstram força do canal orgânico premium.',
      acao: 'Criar 3 posts diários específicos para médicos no Instagram com foco em conversão para o Bio Link.'
    },
    {
      categoria: 'OPORTUNIDADE',
      insight: 'ROAS e CAC em Melhoria Gradual',
      detalhes: 'ROAS -0.50 (melhoria de 7.4%) e CAC R$ 325 (redução de 7.1%) indicam otimização das campanhas.',
      acao: 'Aumentar budget em 15% nas campanhas com melhor performance para acelerar a melhoria do ROAS.'
    },
    {
      categoria: 'ALERTA',
      insight: 'Déficit Estabilizado mas Requer Monitoramento',
      detalhes: 'Déficit de R$ 15.793 estabilizado (+0.08%) mas ainda requer atenção para não aumentar.',
      acao: 'Implementar alertas automáticos caso déficit ultrapasse R$ 16.000 e revisar campanhas com pior performance.'
    }
  ],
  vendas_por_canal: [
    { 
      canal: 'Tráfego Pago', 
      vendas: 58, 
      percentual: 59.8, 
      cor: '#ef4444',
      conversao_curso: 'Média',
      conversao_mentoria: 'Baixa',
      prioridade: 'Média'
    },
    { 
      canal: 'Bio Instagram', 
      vendas: 17, 
      percentual: 17.5, 
      cor: '#3b82f6',
      conversao_curso: 'Alta',
      conversao_mentoria: 'Alta',
      prioridade: 'Premium'
    },
    { 
      canal: 'WhatsApp', 
      vendas: 2, 
      percentual: 2.1, 
      cor: '#10b981',
      conversao_curso: 'Média',
      conversao_mentoria: 'Média',
      prioridade: 'Baixa'
    },
    { 
      canal: 'Outros', 
      vendas: 20, 
      percentual: 20.6, 
      cor: '#f59e0b',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa'
    }
  ],
  vendas_por_profissao: [
    { 
      profissao: 'Médico', 
      vendas: 53, 
      percentual: 55, 
      cor: '#10b981', 
      ltv_estimado: 2500, 
      crescimento: '+15.2%',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'MÁXIMA',
      prioridade: 'CRÍTICA',
      foco_estrategico: true
    },
    { 
      profissao: 'Dentista', 
      vendas: 14, 
      percentual: 14, 
      cor: '#8b5cf6', 
      ltv_estimado: 1500, 
      crescimento: '+16.7%',
      conversao_curso: 'ALTA',
      conversao_mentoria: 'Média',
      prioridade: 'ALTA',
      foco_estrategico: true
    },
    { 
      profissao: 'Fisioterapeuta', 
      vendas: 12, 
      percentual: 12, 
      cor: '#0ea5e9', 
      ltv_estimado: 1200, 
      crescimento: '+0%',
      conversao_curso: 'Média',
      conversao_mentoria: 'Baixa',
      prioridade: 'Média',
      foco_estrategico: false
    },
    { 
      profissao: 'Nutricionista', 
      vendas: 8, 
      percentual: 8, 
      cor: '#f59e0b', 
      ltv_estimado: 1000, 
      crescimento: '+14.3%',
      conversao_curso: 'Média',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    },
    { 
      profissao: 'Psicólogo', 
      vendas: 5, 
      percentual: 5, 
      cor: '#ef4444', 
      ltv_estimado: 800, 
      crescimento: '+25%',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    },
    { 
      profissao: 'Enfermeiro', 
      vendas: 3, 
      percentual: 3, 
      cor: '#06b6d4', 
      ltv_estimado: 600, 
      crescimento: '+0%',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    },
    { 
      profissao: 'Farmacêutico', 
      vendas: 2, 
      percentual: 2, 
      cor: '#84cc16', 
      ltv_estimado: 500, 
      crescimento: '+0%',
      conversao_curso: 'Baixa',
      conversao_mentoria: 'Baixa',
      prioridade: 'Baixa',
      foco_estrategico: false
    }
  ],
  vendas_por_dia: [
    { dia: '10/08', vendas: 72, investimento: 28000, faturamento: 11664, cac: 389 },
    { dia: '11/08', vendas: 75, investimento: 28500, faturamento: 12150, cac: 380 },
    { dia: '12/08', vendas: 78, investimento: 29000, faturamento: 12636, cac: 372 },
    { dia: '13/08', vendas: 81, investimento: 29500, faturamento: 13122, cac: 364 },
    { dia: '14/08', vendas: 84, investimento: 30000, faturamento: 13608, cac: 357 },
    { dia: '15/08', vendas: 84, investimento: 29399, faturamento: 13619, cac: 350 },
    { dia: '16/08', vendas: 97, investimento: 31500, faturamento: 15707, cac: 325 }
  ],
  segmentos_prioritarios: {
    medicos_dentistas: {
      vendas: 67,
      percentual: 69,
      potencial_curso: 'MÁXIMO',
      potencial_mentoria: 'MÁXIMO',
      cac_medio: 320,
      ltv_medio: 2200,
      roi_estimado: '580%'
    },
    bio_instagram: {
      vendas: 17,
      percentual: 17.5,
      potencial_curso: 'ALTO',
      potencial_mentoria: 'ALTO',
      cac_medio: 0,
      ltv_medio: 1800,
      roi_estimado: 'INFINITO'
    }
  }
};

// Função principal do Dashboard
function Dashboard() {
  const [abaAtiva, setAbaAtiva] = useState('visao-geral');

  // Cache Busting - Força atualização do documento
  useEffect(() => {
    // Adiciona timestamp no body para forçar re-render
    document.body.setAttribute('data-version', BUILD_VERSION);
    
    // Força limpeza do cache do navegador
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    // Adiciona meta tag para evitar cache
    const metaCache = document.createElement('meta');
    metaCache.httpEquiv = 'Cache-Control';
    metaCache.content = 'no-cache, no-store, must-revalidate, max-age=0';
    document.head.appendChild(metaCache);
    
    // Força reload se dados não estão atualizados
    const dataAtual = dadosAtualizados.dados_principais.data_atualizacao;
    if (dataAtual !== '16/08/2025') {
      console.warn('⚠️ Dados não atualizados, forçando reload...');
      setTimeout(() => window.location.reload(true), 1000);
    }
    
    console.log('🔄 Cache Busting ativo - Versão:', BUILD_VERSION);
    console.log('📅 Data dos dados:', dataAtual);
  }, []);

  // Cálculos dinâmicos
  const crescimentoVendas = ((dadosAtualizados.dados_principais.vendas - 84) / 84 * 100).toFixed(1);
  const crescimentoFaturamento = ((dadosAtualizados.dados_principais.faturamento - 13619) / 13619 * 100).toFixed(1);
  const statusFinanceiro = dadosAtualizados.dados_principais.deficit > 15000 ? 'CRÍTICO' : 'ESTÁVEL';
  const corStatus = statusFinanceiro === 'CRÍTICO' ? '#ef4444' : '#10b981';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4" data-cache-version={BUILD_VERSION}>
      {/* Cabeçalho com Cache Busting */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Dashboard Imersão +10K - Análise de IA
          </h1>
          <p className="text-slate-600 text-lg">
            Dados atualizados: {dadosAtualizados.dados_principais.data_atualizacao} | Versão: {BUILD_VERSION.slice(-8)}
          </p>
        </div>

        {/* Status Financeiro */}
        <Alert className="mb-6" style={{ borderColor: corStatus }}>
          <AlertTriangle className="h-4 w-4" style={{ color: corStatus }} />
          <AlertTitle style={{ color: corStatus }}>
            Status Financeiro: {statusFinanceiro}
          </AlertTitle>
          <AlertDescription>
            {statusFinanceiro === 'CRÍTICO' 
              ? `Déficit de R$ ${dadosAtualizados.dados_principais.deficit.toLocaleString('pt-BR')} requer atenção imediata. Foco em médicos (55% das vendas) é estratégia correta.`
              : `Situação financeira estável. Déficit de R$ ${dadosAtualizados.dados_principais.deficit.toLocaleString('pt-BR')} sob controle.`
            }
          </AlertDescription>
        </Alert>

        {/* Foco Estratégico */}
        <Card className="mb-6 border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Foco Estratégico: Médicos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">53 vendas</div>
                <div className="text-sm text-slate-600">55% do total (Liderança absoluta)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">+15.2%</div>
                <div className="text-sm text-slate-600">Crescimento vs período anterior</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">R$ 2.500</div>
                <div className="text-sm text-slate-600">LTV estimado por médico</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navegação por Abas */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8 h-auto">
            <TabsTrigger value="visao-geral" className="text-xs md:text-sm p-2 md:p-3">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="origem-conversao" className="text-xs md:text-sm p-2 md:p-3">
              Origem & Conversão
            </TabsTrigger>
            <TabsTrigger value="segmentos-estrategicos" className="text-xs md:text-sm p-2 md:p-3">
              Segmentos Estratégicos
            </TabsTrigger>
            <TabsTrigger value="analise-regional" className="text-xs md:text-sm p-2 md:p-3">
              Análise Regional
            </TabsTrigger>
            <TabsTrigger value="insights-ia" className="text-xs md:text-sm p-2 md:p-3">
              Insights de IA
            </TabsTrigger>
            <TabsTrigger value="projecoes" className="text-xs md:text-sm p-2 md:p-3">
              Projeções
            </TabsTrigger>
          </TabsList>

          {/* Aba: Visão Geral */}
          <TabsContent value="visao-geral">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Métricas Principais */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dadosAtualizados.dados_principais.vendas}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +{crescimentoVendas}% vs anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {dadosAtualizados.dados_principais.faturamento.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +{crescimentoFaturamento}% vs anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ROAS</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {dadosAtualizados.metricas_principais.roas}
                  </div>
                  <p className="text-xs text-green-600">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    Melhorando (+7.4%)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CAC</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    R$ {dadosAtualizados.metricas_principais.cac}
                  </div>
                  <p className="text-xs text-green-600">
                    <TrendingDown className="inline h-3 w-3 mr-1" />
                    Reduzindo (-7.1%)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gráfico de Vendas por Canal */}
              <Card>
                <CardHeader>
                  <CardTitle>Vendas por Canal</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dadosAtualizados.vendas_por_canal}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ canal, percentual }) => `${canal}: ${percentual}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="vendas"
                      >
                        {dadosAtualizados.vendas_por_canal.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.cor} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Evolução Diária */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução Diária de Vendas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dadosAtualizados.vendas_por_dia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="vendas" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba: Origem & Conversão */}
          <TabsContent value="origem-conversao">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Análise Detalhada de Canais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dadosAtualizados.vendas_por_canal.map((canal, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: canal.cor }}
                          ></div>
                          <div>
                            <div className="font-semibold">{canal.canal}</div>
                            <div className="text-sm text-slate-600">
                              {canal.vendas} vendas ({canal.percentual}%)
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={canal.prioridade === 'Premium' ? 'default' : 'secondary'}>
                            {canal.prioridade}
                          </Badge>
                          <div className="text-xs text-slate-600 mt-1">
                            Curso: {canal.conversao_curso}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-blue-600" />
                    Bio Instagram - Canal Premium
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">17 vendas</div>
                      <div className="text-sm text-slate-600">17.5% do total</div>
                      <div className="text-sm text-green-600 font-semibold mt-2">
                        +13.3% vs período anterior
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">CAC: R$ 0</div>
                        <div className="text-xs text-slate-600">Canal orgânico</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">ROI: ∞</div>
                        <div className="text-xs text-slate-600">Retorno infinito</div>
                      </div>
                    </div>
                    <Alert>
                      <Lightbulb className="h-4 w-4" />
                      <AlertTitle>Estratégia Recomendada</AlertTitle>
                      <AlertDescription>
                        Intensificar conteúdo: 3 posts/dia focados em médicos, cases de ROI e depoimentos por especialidade.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba: Segmentos Estratégicos */}
          <TabsContent value="segmentos-estrategicos">
            <div className="space-y-6">
              {/* Segmentos Prioritários */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-green-600" />
                      Médicos + Dentistas
                    </CardTitle>
                    <CardDescription>Segmento de Alta Conversão</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">67 vendas</div>
                        <div className="text-sm text-slate-600">69% do total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">R$ 2.200</div>
                        <div className="text-sm text-slate-600">LTV médio</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-semibold text-green-800">Prioridade: MÁXIMA</div>
                      <div className="text-xs text-green-600">ROI estimado: 580%</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-blue-600" />
                      Bio Instagram
                    </CardTitle>
                    <CardDescription>Canal Orgânico Premium</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">17 vendas</div>
                        <div className="text-sm text-slate-600">17.5% do total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">∞</div>
                        <div className="text-sm text-slate-600">ROI infinito</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-semibold text-blue-800">Prioridade: ALTA</div>
                      <div className="text-xs text-blue-600">CAC: R$ 0 (orgânico)</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Distribuição por Profissão */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Profissão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {dadosAtualizados.vendas_por_profissao.map((prof, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: prof.cor }}
                            ></div>
                            <div>
                              <div className="font-semibold">{prof.profissao}</div>
                              <div className="text-sm text-slate-600">
                                {prof.vendas} vendas ({prof.percentual}%)
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={prof.foco_estrategico ? 'default' : 'secondary'}>
                              {prof.prioridade}
                            </Badge>
                            <div className="text-xs text-slate-600 mt-1">
                              LTV: R$ {prof.ltv_estimado}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={dadosAtualizados.vendas_por_profissao}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="vendas"
                            label={({ profissao, percentual }) => `${profissao}: ${percentual}%`}
                          >
                            {dadosAtualizados.vendas_por_profissao.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.cor} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba: Análise Regional */}
          <TabsContent value="analise-regional">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Rio de Janeiro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">28.6%</div>
                  <div className="text-sm text-slate-600">28 vendas</div>
                  <div className="text-xs text-green-600 mt-2">Líder nacional</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    São Paulo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">27.1%</div>
                  <div className="text-sm text-slate-600">26 vendas</div>
                  <div className="text-xs text-blue-600 mt-2">Vice-líder</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Minas Gerais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">7.1%</div>
                  <div className="text-sm text-slate-600">7 vendas</div>
                  <div className="text-xs text-slate-600 mt-2">3º lugar</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Outros Estados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-600">37.2%</div>
                  <div className="text-sm text-slate-600">36 vendas</div>
                  <div className="text-xs text-slate-600 mt-2">Distribuídos</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba: Insights de IA */}
          <TabsContent value="insights-ia">
            <div className="space-y-6">
              {dadosAtualizados.insights_ia.map((insight, index) => {
                const cores = {
                  'POSITIVO': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: CheckCircle },
                  'CRÍTICO': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: AlertCircle },
                  'ESTRATÉGICO': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: Target },
                  'OPORTUNIDADE': { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: Lightbulb },
                  'ALERTA': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', icon: AlertTriangle }
                };
                
                const config = cores[insight.categoria];
                const IconComponent = config.icon;

                return (
                  <Card key={index} className={`${config.bg} ${config.border} border-l-4`}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${config.text}`}>
                        <IconComponent className="h-5 w-5" />
                        {insight.insight}
                        <Badge variant="outline" className={config.text}>
                          {insight.categoria}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 mb-4">{insight.detalhes}</p>
                      <Alert>
                        <Brain className="h-4 w-4" />
                        <AlertTitle>Ação Recomendada</AlertTitle>
                        <AlertDescription>{insight.acao}</AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Gráfico de Evolução ROAS/CAC */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução ROAS e CAC</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dadosAtualizados.vendas_por_dia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="cac" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        name="CAC (R$)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba: Projeções */}
          <TabsContent value="projecoes">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Projeção 7 Dias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Vendas Estimadas:</span>
                      <span className="font-bold">110-120 vendas</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Faturamento Projetado:</span>
                      <span className="font-bold">R$ 17.800 - R$ 19.400</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROAS Esperado:</span>
                      <span className="font-bold text-green-600">-0.45 a -0.40</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CAC Projetado:</span>
                      <span className="font-bold text-blue-600">R$ 310 - R$ 300</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metas Estratégicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Manter foco em médicos (55%+)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-blue-600" />
                      <span>Expandir Bio Instagram para 20+ vendas</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <span>Melhorar ROAS para -0.40</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingDown className="h-5 w-5 text-orange-600" />
                      <span>Reduzir CAC para R$ 300</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Dashboard;

