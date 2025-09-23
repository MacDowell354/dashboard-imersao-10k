# app.py
from __future__ import annotations

from datetime import datetime
from flask import Flask, render_template, request

# Tenta usar utils reais; se algo faltar, não derruba o app.
try:
    from utils import get_dataframes, last_sync_info  # type: ignore
except Exception:
    def get_dataframes(*args, **kwargs):
        return {}
    def last_sync_info():
        return "n/d"

app = Flask(__name__)

# Disponibiliza datetime no Jinja: {{ datetime.now()... }}
app.jinja_env.globals["datetime"] = datetime

# ----------------- helpers de formatação -----------------
def moeda_ptbr(valor: float | int | None) -> str:
    try:
        v = float(valor or 0)
    except Exception:
        v = 0.0
    s = f"{v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {s}"

def numero_ptbr(valor: float | int | None) -> str:
    try:
        v = int(round(float(valor or 0)))
    except Exception:
        v = 0
    s = f"{v:,}".replace(",", ".")
    return s

def pct_ptbr(valor: float | int | None) -> str:
    try:
        v = float(valor or 0)
    except Exception:
        v = 0.0
    s = f"{v:.1f}".replace(".", ",")
    return f"{s}%"

def _ensure(d: dict, path: list[str], default):
    """Garante que d[path] exista; cria dicts intermediários."""
    cur = d
    for k in path[:-1]:
        if k not in cur or not isinstance(cur[k], dict):
            cur[k] = {}
        cur = cur[k]
    cur.setdefault(path[-1], default)
    return cur[path[-1]]

def _defaults(dados: dict) -> tuple[dict, dict]:
    """
    Preenche todas as chaves que os templates usam, com defaults.
    Mantém valores existentes.
    Retorna (dados, extras).
    """
    if not isinstance(dados, dict):
        dados = {}

    # --- metas & totais básicos ---
    _ensure(dados, ["meta_cpl"], 15.0)
    _ensure(dados, ["cpl_medio"], 0.0)
    _ensure(dados, ["total_leads"], 0)
    _ensure(dados, ["meta_leads"], dados.get("total_leads", 0))
    _ensure(dados, ["orcamento_total"], 0.0)
    _ensure(dados, ["investimento_total"], 0.0)
    _ensure(dados, ["roas_geral"], 0.0)

    # formatados
    dados["cpl_medio_formatado"] = moeda_ptbr(dados.get("cpl_medio"))
    dados["meta_cpl_formatado"] = moeda_ptbr(dados.get("meta_cpl"))
    dados["total_leads_formatado"] = numero_ptbr(dados.get("total_leads"))
    dados["meta_leads_formatado"] = numero_ptbr(dados.get("meta_leads"))
    dados["orcamento_total_formatado"] = moeda_ptbr(dados.get("orcamento_total"))
    dados["investimento_total_formatado"] = moeda_ptbr(dados.get("investimento_total"))

    # --- datas/período ---
    _ensure(dados, ["data_inicio"], "01/09/2025")
    _ensure(dados, ["data_fim"], "30/09/2025")
    _ensure(dados, ["dias_campanha"], 0)

    # --- conversão (sub-bloco) ---
    conv = _ensure(dados, ["conversao"], {})
    conv.setdefault("taxa_conversao", 2.0)
    conv.setdefault("vendas_estimadas", 0)
    conv.setdefault("receita_estimada_curso", 0.0)
    conv.setdefault("ticket_medio_curso", 297.0)
    conv.setdefault("percentual_mentorias", 10)
    conv.setdefault("ticket_medio_mentoria", 1500.0)
    conv.setdefault("receita_estimada_mentoria", 0.0)

    # --- canais usados nos templates ---
    canais = _ensure(dados, ["canais"], {})
    for canal in ("facebook", "instagram", "youtube", "google"):
        c = canais.setdefault(canal, {})
        c.setdefault("percentual", 0)
        c.setdefault("roas", 0.0)
        c.setdefault("cpl", 0.0)
        c.setdefault("leads", 0)
        c.setdefault("leads_formatado", numero_ptbr(c.get("leads", 0)))

    # --- engajamento (para cartões de seguidores) ---
    eng = _ensure(dados, ["engajamento"], {})
    eng.setdefault("seguidores_instagram", 0)
    eng.setdefault("taxa_crescimento_instagram", 0)
    eng.setdefault("seguidores_youtube", 0)
    eng.setdefault("taxa_crescimento_youtube", 0)

    # --- regiões/estados (para análise regional) ---
    regioes = _ensure(dados, ["regioes"], {})
    for r in ("sudeste", "sul", "nordeste", "norte", "centro_oeste"):
        rr = regioes.setdefault(r, {})
        rr.setdefault("percentual", 0)
        rr.setdefault("leads", 0)
    _ensure(dados, ["estados"], {})  # pode ficar vazio; o template só itera

    # --- profissoes (usadas em insights e profissão x canal) ---
    profs = _ensure(dados, ["profissoes"], {})
    for p in ("dentista", "medico", "advogado", "outra"):
        pp = profs.setdefault(p, {})
        pp.setdefault("total", 0)
        pp.setdefault("percentual", 0)

    # --- strings “formatado” que alguns templates exibem diretamente ---
    dados.setdefault("roas_geral", dados.get("roas_geral", 0.0))
    dados["roas_geral_formatado"] = f"{float(dados['roas_geral']):.2f}".replace(".", ",")

    # --- calcula extras (percentuais exibidos como texto) ---
    extras = {}
    inv = float(dados.get("investimento_total") or 0)
    orc = float(dados.get("orcamento_total") or 0)
    leads = int(dados.get("total_leads") or 0)
    meta_leads = int(dados.get("meta_leads") or 0)
    cpl = float(dados.get("cpl_medio") or 0)
    meta_cpl = float(dados.get("meta_cpl") or 0)

    # % orçamento usado
    extras["percentual_orcamento"] = (inv / orc * 100) if orc > 0 else 0.0
    extras["percentual_orcamento_formatado"] = pct_ptbr(extras["percentual_orcamento"]).replace(".0", "")

    # % de leads vs meta
    extras["percentual_leads"] = (leads / meta_leads * 100) if meta_leads > 0 else 100.0
    extras["percentual_leads_formatado"] = pct_ptbr(extras["percentual_leads"]).replace(".0", "")

    # % do CPL vs meta (quanto acima/abaixo)
    extras["percentual_cpl"] = ((cpl / meta_cpl * 100) if meta_cpl > 0 else 0.0) - 100.0
    # exemplo: +5,4% / –3,2%
    sinal = "+" if extras["percentual_cpl"] >= 0 else "–"
    extras["percentual_cpl_formatado"] = f"{sinal}{pct_ptbr(abs(extras['percentual_cpl'])).replace('%','%')}"

    # Também devolvemos os “formatado” que já existem nos templates
    dados.setdefault("orcamento_total_formatado", moeda_ptbr(orc))
    dados.setdefault("investimento_total_formatado", moeda_ptbr(inv))

    return dados, extras

def _ctx():
    """
    Monta o contexto único usado em TODAS as rotas.
    Mantém dados reais que vierem do utils e completa o resto com defaults.
    """
    # Se o utils devolver algo estruturado, ótimo; se não, seguimos com dict vazio.
    raw = get_dataframes() or {}
    # Permite tanto {'dados': {...}, 'extras': {...}} quanto já vir direto em {...}
    maybe_dados = raw.get("dados") if isinstance(raw, dict) else {}
    dados_in = maybe_dados if isinstance(maybe_dados, dict) else (raw if isinstance(raw, dict) else {})
    dados, extras = _defaults(dados_in)

    timestamp = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    sync = last_sync_info() if callable(last_sync_info) else "n/d"

    return dict(
        dados=dados,
        extras=extras,
        timestamp=timestamp,
        last_sync=sync,
    )

# ----------------- ROTAS -----------------
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
    # Seu template de vendas é um wrapper que inclui vendas_content.html
    return render_template("vendas.html", **_ctx())

# ----------------- WSGI -----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=True)
