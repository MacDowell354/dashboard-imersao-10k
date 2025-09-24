# app.py
from __future__ import annotations
import os
from datetime import datetime
from typing import Dict, Any
from flask import Flask, render_template, redirect, url_for, send_from_directory

app = Flask(__name__)

# ------------- Filtros Jinja (PT-BR) -------------
def _to_number(x, default=0.0):
    try:
        if x is None:
            return default
        if isinstance(x, (int, float)):
            return float(x)
        # vírgula decimal -> ponto
        return float(str(x).replace(".", "").replace(",", "."))
    except Exception:
        return default

def moeda_ptbr(valor) -> str:
    v = _to_number(valor, 0.0)
    s = f"{v:,.2f}"
    # “1,234,567.89” -> “1.234.567,89”
    s = s.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {s}"

def numero_ptbr(valor, casas: int = 0) -> str:
    v = _to_number(valor, 0.0)
    fmt = f"{{:,.{casas}f}}"
    s = fmt.format(v)
    return s.replace(",", "X").replace(".", ",").replace("X", ".")

app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr
app.jinja_env.filters["numero_ptbr"] = numero_ptbr

# Deixa datetime disponível no template (resolve 'datetime is undefined')
app.jinja_env.globals["datetime"] = datetime

# ------------- Helpers de dados -------------
CANAIS_PADRAO = ["google", "facebook", "instagram", "youtube", "tiktok", "outros"]

def _canal_zero() -> Dict[str, float]:
    return dict(investimento=0.0, cpl=0.0, roas=0.0, leads=0.0, vendas=0.0, receita=0.0)

def _profissao_zero() -> Dict[str, float]:
    return dict(total=0.0, pct=0.0)

def _extras_default() -> Dict[str, Any]:
    return dict(
        percentual_cpl_formatado="0%",
        observacao="",
    )

def _dados_base() -> Dict[str, Any]:
    # Estrutura mínima esperada pelos templates
    canais = {nome: _canal_zero() for nome in CANAIS_PADRAO}
    profs = {
        "psicologo": _profissao_zero(),
        "fisioterapeuta": _profissao_zero(),
        "nutricionista": _profissao_zero(),
        "medico": _profissao_zero(),
        "outros": _profissao_zero(),
    }
    return dict(
        roas_geral=0.0,
        investimento_total=0.0,
        receita_total=0.0,
        leads_total=0.0,
        vendas_total=0.0,
        canais=canais,
        profissoes=profs,
    )

# ------------- Loader de dados -------------
def carregar_dados_visao_geral() -> Dict[str, Any]:
    """
    Substitua este bloco de preenchimento por leitura real da planilha, se desejar.
    O importante é devolver o dicionário com as chaves esperadas.
    """
    dados = _dados_base()

    # >>> EXEMPLO: se quiser ler de variáveis de ambiente, coloque aqui.
    # Mantemos zeros para não quebrar o template quando faltar algo.
    # Exemplo de preenchimento opcional:
    # dados["roas_geral"] = 2.35
    # dados["canais"]["google"].update(dict(investimento=1000, cpl=12.34, roas=3.1, leads=81, vendas=12, receita=3100))

    # Calcula totais de forma segura (caso você tenha populado alguns canais)
    inv_total = sum(_to_number(dados["canais"][c]["investimento"]) for c in dados["canais"])
    leads_total = sum(_to_number(dados["canais"][c]["leads"]) for c in dados["canais"])
    vendas_total = sum(_to_number(dados["canais"][c]["vendas"]) for c in dados["canais"])
    receita_total = sum(_to_number(dados["canais"][c]["receita"]) for c in dados["canais"])

    dados["investimento_total"] = inv_total
    dados["leads_total"] = leads_total
    dados["vendas_total"] = vendas_total
    dados["receita_total"] = receita_total

    # ROAS geral (evita divisão por zero)
    if inv_total > 0:
        dados["roas_geral"] = receita_total / inv_total
    else:
        dados["roas_geral"] = 0.0

    # Extras usados pelos templates
    extras = _extras_default()
    # Ex.: percentual de variação do CPL (exiba “0%” por padrão)
    extras["percentual_cpl_formatado"] = "0%"

    # Contexto final entregue aos templates
    return dict(dados=dados, extras=extras)

# ------------- Rotas -------------
@app.route("/")
def visao_geral():
    return render_template("visao_geral_atualizada.html", **carregar_dados_visao_geral())

@app.route("/origem-conversao")
def origem_conversao():
    # Reaproveita mesma estrutura (seu template só precisa das chaves já presentes)
    return render_template("origem_conversao_atualizada.html", **carregar_dados_visao_geral())

@app.route("/profissao-canal")
def profissao_canal():
    # Reaproveita mesma estrutura (profissões já existem em dados.profissoes)
    return render_template("profissao_canal_atualizada.html", **carregar_dados_visao_geral())

# Alias /dashboard -> /
@app.route("/dashboard")
def dashboard_redirect():
    return redirect(url_for("visao_geral"), code=302)

# Favicon para evitar 404
@app.route("/favicon.ico")
def favicon():
    try:
        return send_from_directory("static", "favicon.ico", mimetype="image/x-icon")
    except Exception:
        # Se não existir, devolve 204 para evitar erro no log
        from flask import Response
        return Response(status=204)

# ------------- Execução local -------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", "10000"))
    app.run(host="0.0.0.0", port=port)
