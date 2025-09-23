from flask import Flask, render_template
from utils import get_dataframes, compute_kpis, last_sync_info

app = Flask(__name__)

# ---------------------------
# Filtros Jinja (PT-BR)
# ---------------------------
@app.template_filter("moeda_ptbr")
def moeda_ptbr(v):
    try:
        f = float(v or 0)
        s = f"{f:,.2f}"
        return "R$ " + s.replace(",", "X").replace(".", ",").replace("X", ".")
    except Exception:
        return "R$ 0,00"

@app.template_filter("numero_ptbr")
def numero_ptbr(v):
    try:
        n = int(round(float(v or 0)))
        return f"{n:,}".replace(",", ".")
    except Exception:
        return "0"

def _fmt_currency(v):
    try:
        f = float(v or 0)
        s = f"{f:,.2f}"
        return "R$ " + s.replace(",", "X").replace(".", ",").replace("X", ".")
    except Exception:
        return "R$ 0,00"

# ---------------------------
# Contexto unificado + defaults
# ---------------------------
def _ensure_defaults(d):
    if d is None:
        d = {}

    # Números-base
    d.setdefault("investimento_total", 0.0)
    d.setdefault("orcamento_total", 0.0)
    d.setdefault("dias_campanha", 0)
    d.setdefault("data_inicio", "")
    d.setdefault("data_fim", "")
    d.setdefault("roas_geral", 0.0)

    # Leads / metas
    d.setdefault("total_leads", d.get("total_leads") or 0)
    d.setdefault("meta_leads", d.get("meta_leads") or 0)
    d.setdefault("total_leads_formatado", f"{int(d['total_leads']):,}".replace(",", "."))
    d.setdefault("meta_leads_formatado", f"{int(d['meta_leads']):,}".replace(",", "."))

    # CPL / orçamento (numérico + formatado)
    d.setdefault("cpl_medio", d.get("cpl_medio") or 0.0)
    d.setdefault("meta_cpl", d.get("meta_cpl") or 0.0)
    d.setdefault("cpl_medio_formatado", _fmt_currency(d.get("cpl_medio")))
    d.setdefault("meta_cpl_formatado", _fmt_currency(d.get("meta_cpl")))
    d.setdefault("orcamento_total_formatado", _fmt_currency(d.get("orcamento_total")))
    d.setdefault("investimento_total_formatado", _fmt_currency(d.get("investimento_total")))

    # Conversão
    conv = d.setdefault("conversao", {})
    conv.setdefault("vendas_estimadas", 0)
    conv.setdefault("taxa_conversao", 2.0)
    conv.setdefault("receita_estimada_curso", 0.0)
    conv.setdefault("ticket_medio_curso", 297.0)
    conv.setdefault("receita_estimada_mentoria", 0.0)
    conv.setdefault("percentual_mentorias", 10)
    conv.setdefault("ticket_medio_mentoria", 1500.0)

    # Canais
    canais = d.setdefault("canais", {})
    for canal in ["facebook", "google", "youtube", "instagram", "tiktok", "organico", "email", "outros"]:
        c = canais.setdefault(canal, {})
        c.setdefault("percentual", 0)
        c.setdefault("roas", 0.0)
        c.setdefault("cpl", 0.0)
        c.setdefault("leads", 0)
        c.setdefault("leads_formatado", f"{int(c.get('leads', 0)):,}".replace(",", "."))

    # Engajamento
    eng = d.setdefault("engajamento", {})
    eng.setdefault("seguidores_instagram", 0)
    eng.setdefault("seguidores_youtube", 0)
    eng.setdefault("taxa_crescimento_instagram", 0)
    eng.setdefault("taxa_crescimento_youtube", 0)

    # Regiões / Estados / Profissões
    d.setdefault("regioes", {
        "sudeste": {"percentual": 0},
        "sul": {"percentual": 0},
        "centro_oeste": {"percentual": 0},
        "nordeste": {"percentual": 0},
        "norte": {"percentual": 0},
    })
    d.setdefault("estados", {})  # pode ficar vazio; o template itera sem erro

    profs = d.setdefault("profissoes", {})
    for p in ["dentista", "fisioterapeuta", "nutricionista", "educador_fisico", "medico", "psicologo", "outros"]:
        profs.setdefault(p, {"total": 0})

    return d

def _extras(d):
    orc = d.get("orcamento_total") or 0
    inv = d.get("investimento_total") or 0
    pct_orc = round(inv / orc * 100, 1) if orc else 0.0

    total = d.get("total_leads") or 0
    meta = d.get("meta_leads") or 0
    pct_leads = round(total / meta * 100, 1) if meta else 100.0

    meta_cpl = d.get("meta_cpl") or 0
    cpl = d.get("cpl_medio") or 0
    pct_cpl = round((cpl - meta_cpl) / meta_cpl * 100, 1) if meta_cpl else 0.0

    return {
        "percentual_orcamento_formatado": str(pct_orc).replace(".", ",") + "%",
        "percentual_leads": pct_leads,
        "percentual_leads_formatado": str(pct_leads).replace(".", ",") + "%",
        "percentual_cpl_formatado": (("+" if pct_cpl >= 0 else "") + str(pct_cpl).replace(".", ",") + "%"),
    }

def _ctx():
    base = {}
    try:
        dfs = get_dataframes()
        base = compute_kpis(dfs) or {}
    except Exception:
        base = {}

    # Se compute_kpis já retorna no formato {"dados": {...}}, aproveitamos; se não, usamos base direto.
    dados = base.get("dados", base) or {}
    dados = _ensure_defaults(dados)
    extras = _extras(dados)
    ts = last_sync_info() if callable(last_sync_info) else ""

    return {
        "dados": dados,
        "extras": extras,
        "kpis": base,
        "last_sync": ts,
        "timestamp": ts,
    }

# ---------------------------
# Rotas (todas usam o mesmo contexto)
# ---------------------------
@app.route("/")
def index():
    return render_template("visao_geral_atualizada.html", **_ctx())

@app.route("/visao-geral")
def visao_geral():
    return render_template("visao_geral_atualizada.html", **_ctx())

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard_atualizado.html", **_ctx())

@app.route("/origem-conversao")
def origem_conversao():
    return render_template("origem_conversao_atualizada.html", **_ctx())

@app.route("/profissao-canal")
def profissao_canal():
    return render_template("profissao_canal_atualizada.html", **_ctx())

@app.route("/projecao-resultados")
def projecao_resultados():
    return render_template("projecao_resultados_atualizada.html", **_ctx())

@app.route("/insights-ia")
def insights_ia():
    return render_template("insights_ia_atualizada.html", **_ctx())

@app.route("/analise-regional")
def analise_regional():
    return render_template("analise_regional_atualizada.html", **_ctx())

@app.route("/vendas")
def vendas():
    # Wrapper que inclui vendas_content.html
    return render_template("vendas.html", **_ctx())
