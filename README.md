# Notice — Frontend (Next.js)

Frontend do agregador de notícias [Notice API](https://notice.muttercorp.com.br), pronto para deploy na [Vercel](https://vercel.com).

## Funcionalidades

- **Categorias** (`/categoria/[slug]`) — rotas indexáveis (investimentos, mercado-crypto, tecnologia, programação, esportes, entretenimento)
- **Home** (`/`) — redireciona para a categoria padrão (tecnologia)
- **Detalhe** (`/articles/[id]`) — notícia com metadata Open Graph, Twitter e JSON-LD `NewsArticle`
- **Dashboard** (`/dashboard`) — gráficos (`GET /stats`), `noindex`
- **Admin** (`/admin`) — ingestão manual, só com `NEXT_PUBLIC_ENABLE_ADMIN=true`, `noindex`
- **SEO** — `sitemap.xml`, `robots.txt`, breadcrumbs, footer com links de categoria, OG image

## Variáveis de ambiente

Copie `.env.example` para `.env.local`:

```bash
NEXT_PUBLIC_NOTICE_API_URL=https://notice.muttercorp.com.br
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
NEXT_PUBLIC_ENABLE_ADMIN=false
```

`NEXT_PUBLIC_SITE_URL` é obrigatório em produção para canonical, sitemap e Open Graph corretos.

Em desenvolvimento com API local via túnel SSH:

```bash
NEXT_PUBLIC_NOTICE_API_URL=http://127.0.0.1:3002
```

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy na Vercel

1. Importe o repositório na Vercel (framework: **Next.js**, detectado automaticamente).
2. Configure as variáveis de ambiente no painel do projeto:
   - `NEXT_PUBLIC_NOTICE_API_URL` = `https://notice.muttercorp.com.br`
   - `NEXT_PUBLIC_SITE_URL` = URL pública do frontend (ex.: `https://notice-app.vercel.app`)
   - `NEXT_PUBLIC_ENABLE_ADMIN` = `false` (ou `true` se quiser o painel admin)
3. Deploy.
4. No Google Search Console, envie `https://seu-dominio/sitemap.xml`.

A API já permite CORS (`*`), então o browser pode chamar a API de produção diretamente.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- TanStack Query (cache ~3 min)

## Contrato da API

Documentação: [https://notice.muttercorp.com.br/docs](https://notice.muttercorp.com.br/docs)
