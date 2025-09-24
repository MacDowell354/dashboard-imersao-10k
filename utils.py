# app.py — versão completa, pronta para colar

from __future__ import annotations

import os
from datetime import datetime
from typing import Any, Dict

from flask import Flask, render_template

# -----------------------------------------------------------------------------
# App
# -----------------------------------------------------------------------------
app = Flask(__name__)


# -----------------------------------------------------------------------------
# Filtros Jinja (corrigem "No filter named '...'" nos templates)
# -----------------------------------------------------------------------------
def _to_float(v: Any, default: float = 0.0) -> float:
    try:
        if v is None:
            return default
        return float(v)
    except Exception:
        return default


def _to_int(v: Any, default: int = 0) -> int:
    try:
        if v is None:
            return default
        return int(round(float(v)))
    except Exception:
        return default


def numero_ptbr(value: Any) -> str:
    """
    Formata número inteiro sem casas em pt-BR (separador milhar '.' e decimal ',').
    Ex.: 12345 -> '12.345'
    """
    n = _to_int(value, 0)
    s = f"{n:,.0f}"
    # trocar separadores (US -> BR)
    return s.replace(",", "X").replace(".", ",").replace("X", ".")


def moeda_ptbr(value: Any) -> str:
    """
    Formata moeda pt-BR com 'R$' e 2 casas.
    Ex.: 1234.5 -> 'R$ 1.234,50'
    """
    v = _to_float(value, 0.0)
    s = f"{v:,.2f}"
    s = s.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {s}"


def pct_br(value: Any, casas: int = 1) -> str:
    """
    Formata porcentagem pt-BR com N casas.
    Ex.: 12.345 -> '12,3%'
    """
    v = _to_float(value, 0.0)
    fmt = f"{{:.{casas}f}}"
    s = fmt.format(v).replace(".", ",")
    return f"{s}%"


# registra filtros
app.jinja_env.filters["numero_ptbr"] = numero_ptbr
app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr
app.jinja_env.filters["pct_br"] = pct_br

# expõe datetime para uso direto em template (resolve 'datetime is undefined')
app.jinja_env.globals.update(datetime=datetime)


# -----------------------------------------------------------------------------
# Carregamento de dados p/ Visão Geral
#  - Garante TODAS as chaves esperadas pelos templates
#  - Se você quiser ler da planilha, preencha aqui (mantendo as mesmas chaves)
# -----------------------------------------------------------------------------
def carregar_dados_visao_geral() -> Dict[str, Any]:
    """
    Retorna o contexto com todas as chaves usadas nos templates:
      - dados.roas_geral
      - dados.canais.{google,facebook,youtube,outros}.{investimento,cpl,roas,leads}
      - dados.profissoes.{psicologo,fisioterapeuta,nutricionista}.total e .canal
      - extras.percentual_cpl_formatado
      - extras.atualizado_em
    """
    # --------- valores padrão (não quebram se faltarem dados reais) ---------
    dados: Dict[str, Any] = {
        "roas_geral": 0.0,
        "canais": {
            "google":   {"investimento": 0.0, "cpl": 0.0, "roas": 0.0, "leads": 0},
            "facebook": {"investimento": 0.0, "cpl": 0.0, "roas": 0.0, "leads": 0},
            "youtube":  {"investimento": 0.0, "cpl": 0.0, "roas": 0.0, "leads": 0},
            "outros":   {"investimento": 0.0, "cpl": 0.0, "roas": 0.0, "leads": 0},
        },
        "profissoes": {
            "psicologo": {
                "total": 0,
                "canal": {"google": 0, "facebook": 0, "youtube": 0, "outros": 0},
            },
            "fisioterapeuta": {
                "total": 0,
                "canal": {"google": 0, "facebook": 0, "youtube": 0, "outros": 0},
            },
            "nutricionista": {
                "total": 0,
                "canal": {"google": 0, "facebook": 0, "youtube": 0, "outros": 0},
            },
        },
    }

    extras: Dict[str, Any] = {
        "percentual_cpl_formatado": pct_br(0.0, 1),
        "atualizado_em": datetime.now().strftime("%d/%m"),
    }

    # --------- (opcional) carregar planilha e preencher dados ---------
    # Se você quiser ler da planilha "Base de Dados Para o Dash IA CHT22 (1).xlsx",
    # implemente aqui a leitura e MANTENHA as mesmas chaves do dicionário acima.
    #
    # Exemplo (descomente se quiser usar pandas):
    #
    # try:
    #     import pandas as pd
    #     base_path = os.getenv("DASH_PLANILHA_PATH", "/mnt/data/Base de Dados Para o Dash IA CHT22 (1).xlsx")
    #     if os.path.exists(base_path):
    #         # Leia suas abas e calcule os agregados desejados...
    #         # Exemplo ilustrativo:
    #         # df = pd.read_excel(base_path, sheet_name="Visão Geral")
    #         # dados["roas_geral"] = float(df.loc[0, "ROAS_Geral"])
    #         # dados["canais"]["google"]["roas"] = float(df.loc[0, "ROAS_Google"])
    #         # ... e assim por diante.
    #         # Ao final, também pode atualizar 'extras':
    #         extras["atualizado_em"] = datetime.now().strftime("%d/%m")
    # except Exception as e:
    #     # Em caso de erro na planilha, mantemos os defaults para não quebrar o template
    #     print(f"[WARN] Falha ao ler planilha: {e}")

    # --------- retorno do contexto ---------
    return {"dados": dados, "extras": extras}


# -----------------------------------------------------------------------------
# Rotas
# -----------------------------------------------------------------------------
@app.route("/healthz")
def healthz():
    return "ok", 200


@app.route("/")
def visao_geral():
    # Usa visao_geral_atualizada.html -> inclui visao_geral.html
    return render_template("visao_geral_atualizada.html", **carregar_dados_visao_geral())


@app.route("/origem-conversao")
def origem_conversao():
    # Usa origem_conversao_atualizada.html -> inclui origem_conversao.html
    return render_template("origem_conversao_atualizada.html", **carregar_dados_visao_geral())


@app.route("/profissao-canal")
def profissao_canal():
    # Usa profissao_canal_atualizada.html -> inclui profissao_canal.html
    return render_template("profissao_canal_atualizada.html", **carregar_dados_visao_geral())


# -----------------------------------------------------------------------------
# Gunicorn entrypoint (Render)
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    # Para rodar localmente: python app.py
    port = int(os.getenv("PORT", "10000"))
    app.run(host="0.0.0.0", port=port, debug=True)
