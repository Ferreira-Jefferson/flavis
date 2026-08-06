import { useState } from 'react'
import { isModuleLoadError, markNeedRefresh } from '@/shared/pwa/updatePrompt'
import { useCompany } from '@/shared/identity/useCompany'
import { useTheme } from '@/shared/ui/useTheme'
import { useQuote } from './useQuote'
import { ModeSection } from './sections/ModeSection'
import { CompanySection } from './sections/CompanySection'
import { QuoteMetaSection } from './sections/QuoteMetaSection'
import { ItemsSection } from './sections/ItemsSection'
import { TotalsSection } from './sections/TotalsSection'
import { NotesSection } from './sections/NotesSection'
import { PhotosSection } from './sections/PhotosSection'
import styles from './quote.module.css'

// Composition root da feature: chama os hooks de estado (useQuote/useCompany/
// useTheme) e repassa dados/ações como props às 7 seções — nenhuma seção
// chama hook de estado global diretamente (só UI local, ex. recolher/abrir).
export function QuoteEditor() {
  const {
    quote,
    busy,
    setField,
    setMode,
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
  const { palette } = useTheme()
  const [generating, setGenerating] = useState(false)

  const canDownload = quote.items.some((i) => i.description.trim().length > 0) && !generating && !busy

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

  return (
    <div className={styles.editor}>
      <ModeSection
        mode={quote.mode}
        photoPlacement={quote.photoPlacement}
        onModeChange={setMode}
        onPhotoPlacementChange={setPhotoPlacement}
      />

      <CompanySection company={company} onChange={setCompany} onLogoFile={setLogo} busy={busy} />

      <QuoteMetaSection
        number={quote.number}
        issueDate={quote.issueDate}
        validUntil={quote.validUntil}
        responsible={quote.responsible}
        onFieldChange={setField}
      />

      <ItemsSection items={quote.items} onAdd={addItem} onRemove={removeItem} onUpdate={updateItem} />

      <TotalsSection quote={quote} onDiscountChange={setDiscountCents} />

      <NotesSection notes={quote.notes} onChange={setNote} onAdd={addNote} onRemove={removeNote} />

      {quote.mode === 'com-registro' && (
        <PhotosSection
          blocks={quote.blocks}
          busy={busy}
          onAddBlock={addBlock}
          onRemoveBlock={removeBlock}
          onLabelChange={setBlockLabel}
          onAddImages={addImages}
          onRemoveImage={removeImage}
        />
      )}

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
            {busy ? 'Processando imagens…' : 'Descreva ao menos um item de serviço.'}
          </span>
        )}
      </div>
    </div>
  )
}
