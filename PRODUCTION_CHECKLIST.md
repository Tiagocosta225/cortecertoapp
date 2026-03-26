# Production Checklist

## Estado atual

- [x] Workspace compila com `npm run build`
- [x] Workspace valida com `npm run check`
- [x] Backend possui `healthcheck`
- [x] Rotas administrativas do backend exigem `X-Admin-Api-Key`
- [x] Admin panel injeta `ADMIN_API_KEY` no servidor ao acessar `/api`
- [x] Backend aplica headers de seguranca, limite basico de requisicoes e validacao de env obrigatoria em producao
- [x] Landing nao depende mais de asset remoto temporario

## Ainda obrigatorio antes do deploy

- [ ] Definir valores reais para `ADMIN_API_KEY`, `DATABASE_URL` e `ALLOWED_ORIGINS`
- [ ] Garantir que homologacao use banco exclusivo, por exemplo `dbcortes_homolog`, sem compartilhar `DATABASE_URL` com dev ou producao
- [ ] Trocar imagens placeholder `ghcr.io/your-org/...:latest` nos manifests de `infra/k8s`
- [ ] Configurar dominio real e TLS no Ingress Kubernetes
- [ ] Remover `node_modules`, `dist` e `.expo` do artefato/versionamento de release
- [ ] Criar pipeline de CI com build, check e deploy versionado
- [ ] Criar backup e monitoramento do Postgres
- [ ] Adicionar observabilidade minima: logs centralizados, alertas e uptime check
- [ ] Criar testes automatizados reais para fluxos de agendamento e CRUD administrativo
- [ ] Revisar segredos fora de `.env` local para producao

## Recomendado

- [ ] Adicionar autenticacao de usuario com sessao ou JWT em vez de depender apenas de chave de ambiente
- [ ] Adicionar rate limit especifico para criacao publica de agendamento
- [ ] Versionar imagens com tag imutavel em vez de `latest`
- [ ] Definir estrategia de rollback
- [ ] Separar ambientes `dev`, `staging` e `production`
