from flask import Flask, send_from_directory, jsonify
import os
import json
import subprocess
import sys
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def dashboard():
    """Serve the main dashboard HTML file"""
    response = send_from_directory('.', 'index.html')
    # Força o navegador a sempre buscar a versão mais recente
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response

@app.route('/api/data')
def get_data():
    """API endpoint to serve dashboard data"""
    try:
        with open('dados_planilha.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "Data file not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/update')
def force_update():
    """Force manual update of dashboard data"""
    try:
        result = subprocess.run([sys.executable, "sheets_integration_v2.py"], 
                               capture_output=True, text=True, cwd="/home/ubuntu")
        
        if result.returncode == 0:
            return jsonify({
                "status": "success", 
                "message": "Dashboard atualizado com sucesso",
                "timestamp": datetime.now().isoformat()
            })
        else:
            return jsonify({
                "status": "error", 
                "message": f"Erro na atualização: {result.stderr}",
                "timestamp": datetime.now().isoformat()
            }), 500
    except Exception as e:
        return jsonify({
            "status": "error", 
            "message": f"Exceção durante atualização: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/status')
def get_status():
    """Get dashboard status and last update time"""
    try:
        # Verificar se o arquivo de dados existe e quando foi modificado
        if os.path.exists('dados_planilha.json'):
            stat = os.stat('dados_planilha.json')
            last_modified = datetime.fromtimestamp(stat.st_mtime).isoformat()
            
            # Ler timestamp do arquivo
            with open('dados_planilha.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
                file_timestamp = data.get('timestamp', 'N/A')
            
            return jsonify({
                "status": "active",
                "last_update": file_timestamp,
                "file_modified": last_modified,
                "auto_update": "running",
                "message": "Dashboard funcionando normalmente"
            })
        else:
            return jsonify({
                "status": "error",
                "message": "Arquivo de dados não encontrado"
            }), 404
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "app": "Dashboard Nanda Mac IA"})

@app.route('/static/<path:filename>')
def static_files(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

