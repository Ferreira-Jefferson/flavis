import { type ServiceItem, unitPriceCents } from '../domain'
import { formatBRL, formatQty } from '@/shared/money/currency'
import { MoneyInput } from '../MoneyInput'
import styles from '../sections.module.css'
import quoteStyles from '../quote.module.css'

interface Props {
  items: ServiceItem[]
  onAdd: () => void
  onRemove: (id: string) => void
  onUpdate: (id: string, patch: Partial<Omit<ServiceItem, 'id'>>) => void
}

// CRUD dos itens de serviço. O preço unitário é sempre derivado do total
// informado (`unitPriceCents`, de `domain.ts`) — nunca um campo editável,
// para reproduzir o fechamento exato da referência (29 un. x R$ 155,17 =
// R$ 4.500,00, não o contrário).
export function ItemsSection({ items, onAdd, onRemove, onUpdate }: Props) {
  const canRemove = items.length > 1

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Itens do orçamento</h2>

      <div className={styles.itemsList}>
        {items.map((item) => (
          <div key={item.id} className={styles.itemCard}>
            <label className={quoteStyles.field}>
              <span className={quoteStyles.fieldLabel}>Descrição</span>
              <input
                className={quoteStyles.input}
                value={item.description}
                onChange={(e) => onUpdate(item.id, { description: e.target.value })}
                placeholder="Ex: Higienização completa de ar-condicionado"
              />
            </label>

            <label className={quoteStyles.field}>
              <span className={quoteStyles.fieldLabel}>Detalhes</span>
              <textarea
                className={quoteStyles.textarea}
                rows={2}
                value={item.details}
                onChange={(e) => onUpdate(item.id, { details: e.target.value })}
              />
            </label>

            <div className={styles.itemGrid}>
              <label className={quoteStyles.field}>
                <span className={quoteStyles.fieldLabel}>Quantidade</span>
                <input
                  type="number"
                  min={0}
                  step="any"
                  className={quoteStyles.input}
                  value={item.quantity}
                  onChange={(e) => onUpdate(item.id, { quantity: Number(e.target.value) || 0 })}
                />
              </label>
              <label className={quoteStyles.field}>
                <span className={quoteStyles.fieldLabel}>Unidade</span>
                <input
                  className={quoteStyles.input}
                  value={item.unit}
                  onChange={(e) => onUpdate(item.id, { unit: e.target.value })}
                />
              </label>
              <label className={quoteStyles.field}>
                <span className={quoteStyles.fieldLabel}>Valor total</span>
                <MoneyInput
                  className={quoteStyles.input}
                  cents={item.totalCents}
                  onChange={(totalCents) => onUpdate(item.id, { totalCents })}
                />
              </label>
              <div className={quoteStyles.field}>
                <span className={quoteStyles.fieldLabel}>Valor unitário</span>
                <span className={styles.derived}>
                  <strong data-role="unit-price">
                    {formatBRL(unitPriceCents(item.quantity, item.totalCents))}
                  </strong>{' '}
                  para {formatQty(item.quantity)} {item.unit}
                </span>
              </div>
            </div>

            {canRemove && (
              <button
                type="button"
                className={quoteStyles.ghostBtn}
                onClick={() => onRemove(item.id)}
              >
                Remover item
              </button>
            )}
          </div>
        ))}
      </div>

      <button type="button" className={quoteStyles.addBlock} onClick={onAdd}>
        + Adicionar item
      </button>
    </section>
  )
}
