# app.py — versão consolidada com fallbacks p/ profissoes e estados
from __future__ import annotations

from copy import deepcopy
from datetime import datetime
from typing import Any, Dict
import math

from flask import Flask, render_template

# Tenta carregar funções reais; se não houver, seguimos com defaults
try:
    from utils import get_dataframes, compute_kpis  # type: ignore
except Exception:
    get_dataframes = None  # type: ignore
    compute_kpis = None  # type: ignore

app = Flask(__name__)

# =========================
# Filtros Jinja (formatação)
# =========================
def _to_number(val: Any) -> float:
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip()
    if not s:
        return 0.0
    s = s.replace(".", "").replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return 0.0

def moeda_ptbr(value: Any) -> str:
    n = _to_number(value)
    neg = n < 0
    n = abs(n)
    inteiro = int(math.floor(n))
    cent = int(round((n - inteiro) * 100))
    inteiro_fmt = f"{inteiro:,}".replace(",", ".")
    return f"{'-' if neg else ''}R$ {inteiro_fmt},{cent:02d}"

def numero_ptbr(value: Any) -> str:
    n = int(round(_to_number(value)))
    return f"{n:,}".replace(",", ".")

app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr
app.jinja_env.filters["numero_ptbr"] = numero_ptbr

# ==============================
# Helpers de dicionário dinâmico
# ==============================
class DefaultingDict(dict):
    """Dict que cria um valor padrão quando a chave não existe (para Jinja não quebrar)."""
    def __init__(self, default_factory, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._factory = default_factory
    def __missing__(self, key):
        value = self._factory()
        super().__setitem__(key, value)
        return value

def _default_profissao() -> Dict[str, Any]:
    return {
        "total": 0,
        "percentual": 0.0,
        "leads_formatado": "0",
        "cpl": 0.0,
        "roas": 0.0,
    }

# ==================================
# Defaults para não quebrar os HTMLs
# ==================================
DEFAULT_DADOS: Dict[str, Any] = {
    "dias_campanha": 0,
    "data_inicio": "01/09/2025",
    "data_fim": "23/09/2025",

    "total_leads": 0,
    "total_leads_formatado": "0",
    "meta_leads": 0,
    "meta_leads_formatado": "0",

    "cpl_medio": 0.0,
    "cpl_medio_formatado": "R$ 0,00",
    "meta_cpl": 15.0,
    "meta_cpl_formatado": "R$ 15,00",

    "orcamento_total": 0.0,                 # valor numérico usado em contas
    "orcamento_total_formatado": "R$ 0,00", # exibição
    "investimento_total": 0.0,
    "investimento_total_formatado": "R$ 0,00",

    "roas_geral": 0.0,

    "conversao": {
        "taxa_conversao": 2.0,
        "vendas_estimadas": 0,
        "ticket_medio_curso": 297.0,
        "receita_estimada_curso": 0.0,
        "percentual_mentorias": 10,
        "ticket_medio_mentoria": 1500.0,
        "receita_estimada_mentoria": 0.0,
    },

    "canais": {
        "facebook":  {"percentual": 0.0, "roas": 0.0, "leads_formatado": "0", "cpl": 0.0},
        "youtube":   {"percentual": 0.0, "roas": 0.0, "leads_formatado": "0", "cpl": 0.0},
        "instagram": {"percentual": 0.0, "roas": 0.0, "leads_formatado": "0", "cpl": 0.0},
        # usado em origem_conversao_atualizada.html
        "google":    {"percentual": 0.0, "roas": 0.0, "leads_formatado": "0", "cpl": 0.0},
    },

    "engajamento": {
        "seguidores_instagram": 0,
        "taxa_crescimento_instagram": 0,
        "seguidores_youtube": 0,
        "taxa_crescimento_youtube": 0,
    },

    # usado em analise_regional_atualizada.html (cards por região)
    "regioes": {
        "sudeste":      {"percentual": 0.0, "leads_formatado": "0"},
        "sul":          {"percentual": 0.0, "leads_formatado": "0"},
        "nordeste":     {"percentual": 0.0, "leads_formatado": "0"},
        "centro_oeste": {"percentual": 0.0, "leads_formatado": "0"},
        "norte":        {"percentual": 0.0, "leads_formatado": "0"},
    },

    # garante que o for ... in dados.estados.items() não quebre
    "estados": {},

    # usado em profissao_canal_atualizada.html
    "profissoes": {
        # colocamos algumas chaves comuns e o fallback cuidará do resto
        "dentista":       _default_profissao(),
        "medico":         _default_profissao(),
        "psicologo":      _default_profissao(),
        "nutricionista":  _default_profissao(),
        "fisioterapeuta": _default_profissao(),
        "advogado":       _default_profissao(),
        "enfermeiro":     _default_profissao(),
        "outros":         _default_profissao(),
    },
}

def _deep_update(base: Dict[str, Any], extra: Dict[str, Any]) -> Dict[str, Any]:
    out = deepcopy(base)
    for k, v in extra.items():
        if isinstance(v, dict) and isinstance(out.get(k), dict):
            out[k] = _deep_update(out[k], v)
        else:
            out[k] = v
    return out

def _pct(a: Any, b: Any, default_when_zero_b: float = 0.0) -> float:
    x = _to_number(a)
    y = _to_number(b)
    if y == 0:
        return default_when_zero_b
    return (x / y) * 100.0

def _fmt_pct(val: float) -> str:
    return f"{val:.1f}".replace(".", ",") + "%"

# ============================
# Contexto único para as views
# ============================
def _ctx() -> Dict[str, Any]:
    dados = deepcopy(DEFAULT_DADOS)

    dfs = None
    if callable(get_dataframes):
        try:
            dfs = get_dataframes()  # type: ignore
        except Exception:
            dfs = None

    kpis = {}
    if callable(compute_kpis) and dfs is not None:
        try:
            kpis = compute_kpis(dfs)  # type: ignore
        except Exception:
            kpis = {}

    if isinstance(kpis, dict) and kpis:
        chave_interessante = [
            "dias_campanha", "data_inicio", "data_fim",
            "total_leads", "total_leads_formatado",
            "meta_leads", "meta_leads_formatado",
            "cpl_medio", "cpl_medio_formatado",
            "meta_cpl", "meta_cpl_formatado",
            "orcamento_total", "orcamento_total_formatado",
            "investimento_total", "investimento_total_formatado",
            "roas_geral", "conversao", "canais", "engajamento", "regioes",
            "estados", "profissoes",
        ]
        dados = _deep_update(dados, {k: kpis[k] for k in chave_interessante if k in kpis})

    # ------------- Blindagens -------------
    # Evita divisão por zero nos templates
    if _to_number(dados.get("orcamento_total")) == 0:
        dados["orcamento_total"] = 1.0  # só para as contas internas

    # garante chaves de canais
    for canal in ("facebook", "youtube", "instagram", "google"):
        dados["canais"].setdefault(canal, {"percentual": 0.0, "roas": 0.0, "leads_formatado": "0", "cpl": 0.0})

    # garante estrutura de profissoes com fallback automático
    prof_map = dados.get("profissoes") or {}
    prof_dd = DefaultingDict(_default_profissao)
    if isinstance(prof_map, dict):
        prof_dd.update(prof_map)
    dados["profissoes"] = prof_dd

    # garante 'estados' existir (pode ser vazio, o for não quebra)
    if not isinstance(dados.get("estados"), dict):
        dados["estados"] = {}

    # --------- Extras derivados ---------
    extras: Dict[str, Any] = {}
    pct_orc = _pct(dados.get("investimento_total"), dados.get("orcamento_total"), 0.0)
    extras["percentual_orcamento"] = pct_orc
    extras["percentual_orcamento_formatado"] = _fmt_pct(pct_orc)

    meta_leads = _to_number(dados.get("meta_leads"))
    pct_leads = _pct(dados.get("total_leads"), meta_leads, 100.0 if meta_leads == 0 else 0.0)
    extras["percentual_leads"] = pct_leads
    extras["percentual_leads_formatado"] = _fmt_pct(pct_leads)

    meta_cpl = _to_number(dados.get("meta_cpl"))
    pct_cpl = _pct(dados.get("cpl_medio"), meta_cpl, 0.0)
    extras["percentual_cpl"] = pct_cpl
    extras["percentual_cpl_formatado"] = _fmt_pct(pct_cpl)

    timestamp = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

    return {"dados": dados, "extras": extras, "kpis": kpis, "timestamp": timestamp}

# ==========
# Rotas
# ==========
@app.route("/")
def home() -> str:
    return render_template("visao_geral_atualizada.html", **_ctx())

@app.route("/visao-geral")
def visao_geral() -> str:
    return render_template("visao_geral_atualizada.html", **_ctx())

@app.route("/dashboard")
def dashboard() -> str:
    return render_template("dashboard_atualizado.html", **_ctx())

@app.route("/insights-ia")
def insights_ia() -> str:
    return render_template("insights_ia_atualizada.html", **_ctx())

@app.route("/origem-conversao")
def origem_conversao() -> str:
    return render_template("origem_conversao_atualizada.html", **_ctx())

@app.route("/profissao-canal")
def profissao_canal() -> str:
    return render_template("profissao_canal_atualizada.html", **_ctx())

@app.route("/projecao-resultados")
def projecao_resultados() -> str:
    return render_template("projecao_resultados_atualizada.html", **_ctx())

@app.route("/analise-regional")
def analise_regional() -> str:
    return render_template("analise_regional_atualizada.html", **_ctx())

@app.route("/vendas")
def vendas() -> str:
    return render_template("vendas.html", **_ctx())

if __name__ == "__main__":  # pragma: no cover
    app.run(host="0.0.0.0", port=10000, debug=True)
