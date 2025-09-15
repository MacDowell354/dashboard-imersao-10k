from flask import Flask, render_template, jsonify
import os
from threading import Thread, Event
from sheets_gviz import fetch_gviz
from mapper_cht22 import CONFIG, build_payload
from datetime import datetime
app=Flask(__name__)
DATA_CACHE={}; STOP=Event()
def sync_once():
    sid=os.environ.get('SHEET_ID','1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT')
    tmain=os.environ.get('SHEET_TAB', CONFIG['tab'])
    tprof=os.environ.get('SHEET_TAB_PROF'); treg=os.environ.get('SHEET_TAB_REGIAO')
    main=fetch_gviz(sid,tmain); prof=fetch_gviz(sid,tprof) if tprof else None; reg=fetch_gviz(sid,treg) if treg else None
    DATA_CACHE.clear(); DATA_CACHE.update(build_payload(main,prof,reg))
def loop():
    it=int(os.environ.get('SYNC_INTERVAL','300'))
    while not STOP.is_set():
        try: sync_once()
        except Exception as e: print('[CHT22] sync error:', e)
        STOP.wait(it)
Thread(target=loop, daemon=True).start()
@app.route('/api/data')
def api_data(): return jsonify(DATA_CACHE or {'status':'empty'})
@app.route('/api/update')
def api_update():
    try: sync_once(); return jsonify({'status':'ok','updated_at':DATA_CACHE.get('timestamp')})
    except Exception as e: return jsonify({'status':'error','message':str(e)}), 500
@app.route('/health')
def health(): return jsonify({'status':'ok','ts':DATA_CACHE.get('timestamp')})
def _render(aba): return render_template('dashboard.html', aba_ativa=aba, dados=DATA_CACHE, timestamp=datetime.now().strftime('%H:%M:%S'))
@app.route('/'); @app.route('/visao-geral')
def visao_geral(): return _render('visao-geral')
@app.route('/origem-conversao')
def origem_conversao(): return _render('origem-conversao')
@app.route('/profissao-canal')
def profissao_canal(): return _render('profissao-canal')
@app.route('/analise-regional')
def analise_regional(): return _render('analise-regional')
@app.route('/projecao-resultados')
def projecao_resultados(): return _render('projecao-resultados')
@app.route('/insights-ia')
def insights_ia(): return _render('insights-ia')
if __name__=='__main__':
    port=int(os.environ.get('PORT','5002')); app.run(host='0.0.0.0', port=port, debug=False)
