# -*- coding: utf-8 -*-
import os
from datetime import datetime, date, timedelta

from flask import Flask, render_template, redirect, url_for

# Importa utilitários (NÃO importe app.py dentro de utils.py para evitar loop)
from utils import (
    get_dataframes,
    compute_kpis,
    compute_origem_conversao,
    compute_profissao_canal,
    compute_analise_regional,
    compute_insights_ia,
    compute_projecao_resultados,
    format_currency,
    format_number,
    format_percent,
    last_sync_info,
)

app = Flask(__name__)


# -----------------------------
# Filtros Jinja (pt-BR)
# -----------------------------
@app.template_filter("moeda_ptbr")
def moeda_ptbr(v):
    return format_currency(v)

@app.template_filter("numero_ptbr")
def numero_ptbr(v):
    return format_number(v)

@app.template_filter("percent_ptbr")
def percent_ptbr(v):
    # aceita 0.05 ou 5 (%)
    return format_percent(v, with_sign=False)


# -----------------------------
# Helpers de contexto
# -----------------------------
def _parse_currency_text_to_float(txt: str) -> float:
    """Converte 'R$ 12.345,67' -> 12345.67 de forma tolerante."""
    if not isinstance(txt, str):
        try:
            return float(txt)
        except Exception:
            return 0.0
    s = txt.strip().replace("R$", "").replace(" ", "")
    s = s.replace(".", "").replace(",", ".")
    try:
        return float(s)
    except Exception:
        return 0.0

def _parse_number_text_to_float(txt: str) -> float:
    """Converte '12.345' -> 12345 e '2,24' -> 2.24 (tolerante)."""
    if not isinstance(txt, str):
        try:
            return float(txt)
        except Exception:
            return 0.0
    s = txt.strip().replace(".", "").replace(",", ".")
    try:
        return float(s)
    except Exception:
        return 0.0

def build_dados_e_extras(kpis: dict) -> tuple[dict, dict]:
    """Gera os dicionários 'dados' e 'extras' esperados pelo template."""
    # Datas padrão: mês corrente
    hoje = date.today()
    inicio = hoje.replace(day=1)
    fim = hoje
    dias_campanha = (fim - inicio).days + 1

    # Receita estimada: investimento x ROAS (se existir)
    inv_float = _parse_currency_text_to_float(kpis.get("investimento_total", "R$ 0,00"))
    roas_float = _parse_number_text_to_float(kpis.get("roas", "1"))
    receita_estimada = inv_float * (roas_float if roas_float > 0 else 1.0)

    dados = {
        "data_inicio": inicio.strftime("%d/%m/%Y"),
        "data_fim": fim.strftime("%d/%m/%Y"),
        "dias_campanha": dias_campanha,
        "conversao": {
            "receita_estimada_curso": receita_estimada
        },
    }

    # Percentual de orçamento (se tiver métrica 'Orçamento' na planilha, calcule; senão, mostra "—")
    # Aqui deixamos só um placeholder seguro. Se você tiver o campo "Orçamento Total",
    # podemos somar e calcular invest/orc para popular de fato.
    extras = {
        "percentual_orcamento_formatado": "—"
    }

    return dados, extras


# -----------------------------
# Rotas
# -----------------------------
@app.route("/")
def home():
    return redirect(url_for("visao_geral"))

@app.route("/healthz")
def healthz():
    return {"status": "ok", "ts": datetime.utcnow().isoformat()}

@app.route("/visao-geral")
def visao_geral():
    dfs = get_dataframes()
    kpis = compute_kpis(dfs)
    dados, extras = build_dados_e_extras(kpis)
    return render_template(
        "visao_geral_atualizada.html",
        kpis=kpis,
        dados=dados,
        extras=extras,
        last_sync=last_sync_info(),
    )

@app.route("/origem")
def origem():
    dfs = get_dataframes()
    tabela, funil = compute_origem_conversao(dfs)
    kpis = compute_kpis(dfs)
    return render_template(
        "origem_conversao_canal.html",
        tabela=tabela,
        funil=funil,
        kpis=kpis,
        last_sync=last_sync_info(),
    )

@app.route("/profissao-canal")
def profissao_canal():
    dfs = get_dataframes()
    tabela = compute_profissao_canal(dfs)
    kpis = compute_kpis(dfs)
    return render_template(
        "profissao_canal.html",
        tabela=tabela,
        kpis=kpis,
        last_sync=last_sync_info(),
    )

@app.route("/analise-regional")
def analise_regional():
    dfs = get_dataframes()
    estados, regioes = compute_analise_regional(dfs)
    kpis = compute_kpis(dfs)
    return render_template(
        "analise_regional.html",
        estados=estados,
        regioes=regioes,
        kpis=kpis,
        last_sync=last_sync_info(),
    )

@app.route("/insights-ia")
def insights_ia():
    dfs = get_dataframes()
    insights = compute_insights_ia(dfs)
    kpis = compute_kpis(dfs)
    return render_template(
        "insights_ia.html",
        insights=insights,
        kpis=kpis,
        last_sync=last_sync_info(),
    )

@app.route("/projecao")
def projecao():
    dfs = get_dataframes()
    df_proj, premissas = compute_projecao_resultados(dfs)
    kpis = compute_kpis(dfs)
    return render_template(
        "projecao_resultados.html",
        proj=df_proj,
        premissas=premissas,
        kpis=kpis,
        last_sync=last_sync_info(),
    )


if __name__ == "__main__":
    # Para rodar localmente: python app.py
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "10000")), debug=True)
