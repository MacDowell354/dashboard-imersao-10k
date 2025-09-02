from flask import Flask, render_template, send_from_directory, jsonify
import os
import json

app = Flask(__name__)

@app.route('/')
def dashboard():
    """Serve the main dashboard HTML file"""
    return send_from_directory('.', 'index.html')

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

