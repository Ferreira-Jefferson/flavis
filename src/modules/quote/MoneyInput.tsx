import { useLayoutEffect, useRef, useState } from 'react'
import { formatBRL, parseBRL } from '@/shared/money/currency'

interface Props {
  id?: string
  className?: string
  cents: number
  onChange: (cents: number) => void
}

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
    <input
      id={id}
      ref={inputRef}
      className={className}
      inputMode="decimal"
      value={editing ? draft : formatBRL(cents)}
      onFocus={() => setDraft(formatBRL(cents))}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        onChange(parseBRL(draft ?? ''))
        setDraft(null)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
      }}
    />
  )
}
