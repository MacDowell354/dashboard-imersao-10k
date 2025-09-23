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

# ---------- Filtros Jinja (pt-BR) ----------
@app.template_filter("moeda_ptbr")
def jinja_moeda_ptbr(v): return format_currency(v)

@app.template_filter("numero_ptbr")
def jinja_numero_ptbr(v): return format_number(v)

@app.template_filter("percentual_ptbr")
def jinja_percentual_ptbr(v): return format_percent(v, with_sign=False)

# ---------- Montagem de contexto único para todas as páginas ----------
def _build_context(refresh_flag: bool = False):
    dfs = get_dataframes(force_refresh=refresh_flag)
    kpis = compute_kpis(dfs)

    hoje = date.today()
    inicio = hoje.replace(day=1)
    dias_mes = monthrange(hoje.year, hoje.month)[1]
    dias_passados = (hoje - inicio).days + 1
    frac_mes = (dias_passados / dias_mes) if dias_mes else 0.0

    leads_total = int(round(_to_float_safe(kpis.get("leads_total", 0))))
    investimento_total = _to_float_safe(kpis.get("investimento_total", 0.0))
    cpl_medio = _to_float_safe(kpis.get("cpl_medio", 0.0))
    cpl_meta = _to_float_safe(kpis.get("cpl_meta", 15.0))
    roas_geral = _to_float_safe(kpis.get("roas", 0.0))

    meta_leads = int(round(leads_total / frac_mes)) if frac_mes > 0 else leads_total
    perc_leads = (leads_total / meta_leads * 100.0) if meta_leads > 0 else 100.0
    orcamento_estimado = (investimento_total / frac_mes) if frac_mes > 0 else investimento_total

    # Premissas (ajuste se desejar)
    taxa_conv = 2.0        # %
    ticket_curso = 297.0
    perc_mentoria = 10.0   # %
    ticket_mentoria = 1500.0

    vendas_estimadas = int(round(leads_total * (taxa_conv / 100.0)))
    receita_curso = vendas_estimadas * ticket_curso
    receita_mentoria = vendas_estimadas * (perc_mentoria / 100.0) * ticket_mentoria

    dados = {
        "data_inicio": inicio.strftime("%d/%m/%Y"),
        "data_fim": hoje.strftime("%d/%m/%Y"),
        "dias_campanha": dias_passados,
        "roas_geral": roas_geral,
        "total_leads_formatado": format_number(leads_total),
        "meta_leads_formatado": format_number(meta_leads),
        "investimento_total_formatado": format_currency(investimento_total),
        "orcamento_total_formatado": format_currency(orcamento_estimado),
        "cpl_medio_formatado": format_currency(cpl_medio),
        "meta_cpl_formatado": format_currency(cpl_meta),
        "conversao": {
            "taxa_conversao": f"{taxa_conv:.1f}",
            "ticket_medio_curso": ticket_curso,
            "percentual_mentorias": f"{perc_mentoria:.0f}",
            "ticket_medio_mentoria": ticket_mentoria,
            "vendas_estimadas": format_number(vendas_estimadas),
            "receita_estimada_curso": receita_curso,
            "receita_estimada_mentoria": receita_mentoria,
        },
        # Placeholders seguros (edite quando tiver dados por canal)
        "canais": {
            "facebook": {"percentual": 0, "roas": 0.0, "leads_formatado": format_number(0)},
            "youtube": {"cpl": 0.0, "roas": 0.0},
            "instagram": {"leads_formatado": format_number(0), "percentual": 0},
        },
        "engajamento": {
            "seguidores_instagram": 0, "taxa_crescimento_instagram": 0,
            "seguidores_youtube": 0, "taxa_crescimento_youtube": 0
        },
    }

    extras = {
        "percentual_orcamento_formatado": format_percent(frac_mes, with_sign=False),
        "percentual_leads": perc_leads,
        "percentual_leads_formatado": format_percent(perc_leads, with_sign=False),
        "percentual_cpl_formatado": kpis.get("perc_cpl", "0%"),
    }

    return dict(
        kpis=kpis,
        dados=dados,
        extras=extras,
        timestamp=datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
        last_sync=last_sync_info(),
    )

# ---------- Rotas ----------
@app.route("/")
def home():
    return redirect(url_for("visao_geral"))

@app.route("/visao-geral", methods=["GET", "HEAD"])
def visao_geral():
    if request.method == "HEAD":
        return "", 200  # para UptimeRobot
    refresh_flag = str(request.args.get("refresh", "")).lower() in ("1","true","t","yes","y")
    ctx = _build_context(refresh_flag=refresh_flag)
    return render_template("visao_geral_atualizada.html", **ctx)

# Rota genérica para QUALQUER aba/template em templates/<page>.html
@app.route("/p/<page>", methods=["GET", "HEAD"])
def pagina(page: str):
    if request.method == "HEAD":
        return "", 200
    refresh_flag = str(request.args.get("refresh", "")).lower() in ("1","true","t","yes","y")
    ctx = _build_context(refresh_flag=refresh_flag)
    return render_template(f"{page}.html", **ctx)

@app.route("/healthz")
def healthz():
    return "ok", 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000, debug=False)
