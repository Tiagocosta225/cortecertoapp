# Deploy da Landing na Cloudflare Pages

Este guia publica a landing institucional em `apps/landing` na Cloudflare Pages e configura o dominio `www.cortecertoapp.com.br`.

## Projeto a publicar

- app: `apps/landing`
- tipo: React + Vite estatico
- comando de build: `npm run build`
- saida do build: `dist`

O projeto ja inclui um arquivo [`_headers`](/home/tiagocosta_trinks/coding/devops-labs/cortecertoapp/apps/landing/public/_headers) na pasta `public/`, que a Cloudflare Pages copia para o artefato final e aplica como headers de resposta.

## Configuracao no Cloudflare Pages

No dashboard da Cloudflare:

1. Acesse `Workers & Pages`.
2. Clique em `Create application`.
3. Escolha `Pages` e conecte o repositorio.
4. Configure os campos abaixo.

### Opcao recomendada

Use o proprio app como raiz do projeto.

- Project name: `cortecerto-landing`
- Production branch: sua branch principal (`main` ou `master`)
- Root directory: `apps/landing`
- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `22`

### Opcao alternativa

Se preferir manter a raiz do repositorio:

- Root directory: `.`
- Build command: `npm install && npm run build -w @cortecerto/landing`
- Build output directory: `apps/landing/dist`

## Dominio `www.cortecertoapp.com.br`

### Caso o dominio esteja na propria Cloudflare

Depois do primeiro deploy:

1. Abra o projeto em `Workers & Pages`.
2. Entre em `Custom domains`.
3. Clique em `Set up a domain`.
4. Informe `www.cortecertoapp.com.br`.
5. Confirme.

A propria Cloudflare deve criar automaticamente o DNS do subdominio quando a zona `cortecertoapp.com.br` ja estiver gerenciada na mesma conta.

Registro esperado:

| Tipo | Nome | Conteudo | Proxy |
| --- | --- | --- | --- |
| `CNAME` | `www` | `<seu-projeto>.pages.dev` | `Proxied` |

Importante: associe o dominio pelo fluxo de `Custom domains` do Pages antes de criar ou editar o DNS manualmente.

### Caso o DNS ainda nao esteja na Cloudflare

Voce pode usar o subdominio `www` sem migrar a zona inteira, desde que crie o CNAME no provedor DNS atual apontando para:

- `www.cortecertoapp.com.br` -> `<seu-projeto>.pages.dev`

Mesmo nesse caso, primeiro associe `www.cortecertoapp.com.br` dentro do projeto Pages e depois crie o CNAME no DNS externo.

## Redirecionar o dominio raiz para `www`

Se quiser padronizar tudo em `https://www.cortecertoapp.com.br`, configure um redirect 301 do apex para `www`.

### Regra recomendada

No menu `Rules` > `Redirect Rules`, crie:

- If incoming requests match: `https://cortecertoapp.com.br/*`
- Then forward to: `https://www.cortecertoapp.com.br/${1}`
- Status code: `301`
- Preserve query string: `On`

### DNS minimo para o apex

Para o redirect funcionar, o dominio raiz precisa resolver dentro da Cloudflare. Se a zona estiver na Cloudflare, mantenha o dominio `cortecertoapp.com.br` ativo nela. Nao aponte o apex para o Pages se a intencao for apenas redirecionar para `www`.

## Checklist final

- Deploy de producao concluido no Pages
- `www.cortecertoapp.com.br` adicionado em `Custom domains`
- Certificado emitido e status `Active`
- Redirect do apex para `www` criado
- Teste manual:

```bash
curl -I https://www.cortecertoapp.com.br
curl -I https://cortecertoapp.com.br
```

O esperado e:

- `www.cortecertoapp.com.br` responder `200`
- `cortecertoapp.com.br` responder `301` para `https://www.cortecertoapp.com.br/...`

## Referencias oficiais

- Cloudflare Pages custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Cloudflare Pages monorepos: https://developers.cloudflare.com/pages/configuration/monorepos/
- Cloudflare Pages headers: https://developers.cloudflare.com/pages/configuration/headers/
- Cloudflare redirect root -> www: https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-root-to-www/
