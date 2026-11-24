# FEATURES_LOG — Notice (news.muttercorp.com.br)

## 2026-11-24 — Categoria Animes + One Piece / spoilers (branch `feature/animes`)
- Nova categoria **Animes** (`/categoria/animes`), com 21 feeds RSS validados (PT-BR e EN): Anime News Network, MyAnimeList, Otaku USA, Anime Corner, Dexerto Anime, ComicBook Anime, CBR Anime, IntoxiAnime, AnimeNew, Anime United, JBox, Combo Infinito Animes, mais fontes dedicadas de One Piece (CBR, ScreenRant, GameRant, IntoxiAnime, Anime United, Combo Infinito, O Vício, Critical Hits e The Library of Ohara).
- Fontes descartadas por falha: Crunchyroll News (página HTML, não RSS; o `/rss/news` é feed de vídeos), Reddit r/OnePiece, r/OnePieceSpoilers e r/anime (403/404/429), Omelete, Sportskeeda (verificação humana), WorstGen, RSShub/Nitter, Fandom e várias tags mortas.
- Filtro destacado **One Piece** em `/categoria/animes?topic=one-piece` (também na API: `?topic=one-piece` ou `?onePiece=true`). Itens são marcados por palavras-chave (One Piece, Luffy, Oda, Elbaf, capítulos etc.) ou pelo nome da fonte.
- Selo **Spoiler** e texto/título ocultos com blur até o clique/toque (cards e página da notícia). Compartilhamento (Open Graph/Twitter) não antecipa o título do spoiler.
- Feeds: `/categoria/animes/feed.xml` e `/feed.json`, mais `/categoria/animes/feed.xml?topic=one-piece` listado em `/feeds`. Itens com spoiler saem com prefixo `[Spoiler]` no RSS.
- A seção aparece no nav desktop (link Animes + atalho na faixa de categorias), na gaveta mobile e nas abas de categoria.
- Sem migration de schema: flags calculadas na leitura. Deduplicação por URL dentro da mesma categoria na ingestão (evita o mesmo post de feeds geral + tag).
- Só entra na `main`/`master` depois do merge explícito; deploy de produção foi feito a partir desta branch.
- Backups (2026-11-24 16:24 America/Sao_Paulo): `/root/backups/notice-api/env-20261124-202438.bak`, `frontend-env-20261124-202438.bak`, `notice_api-20261124-202438.dump`, `frontend-next-20261124-202438/`, `frontend-src-20261124-202438.tgz`, `api-prev-commit-20261124-202438.txt` (eb64f7f), `frontend-prev-commit-20261124-202438.txt` (64060c4).
- **Rollback**: restaurar o dump se necessário; no frontend, `cd /apps/production/notice-api/frontend && git checkout main && rm -rf .next && cp -a /root/backups/notice-api/frontend-next-20261124-202438 .next && pm2 restart notice-frontend --update-env && pm2 save`. Na API, `cd /apps/production/notice-api && git checkout master && pm2 restart notice-api notice-worker --update-env && pm2 save`.


## 2026-11-23 — Feeds RSS / JSON Feed (branch `feature/rss-feeds`, repo noticia-api, commit `65de2ee`)
- **Feed geral**: `/feed.xml` (RSS 2.0) e `/feed.json` (JSON Feed 1.1) — 50 notícias mais recentes de todas as categorias.
- **Por categoria** (14): `/categoria/<slug>/feed.xml` e `/categoria/<slug>/feed.json` (slug inválido → 404).
- **CVEs**: `/vulnerabilidades/feed.xml` com filtros `?severity=CRITICAL,HIGH` e `?kev=1` (exploradas ativamente, CISA KEV), título com severidade/CVSS/KEV.
- Itens apontam para a página da notícia no Notice e trazem a fonte original (`<source>`, `dc:creator`, `external_url`). XML escapado e sem caracteres de controle; `Cache-Control: s-maxage=600`; 503 com `Retry-After` se a API cair.
- Página **`/feeds`** (lista todos os feeds com botões RSS / JSON / Copiar link), link "Feeds RSS / JSON" no rodapé, `/feeds` no sitemap.
- **Autodescoberta**: `<link rel="alternate" type="application/rss+xml|application/feed+json">` nas páginas de categoria, raiz e `/vulnerabilidades` (Feedly/Inoreader detectam colando a URL do site).
- Só frontend (Next route handlers usando a API pública existente); sem mudança de schema/API.
- Backups: `/root/backups/notice-api/env-20261123-140032.bak`, `frontend-env-20261123-140032.bak`, `notice_api-20261123-140032.dump`, `frontend-next-20261123-140032/` (build anterior), `frontend-src-next-20261123-140032.tgz`, `frontend-prev-commit-20261123-140032.txt` (7b62e85).
- **Rollback**: `cd /apps/production/notice-api/frontend && git checkout main && npm run build && pm2 restart notice-frontend --update-env && pm2 save` (rápido, sem rebuild: `rm -rf .next && cp -a /root/backups/notice-api/frontend-next-20261123-140032 .next && git checkout main && pm2 restart notice-frontend`).

## 2026-11-19 — Versão mobile + PWA + correção de erros (branch `feature/mobile-pwa`)

### Erros corrigidos
- **Hidratação React #418** (texto diferente entre servidor e navegador): datas relativas ("há 5 min") e datas sem fuso fixo. Agora `RelativeTime` (useSyncExternalStore) renderiza data absoluta no SSR e troca para relativa no cliente; `formatArticleDate` usa `America/Sao_Paulo`.
- **`/_vercel/insights/script.js` 404** em todas as páginas: `<Analytics />` da Vercel só é renderizado quando `VERCEL` está definido.
- **Ofertas Shopee 401/502 no navegador**: o front chamava `/shopee/products?refresh=true` (exige runner token → 401) e o modo "live" falhava com 502 do upstream Shopee. O navegador agora usa só o catálogo em cache (`/shopee/catalog`).
- **Log do PM2 cheio de "Failed to find Server Action" / "Expected RSC response"** (scanners automáticos tipo React2Shell): `src/proxy.ts` responde 405 para métodos não-GET e 400 para header `Next-Action` (o site não usa Server Actions).
- `theme-color` migrado de `metadata.other` para `export const viewport` (padrão do Next 16); links "/" do header/rodapé/breadcrumb apontam direto para `/categoria/tecnologia` (evita redirect 308).
- Lint: removidos `setState` síncronos em efeitos nos componentes alterados (FeedView remonta por `key={category}`, SearchBar sem efeito de sync).

### Mobile
- Header compacto + **menu hambúrguer** e **barra inferior fixa** (Notícias · Categorias · CVEs · Ofertas) com gaveta de categorias (bottom sheet); respeita safe-area (iPhone com notch).
- Categorias e filtros de fonte viram **listas roláveis na horizontal** no celular (centraliza a ativa).
- Cards com área de toque no card inteiro, alvos ≥ 44px, inputs com 16px (sem zoom no iOS), sem rolagem horizontal (verificado em 375/414px).
- **"Carregar mais" + rolagem infinita** (até 5 páginas automáticas) no feed e na lista de CVEs.
- `/vulnerabilidades`: busca fixa no topo + botão **Filtros** que abre bottom sheet (severidade, KEV, ordenação, "Limpar", contador de filtros ativos).
- Página da notícia: botão **Compartilhar** (Web Share API / copiar link) e botões em largura total.

### PWA (instalável)
- `src/app/manifest.ts` (`/manifest.webmanifest`): nome, ícones 192/512 + maskable, standalone, atalhos (CVEs, Segurança, IA).
- Ícones `public/icon-*.png`, `apple-touch-icon.png`; `appleWebApp` meta para iOS.
- Service worker `public/sw.js`: páginas network-first com cache das últimas 40 abertas (leitura offline), `/_next/static` cache-first, API de notícias/CVEs network-first, imagens stale-while-revalidate; fallback `public/offline.html` (lista as páginas salvas).
- Botão **"Instalar o app Notice"** no menu (prompt nativo no Android/Chrome; instruções no iOS).

## 2026-11-18 — CVEs e novas categorias (branch `feature/cves-more-feeds`)
- Página `/vulnerabilidades` e detalhe `/vulnerabilidades/[id]` (NVD, CISA KEV, GitHub Advisories) com selos de severidade, filtros e busca.
- Novas categorias: Segurança, IA, Economia, Brasil, Mundo, Ciência.
