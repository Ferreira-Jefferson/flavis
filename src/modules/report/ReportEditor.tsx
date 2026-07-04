import { useState } from 'react'
import { isModuleLoadError, markNeedRefresh } from '@/shared/pwa/updatePrompt'
import { useTheme } from '@/shared/ui/useTheme'
import { type Side } from './domain'
import { useReport } from './useReport'
import { BlockEditor } from './BlockEditor'
import styles from './report.module.css'

export function ReportEditor() {
  const { report, busy, setField, addBlock, removeBlock, setBlockLabel, addImages, removeImage } =
    useReport()
  const { palette } = useTheme()
  const [generating, setGenerating] = useState(false)

  const hasImages = report.blocks.some((b) => b.before.length > 0 || b.after.length > 0)
  const canDownload = report.title.trim().length > 0 && hasImages && !generating && !busy

  async function handleDownload() {
    setGenerating(true)
    try {
      // carrega o @react-pdf sob demanda (mantém o carregamento inicial leve)
      const { downloadReportPdf } = await import('./pdf/generate')
      await downloadReportPdf(report, palette)
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
      <div className={styles.meta}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Título</span>
          <input
            className={styles.input}
            value={report.title}
            maxLength={90}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="Ex: Reforma de cozinha — Apartamento Centro"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Local</span>
          <input
            className={styles.input}
            value={report.location}
            onChange={(e) => setField('location', e.target.value)}
            placeholder="Endereço ou nome do estabelecimento — ex: Rua das Flores, 123"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Descrição</span>
          <textarea
            className={styles.textarea}
            value={report.description}
            rows={3}
            maxLength={220}
            onChange={(e) => setField('description', e.target.value)}
            placeholder="Resumo do serviço realizado"
          />
        </label>
      </div>

      <div className={styles.blocks}>
        {report.blocks.map((block, i) => (
          <BlockEditor
            key={block.id}
            block={block}
            index={i}
            canRemove={report.blocks.length > 1}
            busy={busy}
            onLabelChange={(label) => setBlockLabel(block.id, label)}
            onRemoveBlock={() => removeBlock(block.id)}
            onAddImages={(side: Side, files) => addImages(block.id, side, files)}
            onRemoveImage={(side: Side, id) => removeImage(block.id, side, id)}
          />
        ))}
      </div>

      <button type="button" className={styles.addBlock} onClick={addBlock}>
        + Adicionar bloco antes/depois
      </button>

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
            {busy ? 'Processando imagens…' : 'Preencha o título e adicione ao menos uma imagem.'}
          </span>
        )}
      </div>
    </div>
  )
}
