import { useLayoutEffect, useRef, useState } from 'react'
import { nameMaxLength } from '../identity/company'
import { useCompany } from '../identity/useCompany'
import styles from './brandName.module.css'

// Nome da empresa exibido no cabeçalho: clicar vira campo de edição.
// O padrão vem preenchido (SF Higienizações); sair do campo em branco mantém
// o valor anterior — o orçamento sempre carrega algum nome de empresa.
export function BrandName() {
  const { company, setCompany } = useCompany()
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
        title="Clique para editar o nome que aparece no orçamento"
        onClick={() => setDraft(company.name)}
      >
        {company.name}
      </button>
    )
  }

  return (
    <span className={styles.wrap} data-value={draft || company.name}>
      <input
        ref={inputRef}
        className={styles.input}
        value={draft}
        maxLength={nameMaxLength}
        placeholder={company.name}
        aria-label="Nome da empresa exibido no orçamento"
        spellCheck={false}
        autoComplete="off"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const trimmed = draft.trim()
          if (trimmed) setCompany({ name: trimmed })
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
