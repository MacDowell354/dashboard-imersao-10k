# app.py
from __future__ import annotations

from datetime import datetime
from flask import Flask, render_template, request

# Tenta importar utilidades do projeto; se não existirem, usa stubs.
try:
    from utils import get_dataframes, last_sync_info  # type: ignore
except Exception:
    def get_dataframes(*args, **kwargs):
        return {}
    def last_sync_info():
        return "n/d"

app = Flask(__name__)

# ----------------- Filtros Jinja -----------------
def _moeda_ptbr(valor):
    try:
        v = float(valor or 0)
    except Exception:
        v = 0.0
    s = f"{v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {s}"

def _numero_ptbr(valor):
    try:
        v = int(round(float(valor or 0)))
    except Exception:
        v = 0
    return f"{v:,}".replace(",", ".")

def _pct_ptbr(valor):
    try:
        v = float(valor or 0)
    except Exception:
        v = 0.0
    return f"{v:.1f}".replace(".", ",") + "%"

app.add_template_filter(_moeda_ptbr, name="moeda_ptbr")
app.add_template_filter(_numero_ptbr, name="numero_ptbr")
app.add_template_filter(_pct_ptbr,    name="pct_ptbr")

# Globals nos templates
app.jinja_env.globals["datetime"] = datetime

# Para o _nav.html
@app.context_processor
def inject_current_path():
    try:
        cp = request.path or "/"
    except Exception:
        cp = "/"
    return dict(current_path=cp)

# ----------------- Helpers de contexto -----------------
def _ensure(d: dict, path: list[str], default):
    cur = d
    for k in path[:-1]:
        if k not in cur or not isinstance(cur[k], dict):
            cur[k] = {}
        cur = cur[k]
    cur.setdefault(path[-1], default)
    return cur[path[-1]]

def _defaults(dados_in: dict | None) -> tuple[dict, dict]:
    dados = dict(dados_in or {})

    # metas & totais
    _ensure(dados, ["meta_cpl"], 15.0)
    _ensure(dados, ["cpl_medio"], 0.0)
    _ensure(dados, ["total_leads"], 0)
    _ensure(dados, ["meta_leads"], max(1, int(dados.get("total_leads", 0)) or 1))
    _ensure(dados, ["orcamento_total"], 0.0)
    _ensure(dados, ["investimento_total"], 0.0)
    _ensure(dados, ["roas_geral"], 0.0)

    # datas
    _ensure(dados, ["data_inicio"], "01/09/2025")
    _ensure(dados, ["data_fim"], "30/09/2025")
    _ensure(dados, ["dias_campanha"], 0)

    # conversão
    conv = _ensure(dados, ["conversao"], {})
    conv.setdefault("taxa_conversao", 2.0)
    conv.setdefault("vendas_estimadas", 0)
    conv.setdefault("receita_estimada_curso", 0.0)
    conv.setdefault("ticket_medio_curso", 297.0)
    conv.setdefault("percentual_mentorias", 10)
    conv.setdefault("ticket_medio_mentoria", 1500.0)
    conv.setdefault("receita_estimada_mentoria", 0.0)

    # canais (inclui 'google'); **agora com investimento=0**
    canais = _ensure(dados, ["canais"], {})
    for canal in ("facebook", "instagram", "youtube", "google"):
        c = canais.setdefault(canal, {})
        c.setdefault("percentual", 0)
        c.setdefault("roas", 0.0)
        c.setdefault("cpl", 0.0)
        c.setdefault("leads", 0)
        c.setdefault("investimento", 0.0)  # <- CORREÇÃO QUE RESOLVE O ERRO DO LOG
        c.setdefault("leads_formatado", _numero_ptbr(c.get("leads", 0)))

    # engajamento
    eng = _ensure(dados, ["engajamento"], {})
    eng.setdefault("seguidores_instagram", 0)
    eng.setdefault("taxa_crescimento_instagram", 0)
    eng.setdefault("seguidores_youtube", 0)
    eng.setdefault("taxa_crescimento_youtube", 0)

    # regiões/estados
    regioes = _ensure(dados, ["regioes"], {})
    for r in ("sudeste", "sul", "nordeste", "norte", "centro_oeste"):
        rr = regioes.setdefault(r, {})
        rr.setdefault("percentual", 0)
        rr.setdefault("leads", 0)
    _ensure(dados, ["estados"], {})

    # profissoes (inclui 'outra' para evitar UndefinedError)
    profs = _ensure(dados, ["profissoes"], {})
    for p in ("dentista", "medico", "advogado", "outra"):
        pp = profs.setdefault(p, {})
        pp.setdefault("total", 0)
        pp.setdefault("percentual", 0)

    # formatados base
    dados["cpl_medio_formatado"] = _moeda_ptbr(dados.get("cpl_medio"))
    dados["meta_cpl_formatado"] = _moeda_ptbr(dados.get("meta_cpl"))
    dados["total_leads_formatado"] = _numero_ptbr(dados.get("total_leads"))
    dados["meta_leads_formatado"] = _numero_ptbr(dados.get("meta_leads"))
    dados["orcamento_total_formatado"] = _moeda_ptbr(dados.get("orcamento_total"))
    dados["investimento_total_formatado"] = _moeda_ptbr(dados.get("investimento_total"))
    dados["roas_geral_formatado"] = f"{float(dados.get('roas_geral', 0.0)):.2f}".replace(".", ",")

    # extras
    inv = float(dados.get("investimento_total") or 0)
    orc = float(dados.get("orcamento_total") or 0)
    leads = int(dados.get("total_leads") or 0)
    meta_leads = int(dados.get("meta_leads") or 1)
    cpl = float(dados.get("cpl_medio") or 0)
    meta_cpl = float(dados.get("meta_cpl") or 0)

    extras = {}
    extras["percentual_orcamento"] = (inv / orc * 100) if orc > 0 else 0.0
    extras["percentual_orcamento_formatado"] = _pct_ptbr(extras["percentual_orcamento"]).replace(".0", "")
    extras["percentual_leads"] = (leads / meta_leads * 100) if meta_leads > 0 else 100.0
    extras["percentual_leads_formatado"] = _pct_ptbr(extras["percentual_leads"]).replace(".0", "")
    extras["percentual_cpl"] = ((cpl / meta_cpl * 100) if meta_cpl > 0 else 0.0) - 100.0
    sinal = "+" if extras["percentual_cpl"] >= 0 else "–"
    extras["percentual_cpl_formatado"] = f"{sinal}{_pct_ptbr(abs(extras['percentual_cpl']))}"

    return dados, extras

def _ctx():
    raw = get_dataframes() or {}
    base = raw.get("dados") if isinstance(raw, dict) else raw
    base = base if isinstance(base, dict) else {}
    dados, extras = _defaults(base)
    return dict(
        dados=dados,
        extras=extras,
        timestamp=datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        last_sync=(last_sync_info() if callable(last_sync_info) else "n/d"),
    )

# ----------------- Rotas -----------------
@app.route("/")
def home():
    return render_template("visao_geral_atualizada.html", **_ctx())

@app.route("/visao-geral")
def visao_geral():
    return render_template("visao_geral_atualizada.html", **_ctx())

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard_atualizado.html", **_ctx())

@app.route("/insights-ia")
def insights_ia():
    return render_template("insights_ia_atualizada.html", **_ctx())

@app.route("/origem-conversao")
def origem_conversao():
    return render_template("origem_conversao_atualizada.html", **_ctx())

@app.route("/profissao-canal")
def profissao_canal():
    return render_template("profissao_canal_atualizada.html", **_ctx())

@app.route("/projecao-resultados")
def projecao_resultados():
    return render_template("projecao_resultados_atualizada.html", **_ctx())

@app.route("/analise-regional")
def analise_regional():
    return render_template("analise_regional_atualizada.html", **_ctx())

@app.route("/vendas")
def vendas():
    return render_template("vendas.html", **_ctx())

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
