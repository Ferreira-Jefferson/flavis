import { useState } from 'react'
import { isModuleLoadError, markNeedRefresh } from '@/shared/pwa/updatePrompt'
import { useCompany } from '@/shared/identity/useCompany'
import { palette } from '@/shared/ui/tokens'
import { useQuote } from './useQuote'
import { CompanySection } from './sections/CompanySection'
import { QuoteMetaSection } from './sections/QuoteMetaSection'
import { ItemsSection } from './sections/ItemsSection'
import { TotalsSection } from './sections/TotalsSection'
import { NotesSection } from './sections/NotesSection'
import { PhotosSection } from './sections/PhotosSection'
import styles from './quote.module.css'

// Composition root da feature: chama os hooks de estado (useQuote/useCompany)
// e repassa dados/ações como props às 6 seções — nenhuma seção chama hook de
// estado global diretamente (só UI local, ex. recolher/abrir).
export function QuoteEditor() {
  const {
    quote,
    busy,
    setField,
    setPhotoPlacement,
    setDiscountCents,
    addItem,
    removeItem,
    updateItem,
    setNote,
    addNote,
    removeNote,
    addBlock,
    removeBlock,
    setBlockLabel,
    addImages,
    removeImage,
    setLogo,
  } = useQuote()
  const { company, setCompany } = useCompany()
  const [generating, setGenerating] = useState(false)

  const hasCompanyName = company.name.trim().length > 0
  const hasItem = quote.items.some((i) => i.description.trim().length > 0)
  const canDownload = hasCompanyName && hasItem && !generating && !busy

  async function handleDownload() {
    setGenerating(true)
    try {
      // carrega o @react-pdf sob demanda (mantém o carregamento inicial leve)
      const { downloadQuotePdf } = await import('./pdf/generate')
      await downloadQuotePdf(quote, company, palette)
    } catch (err) {
      console.error(err)
      if (isModuleLoadError(err)) {
        // Chunk do PDF ficou desatualizado após um deploy novo: mostra o aviso
        // de atualização (recarregar resolve) em vez de um erro genérico.
        markNeedRefresh()
        alert('Uma nova versão do app foi publicada. Toque em "Atualizar" e baixe o PDF de novo.')
      } else {
        alert('Não foi possível gerar o PDF. Tente novamente.')
      }
    } finally {
      setGenerating(false)
    }
  }

  // A seção de fotos muda de posição no editor junto com `photoPlacement` — o
  // formulário reflete onde as fotos vão entrar no PDF (`antes-da-tabela` fica
  // antes de `ItemsSection`, `apos-totais` entre `TotalsSection` e `NotesSection`;
  // `anexo` — sempre em nova página, por isso depois de `NotesSection` — e o
  // padrão `sem-fotos`, sem posição real no PDF, ficam ao final).
  const photosSection = (
    <PhotosSection
      blocks={quote.blocks}
      photoPlacement={quote.photoPlacement}
      busy={busy}
      onPhotoPlacementChange={setPhotoPlacement}
      onAddBlock={addBlock}
      onRemoveBlock={removeBlock}
      onLabelChange={setBlockLabel}
      onAddImages={addImages}
      onRemoveImage={removeImage}
    />
  )

  return (
    <div className={styles.editor}>
      <CompanySection company={company} onChange={setCompany} onLogoFile={setLogo} busy={busy} />

      <QuoteMetaSection
        number={quote.number}
        issueDate={quote.issueDate}
        validUntil={quote.validUntil}
        responsible={quote.responsible}
        onFieldChange={setField}
      />

      {quote.photoPlacement === 'antes-da-tabela' && photosSection}

      <ItemsSection items={quote.items} onAdd={addItem} onRemove={removeItem} onUpdate={updateItem} />

      <TotalsSection quote={quote} onDiscountChange={setDiscountCents} />

      {quote.photoPlacement === 'apos-totais' && photosSection}

      <NotesSection notes={quote.notes} onChange={setNote} onAdd={addNote} onRemove={removeNote} />

      {(quote.photoPlacement === 'anexo' || quote.photoPlacement === 'sem-fotos') && photosSection}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          onClick={handleDownload}
          disabled={!canDownload}
        >
          {generating ? 'Gerando PDF…' : 'Baixar PDF'}
        </button>
        {!canDownload && !generating && (
          <span className={styles.hint}>
            {busy
              ? 'Processando imagens…'
              : !hasCompanyName
                ? 'Preencha o nome da empresa em "Identidade da empresa".'
                : 'Descreva ao menos um item de serviço.'}
          </span>
        )}
      </div>
    </div>
  )
}
