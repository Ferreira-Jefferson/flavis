# flavis

Gerador de **orçamentos** em PDF, no layout da SF Higienizações (higienização de estofados e
ar-condicionado).

Você edita a identidade da empresa (nome, contato, logo), preenche os itens do orçamento,
totais e observações, e baixa um **PDF** fiel ao layout de referência — em dois modos: só o
orçamento, ou o orçamento acrescido do **registro fotográfico antes & depois** (com 1 a 3 fotos
de cada lado por bloco, em 3 posicionamentos possíveis). Roda inteiro no navegador — **sem
cadastro, sem banco de dados** — e pode ser **instalado como app** no celular (PWA).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (ex.: http://localhost:5173).

## Build de produção

```bash
npm run build      # gera dist/
npm run preview    # serve o build para conferência
```

## Deploy (Vercel)

O projeto é detectado como Vite automaticamente. Configuração de SPA em
`vercel.json`. Basta conectar o repositório na Vercel ou rodar `vercel`.

## Como o código é organizado

Arquitetura **feature-first** (slices por funcionalidade). Detalhes em
[AGENTS.md](AGENTS.md).
