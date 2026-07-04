import { useEffect, useState } from 'react'
import { applyUpdate, subscribeUpdate } from '@/shared/pwa/updatePrompt'
import styles from './updateBanner.module.css'

// Aviso discreto quando há uma versão nova publicada. Trocar de versão só
// acontece quando o usuário toca em "Atualizar" — nada é recarregado sozinho,
// então o trabalho em andamento não se perde.
export function UpdateBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => subscribeUpdate(setShow), [])

  if (!show) return null

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <span className={styles.text}>Nova versão disponível.</span>
      <button type="button" className={styles.button} onClick={applyUpdate}>
        Atualizar
      </button>
    </div>
  )
}
