# utils.py
from datetime import datetime, date
from math import isfinite

# -----------------------------
# Filtros Jinja (PT-BR)
# -----------------------------
def _to_float_ptbr(v):
    """
    Converte strings tipo '9.500', '1.234,56' em float.
    Aceita também números já numéricos. Retorna 0.0 em caso de erro.
    """
    if v is None:
        return 0.0
    try:
        if isinstance(v, (int, float)):
            return float(v)
        s = str(v).strip()
        # primeiro remove separador de milhar ".", depois troca "," por "."
        s = s.replace(".", "").replace(",", ".")
        return float(s)
    except Exception:
        return 0.0

def _to_int_ptbr(v):
    try:
        return int(round(_to_float_ptbr(v)))
    except Exception:
        return 0

def moeda_ptbr(v):
    f = _to_float_ptbr(v)
    return ("R$ {:,.2f}".format(f)).replace(",", "X").replace(".", ",").replace("X", ".")

def numero_ptbr(v):
    i = _to_int_ptbr(v)
    return ("{:,}".format(i)).replace(",", ".")

# -----------------------------
# Dados e cálculos
# -----------------------------
def get_dataframes(force_refresh: bool = False):
    """
    Ponto único para carregar dados (CSV, GSheet, DB...). 
    Mantemos stub seguro para não quebrar o app sem fonte de dados.
    """
    # TODO: plugar sua leitura real aqui (e cache, se quiser).
    # Ex.: ler CSVs e retornar dict de DataFrames.
    return {}

def _fmt_pct(v):
    try:
        f = float(v)
    except Exception:
        f = 0.0
    if not isfinite(f):
        f = 0.0
    return ("{:.1f}%".format(f)).replace(".", ",")

def last_sync_info():
    return datetime.now().strftime("%d/%m/%Y %H:%M:%S")

def compute_context(dfs: dict):
    """
    Cria os dicionários esperados pelos templates:
    - dados  (tudo que você acessa como {{ dados.* }})
    - extras (percentuais/mensagens já formatadas)
    Deixa tudo com valores seguros (zero/strings) se não houver dados.
    """
    # Exemplos de valores padrão para não explodir a UI:
    hoje = date.today()
    data_inicio = hoje.replace(day=1)
    data_fim = hoje

    dias = (data_fim - data_inicio).days + 1
    meta_cpl = 15.0
    meta_leads = 0  # ajuste quando tiver dados
    total_leads = 0
    investimento_total = 0.0
    orcamento_total = 0.0

    # CPL médio defensivo
    cpl_medio = (investimento_total / total_leads) if total_leads else 0.0
    roas_geral = 0.00

    # Conversão defensiva
    taxa_conv = 2.0  # %
    vendas_estimadas = int(round(total_leads * (taxa_conv / 100.0)))
    ticket_curso = 297.0
    ticket_mentoria = 1500.0
    pct_mentorias = 10  # % das vendas

    receita_curso = vendas_estimadas * ticket_curso * (1 - pct_mentorias/100.0)
    receita_mentoria = vendas_estimadas * ticket_mentoria * (pct_mentorias/100.0)

    # Monta estrutura exatamente como os templates usam (dicts acessáveis via ponto)
    dados = {
        "dias_campanha": dias,
        "data_inicio": data_inicio.strftime("%d/%m/%Y"),
        "data_fim": data_fim.strftime("%d/%m/%Y"),

        "investimento_total_formatado": moeda_ptbr(investimento_total),
        "orcamento_total_formatado": moeda_ptbr(orcamento_total),

        "meta_leads_formatado": numero_ptbr(meta_leads),
        "total_leads_formatado": numero_ptbr(total_leads),

        "meta_cpl_formatado": moeda_ptbr(meta_cpl),
        "cpl_medio_formatado": moeda_ptbr(cpl_medio),

        "roas_geral": roas_geral,

        "conversao": {
            "taxa_conversao": taxa_conv,
            "vendas_estimadas": numero_ptbr(vendas_estimadas),
            "ticket_medio_curso": ticket_curso,
            "ticket_medio_mentoria": ticket_mentoria,
            "percentual_mentorias": pct_mentorias,
            "receita_estimada_curso": receita_curso,
            "receita_estimada_mentoria": receita_mentoria,
        },

        "canais": {
            "facebook": {
                "percentual": 0,
                "roas": 0.0,
                "leads_formatado": numero_ptbr(0),
            },
            "youtube": {
                "cpl": 0.0,
                "roas": 0.0,
            },
            "instagram": {
                "leads_formatado": numero_ptbr(0),
                "percentual": 0,
            },
        },

        "engajamento": {
            "seguidores_instagram": 0,
            "taxa_crescimento_instagram": 0,
            "seguidores_youtube": 0,
            "taxa_crescimento_youtube": 0,
        },

        # metas auxiliares brutas (se quiser usar em extras):
        "meta_leads": meta_leads,
        "total_leads": total_leads,
        "meta_cpl": meta_cpl,
        "cpl_medio": cpl_medio,
        "investimento_total": investimento_total,
        "orcamento_total": orcamento_total,
    }

    # Extras calculados/formatados
    pct_orc = (investimento_total / orcamento_total * 100.0) if orcamento_total else 0.0
    pct_leads = (total_leads / meta_leads * 100.0) if meta_leads else 100.0
    pct_cpl = ((cpl_medio - meta_cpl) / meta_cpl * 100.0) if meta_cpl else 0.0

    extras = {
        "percentual_orcamento": pct_orc,
        "percentual_orcamento_formatado": _fmt_pct(pct_orc),
        "percentual_leads": pct_leads,
        "percentual_leads_formatado": _fmt_pct(pct_leads),
        "percentual_cpl": pct_cpl,
        "percentual_cpl_formatado": ("{:+.1f}%".format(pct_cpl)).replace(".", ","),
    }

    return dados, extras
