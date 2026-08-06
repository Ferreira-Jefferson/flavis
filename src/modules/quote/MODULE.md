# Módulo: quote

**Propósito:** montar um orçamento (com registro fotográfico antes/depois opcional) e exportá-lo
como PDF fiel ao layout de referência da SF Higienizações (`flavis.pdf`). É a única feature do
app.

## Entry points

- `QuoteEditor.tsx` — tela completa (usada por `App.tsx`); composition root que chama
  `useQuote`/`useCompany`/`useTheme` e repassa dados/ações às 7 seções.
- `pdf/generate.tsx` — `downloadQuotePdf(quote, company, palette)` monta o PDF (Helvetica,
  base-14 do PDF, sem fonte custom) e dispara o download; nome do arquivo
  `orcamento-<numero>.pdf`.

## Dois modos (`domain.ts` → `DocMode`)

- `orcamento` — só o orçamento, idêntico à referência (sem fotos).
- `com-registro` — mesma base + seção "REGISTRO FOTOGRÁFICO — ANTES & DEPOIS", com 3 posições
  possíveis (`PhotoPlacement`): `anexo` (padrão, nova página), `apos-observacoes`,
  `antes-da-tabela`.

## Estrutura

- `domain.ts` — tipos `Quote` / `ServiceItem` / `Block` / `ImageAsset` + fábricas + cálculos
  puros (`unitPriceCents`, `itemTotal`, `subtotal`, `grandTotal`). Sem UI, sem PDF.
- `useQuote.ts` — estado da feature: campos, CRUD de itens, CRUD de blocos, upload de logo,
  `addImages` sequencial com `busy`.
- `QuoteEditor.tsx` → `sections/*.tsx` (`ModeSection`, `CompanySection`, `QuoteMetaSection`,
  `ItemsSection`, `TotalsSection`, `NotesSection`, `PhotosSection`) → `BlockEditor.tsx` →
  `ImageSlots.tsx` — UI em níveis.
- `MoneyInput.tsx` — input de valor em reais, formata só no blur (evita corromper a vírgula
  decimal ao digitar).
- `quote.module.css`, `sections.module.css` — estilos co-locados.
- `pdf/` — `geometry.ts` (constantes de layout em pt, medidas da referência),
  `QuoteDocument.tsx` (composição das partes), `parts/*.tsx` (`Header`, `InfoCard`,
  `SectionTitle`, `ItemsTable`, `Totals`, `Notes`, `Photos`, `Signatures`, `Footer`),
  `generate.tsx` (blob + download).

## Depende de (shared)

- `shared/image/resize.ts` — reduz fotos e logo antes de guardar no estado / PDF.
- `shared/ui/tokens.ts` + `shared/ui/theme.ts`/`useTheme.ts` — paleta (tema `sanches`
  navy/ciano) compartilhada entre a tela e o PDF.
- `shared/identity/company.ts` + `useCompany.ts` — identidade da empresa (nome, contato, logo),
  padrão SF Higienizações, editável e persistida.
- `shared/money/currency.ts` — `parseBRL`/`formatBRL`/`formatQty` em centavos inteiros.
- `shared/text/extenso.ts` — total por extenso em pt-BR.
- `shared/pwa/updatePrompt.ts` — trata falha de chunk (`isModuleLoadError`/`markNeedRefresh`) no
  download lazy do PDF.

## Contratos / dados

- Preço unitário é **derivado** do total informado (`unitPriceCents = round(totalCents /
  quantity)`), nunca o inverso — reproduz o arredondamento real da referência.
- Nenhuma tabela, rede ou persistência de servidor: estado do orçamento vive só na sessão do
  navegador; identidade e tema persistem em `localStorage`.
- Não importa nenhuma outra feature (não há outra).
