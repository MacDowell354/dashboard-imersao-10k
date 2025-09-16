services:
  - type: web
    name: dashboard-cht22
    env: docker                # <<< troca para docker
    dockerfilePath: ./Dockerfile
    buildContext: .            # usa raiz do repo
    plan: free
    region: oregon
    branch: main
    autoDeploy: true
