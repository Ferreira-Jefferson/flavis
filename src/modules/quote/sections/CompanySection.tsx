import { useRef, useState } from 'react'
import { type Company, appFallbackName, defaultLogoUrl, nameMaxLength } from '@/shared/identity/company'
import styles from '../sections.module.css'
import quoteStyles from '../quote.module.css'

interface Props {
  company: Company
  onChange: (patch: Partial<Company>) => void
  onLogoFile: (file: File) => void
  busy: boolean
}

// Identidade da empresa exibida no orçamento: recolhível (some não atrapalha o
// fluxo principal de preencher itens), com upload de logo e edição de
// nome/contatos. Componente presentational puro — quem lê/grava o store
// `company` é `QuoteEditor.tsx` (composition root), mesma convenção que
// `report/ReportEditor.tsx` já usa hoje para `BlockEditor`/`ImageSlots`.
export function CompanySection({ company, onChange, onLogoFile, busy }: Props) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <section className={styles.section}>
      <div className={styles.companyHeader}>
        <h2 className={styles.sectionTitle}>Identidade da empresa</h2>
        <button
          type="button"
          className={styles.companyToggle}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Recolher' : 'Editar'}
        </button>
      </div>

      {open && (
        <div className={styles.companyBody}>
          <div className={styles.logoRow}>
            <img
              className={styles.logoPreview}
              src={company.logoDataUrl ?? defaultLogoUrl}
              alt="Logo da empresa"
            />
            <button
              type="button"
              className={quoteStyles.ghostBtn}
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              Trocar logo
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) onLogoFile(file)
                e.target.value = ''
              }}
            />
          </div>

          <div className={styles.companyGrid}>
            <label className={quoteStyles.field}>
              <span className={quoteStyles.fieldLabel}>Nome</span>
              <input
                className={quoteStyles.input}
                value={company.name}
                maxLength={nameMaxLength}
                placeholder={appFallbackName}
                onChange={(e) => onChange({ name: e.target.value })}
              />
            </label>
            <label className={quoteStyles.field}>
              <span className={quoteStyles.fieldLabel}>Slogan</span>
              <input
                className={quoteStyles.input}
                value={company.tagline}
                onChange={(e) => onChange({ tagline: e.target.value })}
              />
            </label>
            <label className={quoteStyles.field}>
              <span className={quoteStyles.fieldLabel}>Telefone</span>
              <input
                className={quoteStyles.input}
                value={company.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
              />
            </label>
            <label className={quoteStyles.field}>
              <span className={quoteStyles.fieldLabel}>E-mail</span>
              <input
                className={quoteStyles.input}
                value={company.email}
                onChange={(e) => onChange({ email: e.target.value })}
              />
            </label>
            <label className={quoteStyles.field}>
              <span className={quoteStyles.fieldLabel}>Cidade</span>
              <input
                className={quoteStyles.input}
                value={company.city}
                onChange={(e) => onChange({ city: e.target.value })}
              />
            </label>
          </div>
        </div>
      )}
    </section>
  )
}
