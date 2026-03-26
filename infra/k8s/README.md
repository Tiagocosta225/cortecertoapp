# Kubernetes Deploy - CorteCerto

## 1) Build e push das imagens

Atualize os nomes de imagem nos manifests em `infra/k8s/*.yaml` para o seu registry.

Sugestão de tags:
- `cortecertoapp-backend`
- `cortecertoapp-admin-panel`
- `cortecertoapp-public-web`
- `cortecertoapp-landing`
- `cortecertoapp-mobile-web`

## 2) Criar secret do backend

Use o exemplo e aplique com sua `DATABASE_URL` real:

```bash
kubectl apply -f infra/k8s/01-backend-secret.example.yaml
```

Use uma `DATABASE_URL` de banco externo real ou de um serviço de banco que exista no cluster.

## 3) Aplicar todos os manifests

```bash
kubectl apply -k infra/k8s/
```

## 4) Verificar rollout

```bash
kubectl -n cortecerto get pods
kubectl -n cortecerto get svc
kubectl -n cortecerto get ingress
kubectl -n cortecerto rollout status deploy/cortecertoapp-backend
kubectl -n cortecerto rollout status deploy/cortecertoapp-admin-panel
kubectl -n cortecerto rollout status deploy/cortecertoapp-public-web
kubectl -n cortecerto rollout status deploy/cortecertoapp-landing
kubectl -n cortecerto rollout status deploy/cortecertoapp-mobile-web
```

## Observações

- O Ingress assume `ingressClassName: nginx`.
- Ajuste os hosts (`*.cortecerto.local`) para o domínio real.
- Os hosts web roteiam `/api` para o backend, compatível com `VITE_API_BASE_URL=/api`.
- Para ambiente produtivo, prefira banco Postgres gerenciado fora do cluster.
