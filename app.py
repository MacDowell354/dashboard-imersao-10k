# app.py — contexto unificado + defaults completos para todas as abas

from __future__ import annotations

import os
from datetime import datetime
from decimal import Decimal, InvalidOperation
from copy import deepcopy

from flask import Flask, render_template, redirect, url_for

# === Imports do projeto ===
try:
    from utils import get_dataframes, last_sync_info  # type: ignore
except Exception:
    def get_dataframes():
        return {}

    def last_sync_info() -> str:
        return datetime.now().strftime("%d/%m/%Y %H:%M:%S")

# usar preparar_contexto(dfs) se existir
try:
    from utils import preparar_contexto as _build_ctx  # type: ignore
except Exception:
    _build_ctx = None


app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True


# ======== Filtros Jinja (pt-BR) ========
def _to_decimal(value) -> Decimal:
    if value is None:
        return Decimal("0")
    if isinstance(value, Decimal):
        return value
    if isinstance(value, str):
        s = value.strip()
        if s == "":
            return Decimal("0")
        if "." in s and "," in s:
            s = s.replace(".", "").replace(",", ".")
        elif "," in s:
            s = s.replace(",", ".")
        try:
            return Decimal(s)
        except InvalidOperation:
            return Decimal("0")
    try:
        return Decimal(str(value))
    except Exception:
        return Decimal("0")


def _fmt_ptbr(d: Decimal, places: int) -> str:
    q = Decimal("1").scaleb(-places) if places else Decimal("1")
    d = d.quantize(q)
    s = f"{d:,.{places}f}"
    return s.replace(",", "X").replace(".", ",").replace("X", ".")


def numero_ptbr(value) -> str:
    d = _to_decimal(value)
    places = 0 if d == d.to_integral() else 2
    return _fmt_ptbr(d, places)


def moeda_ptbr(value) -> str:
    d = _to_decimal(value)
    return f"R$ {_fmt_ptbr(d, 2)}"


app.jinja_env.filters["numero_ptbr"] = numero_ptbr
app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr


# ======== Defaults robustos para TODOS os templates ========
DEFAULT_DADOS = {
    "dias_campanha": 0,
    "data_inicio": "",
    "data_fim": "",
    # valores crus (numéricos) usados em contas nos templates
    "investimento_total": 0.0,
    # define 1.0 para evitar ZeroDivisionError em (investimento/orcamento)*100
    "orcamento_total": 1.0,
    "total_leads": 0,
    "meta_leads": 0,
    "meta_cpl": 0.0,
    "cpl_medio": 0.0,
    "roas_geral": 0.0,
    # versões já formatadas quando algum template usar *_formatado
    "investimento_total_formatado": "R$ 0,00",
    "orcamento_total_formatado": "R$ 0,00",
    "total_leads_formatado": "0",
    "meta_leads_formatado": "0",
    "meta_cpl_formatado": "R$ 0,00",
    "cpl_medio_formatado": "R$ 0,00",
    "conversao": {
        "taxa_conversao": 0.0,
        "vendas_estimadas": 0,
        "ticket_medio_curso": 0.0,
        "ticket_medio_mentoria": 0.0,
        "percentual_mentorias": 0.0,
        "receita_estimada_curso": 0.0,
        "receita_estimada_mentoria": 0.0,
    },
    "canais": {
        "facebook": {"percentual": 0.0, "roas": 0.0, "leads_formatado": "0"},
        "youtube": {"cpl": 0.0, "roas": 0.0},
        "instagram": {"leads_formatado": "0", "percentual": 0.0},
    },
    "engajamento": {
        "seguidores_instagram": 0,
        "taxa_crescimento_instagram": 0.0,
        "seguidores_youtube": 0,
        "taxa_crescimento_youtube": 0.0,
    },
    # usado em analise_regional_atualizada.html
    "regioes": {
        "sudeste": {"percentual": 0.0, "leads_formatado": "0", "roas": 0.0},
        "sul": {"percentual": 0.0, "leads_formatado": "0", "roas": 0.0},
        "nordeste": {"percentual": 0.0, "leads_formatado": "0", "roas": 0.0},
        "norte": {"percentual": 0.0, "leads_formatado": "0", "roas": 0.0},
        "centro_oeste": {"percentual": 0.0, "leads_formatado": "0", "roas": 0.0},
    },
}

DEFAULT_EXTRAS = {
    "percentual_orcamento": 0.0,
    "percentual_orcamento_formatado": "0,0%",
    "percentual_leads": 100.0,
    "percentual_leads_formatado": "100,0%",
    "percentual_cpl": 100.0,
    "percentual_cpl_formatado": "100,0%",
}


def _deep_merge(base: dict, override: dict) -> dict:
    out = deepcopy(base)
    for k, v in (override or {}).items():
        if isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = _deep_merge(out[k], v)
        else:
            out[k] = v
    return out


def _ensure_formats(dados: dict, extras: dict) -> tuple[dict, dict]:
    # Gera *_formatado se não veio
    if "investimento_total_formatado" not in dados:
        dados["investimento_total_formatado"] = moeda_ptbr(dados.get("investimento_total", 0))
    if "orcamento_total_formatado" not in dados:
        dados["orcamento_total_formatado"] = moeda_ptbr(dados.get("orcamento_total", 0))
    if "cpl_medio_formatado" not in dados:
        dados["cpl_medio_formatado"] = moeda_ptbr(dados.get("cpl_medio", 0))
    if "meta_cpl_formatado" not in dados:
        dados["meta_cpl_formatado"] = moeda_ptbr(dados.get("meta_cpl", 0))
    if "total_leads_formatado" not in dados:
        dados["total_leads_formatado"] = numero_ptbr(dados.get("total_leads", 0))
    if "meta_leads_formatado" not in dados:
        dados["meta_leads_formatado"] = numero_ptbr(dados.get("meta_leads", 0))

    # Percentual de orçamento (se faltar)
    if "percentual_orcamento_formatado" not in extras:
        inv = _to_decimal(dados.get("investimento_total", 0))
        orc = _to_decimal(dados.get("orcamento_total", 0))
        pct = (inv / orc * Decimal("100")) if orc != 0 else Decimal("0")
        extras["percentual_orcamento"] = float(pct)
        extras["percentual_orcamento_formatado"] = f"{_fmt_ptbr(pct, 1)}%"

    # Demais percentuais se só vier o número cru
    if "percentual_leads_formatado" not in extras:
        extras["percentual_leads_formatado"] = f"{_fmt_ptbr(_to_decimal(extras.get('percentual_leads', 0)), 1)}%"
    if "percentual_cpl_formatado" not in extras:
        extras["percentual_cpl_formatado"] = f"{_fmt_ptbr(_to_decimal(extras.get('percentual_cpl', 0)), 1)}%"

    return dados, extras


def _sanitize(obj):
    if obj is None or isinstance(obj, (str, int, float, bool)):
        return obj
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, dict):
        return {k: _sanitize(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return type(obj)(_sanitize(x) for x in obj)
    if hasattr(obj, "__dict__"):
        return {k: _sanitize(v) for k, v in vars(obj).items()}
    return str(obj)


# ======== Contexto compartilhado ========
def _ctx():
    dfs = get_dataframes()

    if callable(_build_ctx):
        try:
            dados_raw, extras_raw = _build_ctx(dfs)  # sua função pode devolver dicts
        except Exception:
            dados_raw, extras_raw = {}, {}
    else:
        dados_raw, extras_raw = {}, {}

    # deep-merge com defaults para garantir TODAS as chaves
    dados = _deep_merge(DEFAULT_DADOS, dados_raw if isinstance(dados_raw, dict) else {})
    extras = _deep_merge(DEFAULT_EXTRAS, extras_raw if isinstance(extras_raw, dict) else {})

    # garantir formatos e percentuais derivados
    dados, extras = _ensure_formats(dados, extras)

    # sanitizar para o Jinja
    dados = _sanitize(dados)
    extras = _sanitize(extras)

    return dict(dados=dados, extras=extras, timestamp=last_sync_info())


# ======== Rotas ========
@app.route("/")
def index():
    return redirect(url_for("visao_geral"))

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

@app.route("/health")
def health():
    return {"status": "ok", "ts": datetime.utcnow().isoformat()}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "10000"))
    app.run(host="0.0.0.0", port=port, debug=True)
