from flask import Flask, render_template, jsonify
import os
from threading import Thread, Event
from datetime import datetime

# módulos auxiliares (devem estar na raiz do repo)
from sheets_gviz import fetch_gviz
from mapper_cht22 import CONFIG, build_payload

app = Flask(__name__)

DATA_CACHE = {}
STOP = Event()


def sync_once():
    """Lê a(s) aba(s) do Google Sheets via GViz e atualiza o cache."""
    sheet_id = os.environ.get("SHEET_ID", "1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT")
    tab_main = os.environ.get("SHEET_TAB", CONFIG["tab"])
    tab_prof = os.environ.get("SHEET_TAB_PROF")
    tab_regiao = os.environ.get("SHEET_TAB_REGIAO")

    t_main = fetch_gviz(sheet_id, tab_main)
    t_prof = fetch_gviz(sheet_id, tab_prof) if tab_prof else None
    t_reg = fetch_gviz(sheet_id, tab_regiao) if tab_regiao else None

    DATA_CACHE.clear()
    DATA_CACHE.update(build_payload(t_main, t_prof, t_reg))


def sync_loop():
    """Loop em background para sincronização periódica."""
    interval = int(os.environ.get("SYNC_INTERVAL", "300"))
    while not STOP.is_set():
        try:
            sync_once()
        except Exception as e:
            print("[CHT22] sync error:", e)
        STOP.wait(interval)


# dispara o sincronizador em background ao iniciar o app
Thread(target=sync_loop, daemon=True).start()


# ----------------- API -----------------
@app.route("/api/data")
def api_data():
    return jsonify(DATA_CACHE or {"status": "empty"})


@app.route("/api/update")
def api_update():
    try:
        sync_once()
        return jsonify({"status": "ok", "updated_at": DATA_CACHE.get("timestamp")})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/health")
def health():
    return jsonify({"status": "ok", "ts": DATA_CACHE.get("timestamp")})


# -------------- Páginas ---------------
def _render(aba: str):
    """Reutiliza seu template de dashboard, sem mudar o layout."""
    return render_template(
        "dashboard.html",
        aba_ativa=aba,
        dados=DATA_CACHE,
        timestamp=datetime.now().strftime("%H:%M:%S"),
    )


@app.route("/")
def home():
    return _render("visao-geral")


@app.route("/visao-geral")
def visao_geral():
    return _render("visao-geral")


@app.route("/origem-conversao")
def origem_conversao():
    return _render("origem-conversao")


@app.route("/profissao-canal")
def profissao_canal():
    return _render("profissao-canal")


@app.route("/analise-regional")
def analise_regional():
    return _render("analise-regional")


@app.route("/projecao-resultados")
def projecao_resultados():
    return _render("projecao-resultados")


@app.route("/insights-ia")
def insights_ia():
    return _render("insights-ia")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5002"))
    app.run(host="0.0.0.0", port=port, debug=False)
