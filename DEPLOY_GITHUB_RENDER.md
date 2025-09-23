
# Deploy rápido (GitHub + Render)

1) Suba esta pasta para um repositório no GitHub (ex.: `dashboard-cht22`).
2) No Render, crie um **Web Service** a partir do repositório.
3) Configure as variáveis de ambiente (opcional):
   - `CHT22_SHEET_ID=1f5qcPc4l0SYVQv3qhq8d17s_fTMPkyoT`
   - `CHT22_CACHE_SECONDS=300`
4) Build usa `requirements.txt`. O start é `web: gunicorn app:app` via `Procfile`.
5) Acesse `/` para o dashboard e as rotas:
   - `/visao-geral`
   - `/origem-conversao`
   - `/profissao-canal`
   - `/analise-regional`
   - `/insights-ia`
   - `/projecao-resultados`
