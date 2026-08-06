import { useLayoutEffect, useRef, useState } from 'react'
import { formatAmount, parseBRL } from '@/shared/money/currency'
import styles from './moneyInput.module.css'

interface Props {
  id?: string
  className?: string
  cents: number
  onChange: (cents: number) => void
}

// "R$" é um prefixo fixo renderizado fora do <input> — dentro do campo ele
// desaparecia assim que o usuário digitava sobre o texto selecionado.
// Só formata/parseia no blur (mesmo padrão de BrandName.tsx) — reformatar a
// cada tecla reinterpretava dígitos anexados à direita como casas decimais.
export function MoneyInput({ id, className, cents, onChange }: Props) {
  const [draft, setDraft] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const editing = draft !== null

  useLayoutEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  return (
    <div className={`${className ?? ''} ${styles.wrap}`}>
      <span className={styles.prefix} aria-hidden="true">
        R$
      </span>
      <input
        id={id}
        ref={inputRef}
        className={styles.field}
        inputMode="decimal"
        value={editing ? draft : formatAmount(cents)}
        onFocus={() => setDraft(formatAmount(cents))}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          onChange(parseBRL(draft ?? ''))
          setDraft(null)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
        }}
      />
    </div>
  )
}
