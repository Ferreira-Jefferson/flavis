# Módulo: report

**Propósito:** montar um relatório de antes/depois e exportá-lo como PDF editorial.
É a única feature do app.

## Entry points

- `ReportEditor.tsx` — tela completa (usada por `App.tsx`).
- `pdf/generate.tsx` — `downloadReportPdf(report, palette, brand)` monta o PDF e dispara o download.
  `brand` é o nome que o usuário escreveu no logo; vazio = o PDF sai sem nome nenhum
  (rodapé só com "antes & depois", sem autor e sem prefixo no arquivo).

## Estrutura

- `domain.ts` — tipos `Report` / `Block` / `ImageAsset` + fábricas. Sem UI, sem PDF.
- `useReport.ts` — estado da feature (campos, blocos, imagens). Enforce máx. 3 imagens/lado.
- `ReportEditor.tsx` → `BlockEditor.tsx` → `ImageSlots.tsx` — UI em 3 níveis.
- `report.module.css` — estilos co-locados.
- `pdf/` — `fonts.ts` (registra Cormorant/Inter), `ReportDocument.tsx` (layout), `generate.tsx` (blob + download).

## Depende de (shared)

- `shared/image/resize.ts` — reduz cada foto antes de guardar no estado / PDF.
- `shared/ui/tokens.ts` — cores/tipografia (compartilhadas com o PDF).
- `shared/ui/useBrand.ts` — nome da marca definido pelo usuário, carimbado no PDF.

## Contratos / dados

- Nenhuma tabela, rede ou persistência: estado vive só na sessão do navegador.
- Não importa nenhuma outra feature (não há outra).
