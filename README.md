# CorteCertoApp

Monorepo do CorteCertoApp organizado por responsabilidade:

```text
cortecertoapp/
  apps/
    public-web
    admin-panel
    landing
    backend
    mobile
  infra/
    nginx
    docker
    k8s
  packages/
    shared-types
    shared-config
    ui
```

## Apps

- `apps/public-web`: link publico de agendamento
- `apps/admin-panel`: painel operacional e de faturamento
- `apps/landing`: landing institucional/comercial
- `apps/backend`: backend monolitico modular
- `apps/mobile`: app mobile legado mantido no workspace

## Workspace

- `npm` workspaces habilitado via `package.json` raiz
- `pnpm` workspace habilitado via `pnpm-workspace.yaml`
- scripts unificados na raiz para build, lint, check e compose

Exemplos:

```bash
npm install
npm run build
npm run lint
npm run check
npm run dev:backend
npm run dev:public-web
npm run compose:up
```

## Infra

- `infra/docker`: compose e imagens auxiliares
- `infra/nginx`: proxy reverso
- `infra/k8s`: manifests e kustomization

## Packages

Diretorio reservado para compartilhamento futuro de tipos, configuracoes e UI.

## Padrao de Env

- `infra/docker/.env`: variaveis do ambiente docker
- `infra/docker/.env.homolog.example`: base para homologacao com banco separado
- `apps/backend/.env`: backend local
- `apps/backend/.env.homolog.example`: base para backend em homologacao
- `apps/public-web/.env`: app publico
- `apps/admin-panel/.env`: painel
- `apps/landing/.env`: landing

Use os arquivos `.env.example` como base.

## Deploy Docker

- `infra/docker/.env` controla banco, porta publicada do proxy e hostnames roteados pelo Nginx
- `ADMIN_API_KEY`, `ALLOWED_ORIGINS` e `TRUST_PROXY` precisam estar definidos no `.env` do compose
- `HTTP_PORT` e `HTTPS_PORT` publicam o proxy Nginx no host
- `FRONTEND_HOST`, `ADMIN_HOST` e `LANDING_HOST` definem os `server_name` do Nginx
- o backend aplica `prisma migrate deploy` no startup do container
- coloque o certificado Cloudflare Origin em `infra/nginx/certs/origin.crt` e a chave em `infra/nginx/certs/origin.key`
- com Cloudflare, use SSL mode `Full (strict)` depois de instalar o certificado no origin

## Homologacao

- use um banco dedicado de homologacao, com nome diferente de dev e producao
- referencia pronta: `dbcortes_homolog`
- para Docker, copie `infra/docker/.env.homolog.example` para `infra/docker/.env` no ambiente de homologacao
- para o backend, use `apps/backend/.env.homolog.example` como base de variaveis
- para Kubernetes, use `infra/k8s/01-backend-secret.homolog.example.yaml` e aponte para um host de banco exclusivo de homologacao
- nunca reutilize a mesma `DATABASE_URL` entre dev, homolog e producao
