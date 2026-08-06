import { QuoteEditor } from '@/modules/quote/QuoteEditor'
import { BrandName } from '@/shared/ui/BrandName'
import { ThemePicker } from '@/shared/ui/ThemePicker'
import { UpdateBanner } from '@/shared/ui/UpdateBanner'

export function App() {
  return (
    <div className="app">
      <UpdateBanner />
      <header className="appHeader">
        <div className="brand">
          <svg className="brandMark" viewBox="0 0 512 512" aria-hidden="true">
            <rect width="512" height="512" rx="112" fill="currentColor" />
            <rect
              x="150"
              y="150"
              width="212"
              height="212"
              rx="14"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="22"
            />
            <rect x="246" y="150" width="20" height="212" fill="#FFFFFF" opacity="0.9" />
          </svg>
          <BrandName />
        </div>
        <p className="tagline">Orçamentos profissionais, com ou sem registro fotográfico</p>
        <div className="headerActions">
          <ThemePicker />
        </div>
      </header>
      <main className="appMain">
        <QuoteEditor />
      </main>
    </div>
  )
}
