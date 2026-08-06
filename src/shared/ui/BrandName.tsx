import { appFallbackName } from '../identity/company'
import { useCompany } from '../identity/useCompany'
import styles from './brandName.module.css'

// Nome da empresa exibido no cabeçalho — só leitura. A edição acontece na
// seção "Identidade da empresa" do editor (fonte única de edição do nome).
export function BrandName() {
  const { company } = useCompany()
  return <span className={styles.display}>{company.name || appFallbackName}</span>
}
