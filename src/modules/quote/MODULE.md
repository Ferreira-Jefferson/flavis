# Módulo: quote

**Propósito:** montar um orçamento (com registro fotográfico antes/depois opcional) e exportá-lo
como PDF fiel ao layout de referência da SF Higienizações (`flavis.pdf`). É a única feature do
app.

## Entry points

- `QuoteEditor.tsx` — tela completa (usada por `App.tsx`); composition root que chama
  `useQuote`/`useCompany` e repassa dados/ações às 6 seções.
- `pdf/generate.tsx` — `downloadQuotePdf(quote, company, palette)` monta o PDF (Helvetica,
  base-14 do PDF, sem fonte custom) e dispara o download; nome do arquivo
  `orcamento-<numero>.pdf`.

## Fotos opcionais (`domain.ts` → `PhotoPlacement`)

A seção "REGISTRO FOTOGRÁFICO" aparece sempre no editor, e sua posição na tela
acompanha a posição escolhida no PDF (`QuoteEditor.tsx` monta o mesmo `<PhotosSection>` em pontos
diferentes do formulário conforme `photoPlacement`): `sem-fotos` (padrão, não entra no PDF e
desabilita a inserção de fotos, fica ao final do formulário), `antes-da-tabela` (antes da tabela de
serviços), `apos-totais` (depois de Totais, antes de Observações), `anexo` (sempre em nova página,
por isso vem depois de Observações/Assinaturas — é o único que quebra página).

No PDF (`pdf/parts/Photos.tsx`), cada bloco tem duas formas: com os dois lados preenchidos sai o
par legendado (colunas "Antes" e "Depois"); com um lado só, as fotos entram num grid de 2 colunas
**sem legenda** — não há comparação a rotular — na mesma largura que teriam numa coluna do par
(`isBeforeAfterPair` em `domain.ts`). Blocos sem nenhuma foto não entram no PDF
(`blockHasImages`), então "Anexado ao final" não gera página só com o título da seção.

## Estrutura

- `domain.ts` — tipos `Quote` / `ServiceItem` / `Block` / `ImageAsset` + fábricas + cálculos
  puros (`unitPriceCents`, `itemTotal`, `subtotal`, `grandTotal`) + `UNIT_OPTIONS` (unidades de
  medida do `<select>` de `ItemsSection`). Sem UI, sem PDF.
- `useQuote.ts` — estado da feature: campos, CRUD de itens, CRUD de blocos, upload de logo,
  `addImages` sequencial com `busy`.
- `QuoteEditor.tsx` → `sections/*.tsx` (`CompanySection`, `QuoteMetaSection`, `ItemsSection`,
  `TotalsSection`, `NotesSection`, `PhotosSection`) → `BlockEditor.tsx` → `ImageSlots.tsx` — UI em
  níveis. `ItemsSection` alinha a linha Qtd · Un. · Vl. unit. · Vl. total com as colunas da tabela
  do PDF (mesma ordem e proporções de `TABLE.columnWidths`); "Vl. unit." é somente leitura.
- `MoneyInput.tsx` — input de valor em reais, formata só no blur (evita corromper a vírgula
  decimal ao digitar) e mantém o "R$" como prefixo fixo fora do campo editável.
- `quote.module.css`, `sections.module.css`, `moneyInput.module.css` — estilos co-locados.
- `pdf/` — `geometry.ts` (constantes de layout em pt, medidas da referência),
  `QuoteDocument.tsx` (composição das partes), `parts/*.tsx` (`Header`, `InfoCard`,
  `SectionTitle`, `ItemsTable`, `Totals`, `Notes`, `Photos`, `Signatures`, `Footer`),
  `generate.tsx` (blob + download).

## Depende de (shared)

- `shared/image/resize.ts` — reduz fotos e logo antes de guardar no estado / PDF.
- `shared/ui/tokens.ts` — paleta fixa (navy/ciano) compartilhada entre a tela e o PDF.
- `shared/identity/company.ts` + `useCompany.ts` — identidade da empresa (nome, contato, logo),
  padrão SF Higienizações, editável e persistida.
- `shared/money/currency.ts` — `parseBRL`/`formatBRL`/`formatQty` em centavos inteiros.
- `shared/text/extenso.ts` — total por extenso em pt-BR.
- `shared/pwa/updatePrompt.ts` — trata falha de chunk (`isModuleLoadError`/`markNeedRefresh`) no
  download lazy do PDF.

## Contratos / dados

- `downloadQuotePdf` só é chamável (botão "Baixar PDF" habilitado) com nome da empresa
  preenchido e ao menos 1 item com descrição — sem nome, a UI mostra `appFallbackName`
  ("flavis") no lugar, mas o PDF exige a identidade real.
- Preço unitário é **derivado** do total informado (`unitPriceCents = round(totalCents /
  quantity)`), nunca o inverso — reproduz o arredondamento real da referência.
- Nenhuma tabela, rede ou persistência de servidor: estado do orçamento vive só na sessão do
  navegador; a identidade da empresa persiste em `localStorage`.
- Não importa nenhuma outra feature (não há outra).
