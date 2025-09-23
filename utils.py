# utils.py
from datetime import datetime, timedelta, timezone

# ============
# Filtros Jinja
# ============
def _to_float(v):
    try:
        if v is None:
            return 0.0
        if isinstance(v, (int, float)):
            return float(v)
        s = str(v).strip()
        # normaliza milhares/ponto e decimal/vírgula
        if s.count(".") > 1 and "," not in s:
            s = s.replace(".", "")
        s = s.replace(".", "").replace(",", ".")
        return float(s)
    except Exception:
        return 0.0

def moeda_ptbr(v):
    n = _to_float(v)
    s = f"{n:,.2f}"
    s = s.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {s}"

def numero_ptbr(v):
    try:
        n = int(_to_float(v))
    except Exception:
        n = 0
    s = f"{n:,}"
    return s.replace(",", ".")

# ============
# Dados / KPIs
# ============
def get_dataframes(force_refresh: bool = False):
    """
    Mantido simples (sem I/O) para estabilidade do deploy.
    Quando você ligar planilhas/CSVs, carregue aqui.
    """
    return {}

def _defaults():
    """Estrutura padrão para evitar UndefinedError nos templates."""
    dados = {
        "dias_campanha": 23,
        "data_inicio": "01/09/2025",
        "data_fim": "23/09/2025",

        "orcamento_total": 0.0,
        "orcamento_total_formatado": moeda_ptbr(0),

        "investimento_total": 0.0,
        "investimento_total_formatado": moeda_ptbr(0),

        "cpl_medio": 0.0,
        "cpl_medio_formatado": moeda_ptbr(0),
        "meta_cpl_formatado": moeda_ptbr(15),

        "total_leads": 0,
        "total_leads_formatado": numero_ptbr(0),
        "meta_leads": 0,
        "meta_leads_formatado": numero_ptbr(0),

        "roas_geral": 0.0,

        "engajamento": {
            "seguidores_instagram": 0,
            "seguidores_youtube": 0,
            "taxa_crescimento_instagram": 0,
            "taxa_crescimento_youtube": 0,
        },

        "conversao": {
            "taxa_conversao": 2.0,
            "vendas_estimadas": 0,
            "ticket_medio_curso": 297.0,
            "ticket_medio_curso_formatado": moeda_ptbr(297),
            "ticket_medio_mentoria": 1500.0,
            "ticket_medio_mentoria_formatado": moeda_ptbr(1500),
            "receita_estimada_curso": 0.0,
            "receita_estimada_mentoria": 0.0,
            "percentual_mentorias": 10,
        },

        "canais": {
            "facebook":  {"percentual": 0, "roas": 0.0, "leads_formatado": numero_ptbr(0), "cpl": 0.0},
            "youtube":   {"percentual": 0, "roas": 0.0, "leads_formatado": numero_ptbr(0), "cpl": 0.0},
            "instagram": {"percentual": 0, "roas": 0.0, "leads_formatado": numero_ptbr(0), "cpl": 0.0},
            "google":    {"percentual": 0, "roas": 0.0, "leads_formatado": numero_ptbr(0), "cpl": 0.0},
        },

        "regioes": {
            "sudeste": {"percentual": 0},
            "sul": {"percentual": 0},
            "centro_oeste": {"percentual": 0},
            "nordeste": {"percentual": 0},
            "norte": {"percentual": 0},
        },

        "estados": {
            "SP": {"leads": 0, "percentual": 0},
            "RJ": {"leads": 0, "percentual": 0},
            "MG": {"leads": 0, "percentual": 0},
            "BA": {"leads": 0, "percentual": 0},
        },

        "profissoes": {
            "dentista": {"total": 0},
            "medico": {"total": 0},
            "advogado": {"total": 0},
            "engenheiro": {"total": 0},
        },
    }

    extras = {
        "percentual_orcamento": 0.0,
        "percentual_orcamento_formatado": "0,0%",
        "percentual_leads": 100.0,
        "percentual_leads_formatado": "100,0%",
        "percentual_cpl": 0.0,
        "percentual_cpl_formatado": "0,0%",
    }

    return dados, extras

def compute_kpis(dfs):
    """Cálculo simples e seguro dos KPIs (sem quebrar com dados vazios)."""
    dados, extras = _defaults()

    orc = _to_float(dados.get("orcamento_total", 0))
    inv = _to_float(dados.get("investimento_total", 0))
    leads = int(_to_float(dados.get("total_leads", 0)))
    meta_leads_raw = int(_to_float(dados.get("meta_leads", 0)))

    # % orçamento
    perc_orc = 0.0 if orc <= 0 else (inv / orc) * 100.0
    extras["percentual_orcamento"] = perc_orc
    extras["percentual_orcamento_formatado"] = f"{perc_orc:.1f}".replace(".", ",") + "%"

    # % leads vs meta (se meta==0, mostramos 100%)
    perc_leads = 100.0 if meta_leads_raw == 0 else (leads / max(meta_leads_raw, 1)) * 100.0
    extras["percentual_leads"] = perc_leads
    extras["percentual_leads_formatado"] = f"{perc_leads:.1f}".replace(".", ",") + "%"

    # % CPL vs meta
    cpl_atual = _to_float(dados.get("cpl_medio", 0))
    cpl_meta = 15.0
    perc_cpl = 0.0 if cpl_meta <= 0 else ((cpl_atual - cpl_meta) / cpl_meta) * 100.0
    extras["percentual_cpl"] = perc_cpl
    extras["percentual_cpl_formatado"] = f"{perc_cpl:.1f}".replace(".", ",") + "%"

    # Formatações
    dados["investimento_total_formatado"] = moeda_ptbr(inv)
    dados["orcamento_total_formatado"] = moeda_ptbr(orc)
    dados["total_leads_formatado"] = numero_ptbr(leads)
    dados["meta_leads_formatado"] = numero_ptbr(meta_leads_raw)
    dados["cpl_medio_formatado"] = moeda_ptbr(cpl_atual)
    dados["meta_cpl_formatado"] = moeda_ptbr(cpl_meta)

    return dados, extras

def last_sync_info():
    tz = timezone(timedelta(hours=-3))  # Brasília
    return datetime.now(tz).strftime("%d/%m/%Y %H:%M:%S")
