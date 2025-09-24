# app.py  — versão blindada com filtros PT-BR, normalização de contexto e /selftest
from __future__ import annotations
import os
from datetime import datetime
from collections import defaultdict
from typing import Any, Dict

from flask import Flask, jsonify, render_template, request

# ------------------------------------------------------------------------------
# App
# ------------------------------------------------------------------------------
app = Flask(__name__)

# ------------------------------------------------------------------------------
# Filtros PT-BR (número e moeda)
# ------------------------------------------------------------------------------

def _to_float(value: Any, default: float = 0.0) -> float:
    try:
        if value is None:
            return default
        if isinstance(value, (int, float)):
            return float(value)
        s = str(value).strip().replace("R$", "").replace(".", "").replace(",", ".")
        return float(s)
    except Exception:
        return default

def numero_ptbr(value: Any, casas: int = 0) -> str:
    """Formata número no padrão PT-BR com milhares '.' e decimais ','."""
    v = _to_float(value, 0.0)
    fmt = f"{{:,.{casas}f}}".format(v)
    # USA -> PT-BR
    return fmt.replace(",", "X").replace(".", ",").replace("X", ".")

def moeda_ptbr(value: Any) -> str:
    return f"R$ {numero_ptbr(value, 2)}"

app.jinja_env.filters["numero_ptbr"] = numero_ptbr
app.jinja_env.filters["moeda_ptbr"] = moeda_ptbr

# ------------------------------------------------------------------------------
# Normalização dos dados para os templates não quebrarem
# ------------------------------------------------------------------------------

CANAL_KEYS = ("google", "facebook", "youtube")
PROFISSOES_KNOWN = (
    "psicologo", "fisioterapeuta", "nutricionista", "medico",
    "advogado", "engenheiro", "professor", "estudante",
    "administrador", "outros",
)

def _canal_default() -> Dict[str, float]:
    return {"investimento": 0.0, "cpl": 0.0, "roas": 0.0}

def _prof_default() -> Dict[str, int]:
    return {"total": 0}

def normalize_dados(d: Dict[str, Any]) -> Dict[str, Any]:
    d = dict(d or {})

    # canais
    canais_src = (d.get("canais") or {})
    canais: Dict[str, Dict[str, float]] = {k: dict(canais_src.get(k) or {}) for k in CANAL_KEYS}
    for k in CANAL_KEYS:
        base = _canal_default()
        base.update({kk: _to_float(canais.get(k, {}).get(kk, base[kk])) for kk in base.keys()})
        canais[k] = base

    # roas_geral (se não vier, calcula simples pela média dos ROAS existentes >0)
    roas_geral = d.get("roas_geral")
    if roas_geral is None:
        roas_values = [canais[k]["roas"] for k in CANAL_KEYS if _to_float(canais[k]["roas"], 0) > 0]
        roas_geral = (sum(roas_values) / len(roas_values)) if roas_values else 0.0
    roas_geral = _to_float(roas_geral, 0)

    # profissoes (defaultdict para NÃO quebrar quando a chave não existir)
    prof_src = d.get("profissoes") or {}
    profissoes = defaultdict(_prof_default)
    # carrega as conhecidas se existirem
    for k in PROFISSOES_KNOWN:
        val = prof_src.get(k) or {}
        profissoes[k] = {"total": int(_to_float(val.get("total"), 0))}

    # permite chaves não previstas sem quebrar
    for k, val in prof_src.items():
        if k not in profissoes:
            profissoes[k] = {"total": int(_to_float((val or {}).get("total"), 0))}

    # Extras para o template (sempre presentes)
    extras = d.get("extras") or {}
    # percentual_cpl_formatado: string sempre válida
    if "percentual_cpl_formatado" in extras:
        pct_str = str(extras["percentual_cpl_formatado"]).strip()
    else:
        # se não houver, gera a partir de um cálculo simples (ex.: média de CPL/Invest)
        inv_total = sum(canais[k]["investimento"] for k in CANAL_KEYS)
        cpl_media = sum(canais[k]["cpl"] for k in CANAL_KEYS) / (len(CANAL_KEYS) or 1)
        pct = 0.0
        if inv_total > 0:
            pct = min(max((cpl_media / inv_total) * 100.0, 0.0), 9999.0)
        pct_str = f"{numero_ptbr(pct, 2)}%"
    extras_norm = {"percentual_cpl_formatado": pct_str}

    # Monta o pacote final
    dados_norm = {
        "roas_geral": roas_geral,
        "canais": canais,
        "profissoes": profissoes,
    }
    return {"dados": dados_norm, "extras": extras_norm}

# ------------------------------------------------------------------------------
# Fonte dos dados (adapte aqui se você lê da planilha)
# ------------------------------------------------------------------------------

def carregar_dados_visao_geral() -> Dict[str, Any]:
    """
    PONTO ÚNICO DE VERDADE para abastecer TODOS os templates.
    - Se você já tinha uma leitura de planilha, traga o dict bruto e passe por normalize_dados().
    - Aqui deixo um exemplo neutro (0s) para nunca quebrar, substitua pelo seu parser.
    """
    # TODO: substitua por sua leitura da planilha (ex.: pandas.read_excel) e montar `dados_brutos`
    dados_brutos = {
        # exemplo: "canais": {"google": {"investimento": 1234.56, "cpl": 12.34, "roas": 3.21}, ...}
        # exemplo: "profissoes": {"psicologo": {"total": 15}, "fisioterapeuta": {"total": 8}, ...}
        # exemplo: "roas_geral": 2.87,
        # exemplo: "extras": {"percentual_cpl_formatado": "12,50%"},
    }
    ctx = normalize_dados(dados_brutos)

    # Também enviamos uma data formatada para os templates usarem no "Atualizado ..."
    ctx["now_br"] = datetime.now().strftime("%d/%m")
    return ctx

# ------------------------------------------------------------------------------
# Middleware para HEAD do UptimeRobot (evita render e 500)
# ------------------------------------------------------------------------------

@app.before_request
def short_circuit_head():
    if request.method == "HEAD":
        # devolve 200 e corpo vazio para qualquer rota
        return ("", 200, {"X-Handled-Head": "1"})

# ------------------------------------------------------------------------------
# Rotas
# ------------------------------------------------------------------------------

@app.route("/")
def visao_geral():
    return render_template("visao_geral_atualizada.html", **carregar_dados_visao_geral())

@app.route("/origem-conversao")
def origem_conversao():
    # Usa o mesmo contexto blindado (templates usam filtros ptbr e valores default)
    return render_template("origem_conversao_atualizada.html", **carregar_dados_visao_geral())

@app.route("/profissao-canal")
def profissao_canal():
    # Idem: contexto blindado com profissoes default evita UndefinedError
    return render_template("profissao_canal_atualizada.html", **carregar_dados_visao_geral())

@app.route("/healthz")
def healthz():
    return jsonify(status="ok", ts=datetime.utcnow().isoformat() + "Z")

@app.route("/selftest")
def selftest():
    """
    Auto-teste simples que visita todas as rotas principais com test_client.
    Retorna JSON com o status de cada página.
    """
    results = {}
    with app.test_client() as c:
        for path in ("/", "/origem-conversao", "/profissao-canal", "/healthz"):
            try:
                r = c.get(path)
                results[path] = {"status_code": r.status_code}
            except Exception as e:
                results[path] = {"error": str(e), "status_code": 0}
    ok = all(v.get("status_code") == 200 for v in results.values() if isinstance(v, dict))
    return jsonify(ok=ok, results=results)

# ------------------------------------------------------------------------------
# Main (execução local)
# ------------------------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", "10000"))
    app.run(host="0.0.0.0", port=port, debug=True)
