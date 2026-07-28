import { brandMaxLength } from './brand'
import { useBrand } from './useBrand'
import styles from './brandName.module.css'

const PLACEHOLDER = 'Seu nome'

// Nome do logo, editável no lugar. Vazio = nenhum nome em lugar nenhum
// (o texto de dica é só placeholder e não vai para o PDF).
export function BrandName() {
  const { brand, setBrand, commitBrand } = useBrand()
  return (
    <span className={styles.wrap} data-value={brand || PLACEHOLDER}>
      <input
        className={styles.input}
        value={brand}
        maxLength={brandMaxLength}
        placeholder={PLACEHOLDER}
        aria-label="Nome exibido no logo e no PDF"
        title="Edite o nome que aparece no PDF"
        spellCheck={false}
        autoComplete="off"
        onChange={(e) => setBrand(e.target.value)}
        onBlur={commitBrand}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === 'Escape') e.currentTarget.blur()
        }}
      />
    </span>
  )
}
