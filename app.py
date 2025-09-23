# -*- coding: utf-8 -*-
from __future__ import annotations

from datetime import date, datetime
from calendar import monthrange

from flask import Flask, render_template, redirect, url_for, request

from utils import (
    get_dataframes,
    compute_kpis,
    last_sync_info,
    format_currency,
    format_number,
    format_percent,
    _to_float_safe,
)

app = Flask(__name__)

# ---------- Filtros Jinja ----------
@app.template_filter("moeda_ptbr")
def jinja_moeda_ptbr(v):
    return format_currency(v)

@app.template_filter("numero_ptbr")
def jinja_numero_ptbr(v):
    return format_number(v)

@app.template_filter("percentual_ptbr")
def jinja_percentual_ptbr(v):
    return format_percent(v, with_sign=False)

# ----------------------------- Rotas --------------------------------------
@app.route("/")
def home():
    return redirect(url_for("visao_geral"))

@app.route("/visao-geral", methods=["GET", "HEAD"])
def visao_geral():
    # HEAD do UptimeRobot: não renderiza template para evitar erros
    if request.method == "HEAD":
        return "", 200

    # suporta "?refresh=1" sem quebrar
    refresh_flag = str(request.args.get("refresh", "")).lower() in ("1", "true", "t", "yes", "y")
    dfs = get_dataframes(force_refresh=refresh_flag)
    kpis = compute_kpis(dfs)

    # Cabeçalho do período: 1º dia do mês até hoje
    hoje = date.today()
    inicio = hoje.replace(day=1)

    # Receita estimada simples: Investimento * ROAS (se vier no kpis)
    inv = _to_float_safe(kpis.get("investimento_total"))
    roas = _to_float_safe(kpis.get("roas"))
    receita_estim = inv * (roas if roas > 0 else 1.0)

    dados = {
        "data_inicio": inicio.strftime("%d/%m/%Y"),
        "data_fim": hoje.strftime("%d/%m/%Y"),
        "conversao": {"receita_estimada_curso": receita_estim},
    }

    # Percentual do mês transcorrido como proxy do orçamento
    dias_mes = monthrange(hoje.year, hoje.month)[1]
    dias_passados = (hoje - inicio).days + 1
    perc_mes = (dias_passados / dias_mes) if dias_mes else 0
    extras = {"percentual_orcamento_formatado": format_percent(perc_mes, with_sign=False)}

    return render_template(
        "visao_geral_atualizada.html",
        kpis=kpis,
        dados=dados,
        extras=extras,
        last_sync=last_sync_info(),
    )

@app.route("/healthz")
def healthz():
    return "ok", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=False)
