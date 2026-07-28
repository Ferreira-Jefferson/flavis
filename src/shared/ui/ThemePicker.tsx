import { type CSSProperties } from 'react'
import { themes } from './tokens'
import { useTheme } from './useTheme'
import styles from './themePicker.module.css'

// Seletor de cor do tema: uma amostra sem cor + amostras pastel.
// Trocar aqui muda a página e o PDF.
export function ThemePicker() {
  const { themeId, setTheme } = useTheme()
  return (
    <div className={styles.picker} role="radiogroup" aria-label="Cor do tema">
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={t.id === themeId}
          aria-label={t.label}
          title={t.label}
          className={[styles.swatch, t.neutral && styles.none, t.id === themeId && styles.active]
            .filter(Boolean)
            .join(' ')}
          style={{ '--sw': t.palette.accent } as CSSProperties}
          onClick={() => setTheme(t.id)}
        />
      ))}
    </div>
  )
}
