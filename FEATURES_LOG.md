# FEATURES_LOG — Notice (news.muttercorp.com.br)

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
