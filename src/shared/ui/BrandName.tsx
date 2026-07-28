import { useLayoutEffect, useRef, useState } from 'react'
import { appName, brandMaxLength } from './brand'
import { useBrand } from './useBrand'
import styles from './brandName.module.css'

// Logo em texto: mostra o nome do app e, ao clicar, vira campo de edição.
// Sair do campo sem digitar nada volta ao nome do app; digitando, o nome do
// usuário passa a valer aqui e no PDF.
export function BrandName() {
  const { brand, setBrand } = useBrand()
  const [draft, setDraft] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const editing = draft !== null

  useLayoutEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  if (!editing) {
    return (
      <button
        type="button"
        className={styles.display}
        title="Clique para editar o nome que aparece no PDF"
        onClick={() => setDraft(brand)}
      >
        {brand || appName}
      </button>
    )
  }

  return (
    <span className={styles.wrap} data-value={draft || appName}>
      <input
        ref={inputRef}
        className={styles.input}
        value={draft}
        maxLength={brandMaxLength}
        placeholder={appName}
        aria-label="Nome exibido no logo e no PDF"
        spellCheck={false}
        autoComplete="off"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setBrand(draft)
          setDraft(null)
        }}
        onKeyDown={(e) => {
          // Esc descarta a edição; Enter confirma (pelo blur).
          if (e.key === 'Escape') setDraft(null)
          else if (e.key === 'Enter') e.currentTarget.blur()
        }}
      />
    </span>
  )
}
