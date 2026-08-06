import { QuoteEditor } from '@/modules/quote/QuoteEditor'
import { useCompany } from '@/shared/identity/useCompany'
import { BrandName } from '@/shared/ui/BrandName'
import { UpdateBanner } from '@/shared/ui/UpdateBanner'

export function App() {
  const { company } = useCompany()
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
        {company.tagline && <p className="tagline">{company.tagline}</p>}
      </header>
      <main className="appMain">
        <QuoteEditor />
      </main>
    </div>
  )
}
