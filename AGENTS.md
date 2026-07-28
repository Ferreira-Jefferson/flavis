# AGENTS.md — flavis

Gerador de relatórios **antes & depois** para serviços de reforma. Roda 100% no
navegador (sem backend, sem banco, sem login). SPA em React instalável como app
(PWA) e hospedada na Vercel. O usuário preenche título/local/descrição, adiciona
blocos de imagens antes/depois (1–3 cada) e **baixa um PDF** editorial.

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
│   ├── ui/brand.ts           ← nome do logo: padrão do app + o que o usuário escrever
│   ├── ui/BrandName.tsx      ← logo clicável que vira campo de edição
│   └── image/resize.ts       ← redimensiona/comprime imagem no navegador
└── modules/
    └── report/               ← ÚNICA feature: montar e exportar o relatório
        ├── MODULE.md
        ├── domain.ts         ← tipos Report/Block/ImageAsset + fábricas
        ├── useReport.ts      ← estado da feature
        ├── ReportEditor.tsx  ← tela (meta + blocos + ações)
        ├── BlockEditor.tsx   ← um bloco antes/depois
        ├── ImageSlots.tsx    ← slots de imagem de um lado (antes|depois)
        ├── report.module.css ← estilos co-locados da feature
        └── pdf/              ← geração do PDF (@react-pdf/renderer)
            ├── fonts.ts
            ├── ReportDocument.tsx
            └── generate.tsx  ← monta o PDF e dispara o download
```

## Especialistas disponíveis na camada comum (reusar, não reescrever)

- `shared/ui/tokens.ts` — fonte única de cor/tipografia/espaçamento.
- `shared/image/resize.ts` — `resizeImageFile(file)` → imagem reduzida (JPEG) pronta pro PDF.
- `shared/ui/brand.ts` / `useBrand.ts` — nome da marca. O logo mostra `flavis` por padrão
  e vira campo de edição ao clique; sair sem digitar volta ao padrão. Com um nome escrito,
  ele substitui o logo, o título da aba, o rodapé/autor do PDF e prefixa o arquivo baixado.
  **Sem nome escrito, o PDF não leva nome nenhum** — `flavis` fica só na interface.

## Regras de fronteira (verificadas por `npm run lint`)

- **app** pode usar `shared` e `modules`.
- **shared** só pode usar `shared` — nunca importa uma feature.
- **um module** usa `shared` e ele mesmo — **nunca** importa outra feature.
- Consumir capacidade comum é encorajado; duplicar lógica de feature > acoplar features.

## Convenções

- Stack: React + Vite + TypeScript. Sem CSS framework — CSS vars + CSS Modules.
- Arquivo ativo ≤ ~300 linhas; módulo ≤ ~600. Passou → provavelmente são 2.
- Nada de banco/rede: todo estado vive em memória na sessão do navegador.
