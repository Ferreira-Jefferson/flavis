# AGENTS.md — flavis

Gerador de **orçamentos** em PDF para a SF Higienizações (higienização de estofados e
ar-condicionado), no layout azul-marinho/ciano da referência (`flavis.pdf`). Roda 100% no
navegador (sem backend, sem banco, sem login). SPA em React instalável como app (PWA) e
hospedada na Vercel. O usuário edita a identidade da empresa (nome, contato, logo), preenche os
dados do orçamento (itens de serviço, totais, observações) e **baixa um PDF** — em dois modos: só
o orçamento, ou o orçamento acrescido do registro fotográfico antes & depois (3 posições
possíveis para a seção de fotos).

## Comandos

| Ação | Comando |
|------|---------|
| Dev | `npm run dev` |
| Build (typecheck + bundle) | `npm run build` |
| Preview do build | `npm run preview` |
| Lint (fronteiras) | `npm run lint` |
| Gerar ícones PWA | `npm run gen:icons` |

## Layout (feature-first)

```
src/
├── main.tsx / App.tsx        ← raiz de composição (app shell)
├── index.css                 ← reset + tokens (CSS vars) + shell
├── shared/                   ← camada comum (especialistas, sem regra de feature)
│   ├── ui/tokens.ts          ← tokens de design (cor/tipo/espaço) — usados por app E pdf
│   ├── ui/theme.ts, useTheme.ts ← tema ativo (CSS vars + theme-color), padrão `sanches`
│   ├── ui/BrandName.tsx      ← nome da empresa clicável, vira campo de edição
│   ├── identity/company.ts, useCompany.ts ← identidade da empresa (nome/contato/logo)
│   ├── money/currency.ts     ← centavos inteiros: parseBRL/formatBRL/formatQty
│   ├── text/extenso.ts       ← número → extenso pt-BR
│   └── image/resize.ts       ← redimensiona/comprime imagem no navegador
└── modules/
    └── quote/                ← ÚNICA feature: montar e exportar o orçamento
        ├── MODULE.md
        ├── domain.ts         ← tipos Quote/ServiceItem/Block/ImageAsset + fábricas + cálculos
        ├── useQuote.ts       ← estado da feature
        ├── QuoteEditor.tsx   ← tela (composição das 7 seções)
        ├── sections/*.tsx    ← Mode, Company, QuoteMeta, Items, Totals, Notes, Photos
        ├── BlockEditor.tsx, ImageSlots.tsx ← bloco de fotos antes/depois (modo com registro)
        ├── quote.module.css, sections.module.css ← estilos co-locados
        └── pdf/              ← geração do PDF (@react-pdf/renderer, fonte base-14 Helvetica)
            ├── geometry.ts, QuoteDocument.tsx, parts/*.tsx, generate.tsx
```

## Dois modos

- `orcamento` — documento fiel à referência, sem fotos.
- `com-registro` — acrescenta a seção "REGISTRO FOTOGRÁFICO — ANTES & DEPOIS", com 3
  posicionamentos escolhidos pelo usuário: `anexo` (padrão, nova página), `apos-observacoes`,
  `antes-da-tabela`.

## Especialistas disponíveis na camada comum (reusar, não reescrever)

- `shared/ui/tokens.ts` + `theme.ts`/`useTheme.ts` — fonte única de cor (tema `sanches`
  navy/ciano é o padrão) e tipografia/espaçamento; compartilhados pela UI e pelo PDF.
- `shared/image/resize.ts` — `resizeImageFile(file)` → imagem reduzida (JPEG) pronta pro
  PDF/logo.
- `shared/identity/company.ts` / `useCompany.ts` — identidade da empresa exibida no orçamento:
  nome, tagline, contato e logo. Vem com o padrão da SF Higienizações, tudo editável e
  persistido em `localStorage['company']`. **O app não tem nome próprio** — quem aparece sempre
  é a empresa do usuário.
- `shared/money/currency.ts` — `parseBRL`/`formatBRL`/`formatQty` em centavos inteiros (evita
  erro de ponto flutuante nos totais).
- `shared/text/extenso.ts` — número → extenso pt-BR ("Quatro mil e quinhentos reais").

## Regras de fronteira (verificadas por `npm run lint`)

- **app** pode usar `shared` e `modules`.
- **shared** só pode usar `shared` — nunca importa uma feature.
- **um module** usa `shared` e ele mesmo — **nunca** importa outra feature.
- Consumir capacidade comum é encorajado; duplicar lógica de feature > acoplar features.

## Convenções

- Stack: React + Vite + TypeScript. Sem CSS framework — CSS vars + CSS Modules.
- Arquivo ativo ≤ ~300 linhas; módulo ≤ ~600. Passou → provavelmente são 2.
- Nada de banco/rede: todo estado vive em memória na sessão do navegador; identidade e tema
  persistem em `localStorage`.
