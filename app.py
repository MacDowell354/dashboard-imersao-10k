# app.py
from flask import Flask, render_template, request
import os, json, datetime as dt

app = Flask(__name__)

# --------- Filtros PT-BR ---------
@app.template_filter("numero_ptbr")
def numero_ptbr(value):
    try:
        n = float(value)
        return f"{n:,.0f}".replace(",", "X").replace(".", ",").replace("X", ".")
    except Exception:
        return "-"

@app.template_filter("moeda_ptbr")
def moeda_ptbr(value, casas=2):
    try:
        n = float(value)
        return ("R$ " + f"{n:,.%df}" % casas).replace(",", "X").replace(".", ",").replace("X", ".")
    except Exception:
        return "R$ 0,00"

# --------- Variáveis globais nos templates ---------
@app.context_processor
def inject_globals():
    # evita os erros 'current_path' e 'datetime' indefinidos
    return {"datetime": dt, "current_path": request.path}

# --------- Carregar dados da Visão Geral ---------
def carregar_dados_visao_geral():
    """
    Lê o arquivo data/dados_visao_geral.json e devolve {'dados': ...}
    Defina a env var DADOS_VISAO_GERAL_JSON se quiser apontar para outro caminho.
    """
    base_dir = os.path.dirname(__file__)
    default_path = os.path.join(base_dir, "data", "dados_visao_geral.json")
    json_path = os.environ.get("DADOS_VISAO_GERAL_JSON", default_path)

    if not os.path.exists(json_path):
        # fallback seguro para não quebrar o template
        dados = {
            "dias": 0,
            "periodo_inicio": None,
            "periodo_fim": None,
            "campanha_ativa": False,
            "total_leads": 0,
            "cpl_medio": 0.0,
            "meta_cpl": 0.0,
            "investimento_total": 0.0,
            "orcamento_total": 0.0,
            "roas_geral": 0.0,
            "seguidores_instagram": 0,
            "seguidores_youtube": 0,
            "taxa_conversao": 0.0,
            "ticket_curso": 0.0,
            "ticket_mentoria": 0.0,
            "pct_vendas_mentoria": 0.0,
            "vendas_estimadas": 0,
            "receita_curso": 0.0,
            "receita_mentoria": 0.0,
            "canais": {}
        }
        return {"dados": dados}

    with open(json_path, "r", encoding="utf-8") as f:
        return {"dados": json.load(f)}

# --------- Rotas ---------
@app.route("/")
@app.route("/visao-geral")
def visao_geral():
    return render_template("visao_geral_atualizada.html", **carregar_dados_visao_geral())

# Rota simples de healthcheck (opcional)
@app.route("/health")
def health():
    return {"status": "ok", "time": dt.datetime.utcnow().isoformat()}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
