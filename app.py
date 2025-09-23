# app.py  — versão unificada com contexto compartilhado e filtros Jinja

from __future__ import annotations

import os
from datetime import datetime
from decimal import Decimal, InvalidOperation

from flask import Flask, render_template, redirect, url_for, request

# ---- Imports do seu projeto
# get_dataframes: carrega e/ou cacheia os dataframes
# last_sync_info: string de "última atualização" que você já usa
try:
    from utils import get_dataframes, last_sync_info  # type: ignore
except Exception:
    # Fallbacks mínimos se utils ainda não estiver pronto ao importar
    def get_dataframes():
        return {}

    def last_sync_info() -> str:
        return datetime.now().strftime("%d/%m/%Y %H:%M:%S")


# Se existir, usamos sua função de preparo
try:
    from utils import preparar_contexto as _build_ctx  # type: ignore
except Exception:
    _build_ctx = None


# -----------------------------------------------------------------------------
# App
# -----------------------------------------------------------------------------
app = Flask(__name__)
app.config["TEMPLATES_AUTO_RELOAD"] = True


# -----------------------------------------------------------------------------
# Filtros Jinja (pt-BR)
# -----------------------------------------------------------------------------
def _to_decimal(value) -> Decimal:
    """Converte qualquer valor (int/float/str) para Decimal de forma robusta."""
    if value is None:
        return Decimal("0")
    if isinstance(value, Decimal):
        return value
    # strings no formato pt-BR e en-US
    if isinstance(value, str):
        s = value.strip()
        if s == "":
            return Decimal("0")
        # Se tem '.' e ',', assume '.' milhar e ',' decimal
        if "." in s and "," in s:
            s = s.replace(".", "").replace(",", ".")
        else:
            # Se tem só ',', assume vírgula como decimal
            if "," in s:
                s = s.replace(",", ".")
        try:
            return Decimal(s)
        except InvalidOperation:
            return Decimal("0")
    # números
    try:
        return Decimal(str(value))
    except Exception:
        return Decimal("0")


def _format_ptbr_number(d: Decimal, places: int = 0) -> str:
    """Formata número no padrão pt-BR com separador de milhar '.' e decimal ','."""
    q = Decimal("1") if places == 0 else Decimal("1").scaleb(-places)  # 10^-places
    d = d.quantize(q)
    # Usa formatação en-US com milhar ',' e decimal '.'
    s_en = f"{d:,.{places}f}"
    # Troca vírgula por 'X', ponto por vírgula, 'X' por ponto
    return s_en.replace(",", "X").replace(".", ",").replace("X", ".")


def numero_ptbr(value) -> str:
    """Ex.: 1234567 -> 1.234.567   |   1234,56 -> 1.234,56"""
    d = _to_decimal(value)
    places = 0 if d == d.to_integral() else 2
    return _format_ptbr_number(d, places=places)


def moeda_ptbr(value) -> str:
    """Ex.: 1234.5 -> R$ 1.234,50"""
    d = _to_decimal(value)
    return f"R$ {_format_ptbr_number(d, places=2)}"


# Registra filtros
app.jinja_env.filters["numero_ptbr"] = numero_ptbr
app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr


# -----------------------------------------------------------------------------
# Contexto padrão (compartilhado por todas as abas)
# -----------------------------------------------------------------------------
def _ctx():
    """
    Retorna o mesmo contexto que a Visão Geral usa: (dados, extras, timestamp).
    - Se existir utils.preparar_contexto(dfs), usamos.
    - Se não existir, usamos um fallback seguro (pelo menos a página carrega).
    """
    # IMPORTANTÍSSIMO: não passar force_refresh aqui (sua função não aceita)
    dfs = get_dataframes()

    if callable(_build_ctx):
        try:
            dados, extras = _build_ctx(dfs)  # sua função deve devolver (dados, extras)
        except Exception:
            dados, extras = _fallback_context()
    else:
        dados, extras = _fallback_context()

    # Garante tipos simples (strings/nums) para evitar erro SafeNS/Markup
    dados = _sanitize_nested(dados)
    extras = _sanitize_nested(extras)

    return dict(dados=dados, extras=extras, timestamp=last_sync_info())


def _fallback_context():
    """Valores padrão para evitar 500 enquanto você ajusta a montagem real dos dados."""
    dados = {
        "dias_campanha": 0,
        "data_inicio": "",
        "data_fim": "",
        # Valores já formatados para templates que esperam *_formatado
        "meta_leads_formatado": "0",
        "total_leads_formatado": "0",
        "meta_cpl_formatado": "R$ 0,00",
        "cpl_medio_formatado": "R$ 0,00",
        "orcamento_total_formatado": "R$ 0,00",
        "investimento_total_formatado": "R$ 0,00",
        "roas_geral": 0,
        "conversao": {
            "taxa_conversao": 0,
            "vendas_estimadas": 0,
            "ticket_medio_curso": 0,
            "ticket_medio_mentoria": 0,
            "percentual_mentorias": 0,
            "receita_estimada_curso": 0,
            "receita_estimada_mentoria": 0,
        },
        "canais": {
            "facebook": {"percentual": 0, "roas": 0, "leads_formatado": "0"},
            "youtube": {"cpl": 0, "roas": 0},
            "instagram": {"leads_formatado": "0", "percentual": 0},
        },
        "engajamento": {
            "seguidores_instagram": 0,
            "taxa_crescimento_instagram": 0,
            "seguidores_youtube": 0,
            "taxa_crescimento_youtube": 0,
        },
    }
    extras = {
        "percentual_orcamento": 0,
        "percentual_orcamento_formatado": "0,0%",
        "percentual_leads": 100,
        "percentual_leads_formatado": "100,0%",
        "percentual_cpl": 100,
        "percentual_cpl_formatado": "100,0%",
    }
    return dados, extras


def _sanitize_nested(obj):
    """
    Converte estruturas potencialmente 'esquisitas' (p.ex. objetos pandas/Namespace)
    em dicts/listas/strings/nums simples para o Jinja não tropeçar.
    """
    if obj is None:
        return None
    if isinstance(obj, (str, int, float, bool)):
        return obj
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, dict):
        return {k: _sanitize_nested(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return type(obj)(_sanitize_nested(x) for x in obj)
    # Tenta converter objetos com __dict__ (p.ex. SimpleNamespace)
    if hasattr(obj, "__dict__"):
        return {k: _sanitize_nested(v) for k, v in vars(obj).items()}
    # Fallback final vira string
    return str(obj)


# -----------------------------------------------------------------------------
# Rotas
# -----------------------------------------------------------------------------
@app.route("/")
def index():
    # Redireciona para a Visão Geral (sua home)
    return redirect(url_for("visao_geral"))

# Visão Geral
@app.route("/visao-geral")
def visao_geral():
    return render_template("visao_geral_atualizada.html", **_ctx())

# Demais abas usando o MESMO contexto
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
    # wrapper que inclui o vendas_content.html
    return render_template("vendas.html", **_ctx())


# -----------------------------------------------------------------------------
# Healthcheck simples (opcional)
# -----------------------------------------------------------------------------
@app.route("/health")
def health():
    return {"status": "ok", "ts": datetime.utcnow().isoformat()}


# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    # Para rodar local: python app.py
    port = int(os.environ.get("PORT", "10000"))
    app.run(host="0.0.0.0", port=port, debug=True)
