#!/usr/bin/env python3
"""
Dashboard CHT22 - Main Entry Point
Compatibilidade com sistema de deploy
"""

import sys
import os

# Adicionar diretório pai ao path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Importar e executar a aplicação principal
try:
    from app import app
except ImportError:
    # Fallback para estrutura alternativa
    sys.path.insert(0, os.path.join(parent_dir, '..'))
    from app import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=False)

