// Número (em centavos) por extenso, em português — usado na linha
// "Valor por extenso" do orçamento, como na referência.

const UNIDADES = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove']
const DEZ_A_DEZENOVE = [
  'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze',
  'dezesseis', 'dezessete', 'dezoito', 'dezenove',
]
const DEZENAS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']
const CENTENAS = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos']

// Escalas por grupo de 3 dígitos, da menos para a mais significativa. Cobre
// até 999.999.999 — suficiente para qualquer orçamento realista.
const ESCALAS: ReadonlyArray<readonly [string, string]> = [
  ['', ''],
  ['mil', 'mil'],
  ['milhão', 'milhões'],
]

// Converte um grupo de 0 a 999 em palavras (sem escala).
function grupoPorExtenso(n: number): string {
  if (n === 0) return ''
  if (n === 100) return 'cem'
  const centena = Math.floor(n / 100)
  const resto = n % 100
  const partes: string[] = []
  if (centena > 0) partes.push(CENTENAS[centena])
  if (resto > 0) {
    if (resto < 10) partes.push(UNIDADES[resto])
    else if (resto < 20) partes.push(DEZ_A_DEZENOVE[resto - 10])
    else {
      const dezena = Math.floor(resto / 10)
      const unidade = resto % 10
      partes.push(unidade > 0 ? `${DEZENAS[dezena]} e ${UNIDADES[unidade]}` : DEZENAS[dezena])
    }
  }
  return partes.join(' e ')
}

// Converte um inteiro não-negativo em palavras, unindo os grupos de milhar.
// Regra adotada (cobre o uso corrente em valores monetários): grupos não-finais
// são unidos por vírgula, o último por " e " — ex: "um milhão, duzentos mil e trinta".
function numeroPorExtenso(n: number): string {
  if (n === 0) return 'zero'

  const grupos: number[] = []
  let resto = n
  while (resto > 0) {
    grupos.unshift(resto % 1000)
    resto = Math.floor(resto / 1000)
  }

  const totalGrupos = grupos.length
  const partes: string[] = []
  grupos.forEach((valor, i) => {
    if (valor === 0) return
    const escalaIndex = totalGrupos - 1 - i
    if (escalaIndex === 0) {
      partes.push(grupoPorExtenso(valor))
      return
    }
    if (escalaIndex === 1 && valor === 1) {
      partes.push('mil') // "mil", nunca "um mil"
      return
    }
    const [singular, plural] = ESCALAS[escalaIndex] ?? ['', '']
    partes.push(`${grupoPorExtenso(valor)} ${valor === 1 ? singular : plural}`)
  })

  if (partes.length === 1) return partes[0]
  const cabeca = partes.slice(0, -1).join(', ')
  const cauda = partes[partes.length - 1]
  return `${cabeca} e ${cauda}`
}

// Valor em centavos → frase capitalizada ("Quatro mil e quinhentos reais").
export function extenso(cents: number): string {
  const abs = Math.round(Math.abs(cents))
  const reais = Math.floor(abs / 100)
  const centavos = abs % 100

  const partesFrase: string[] = []
  if (reais > 0 || centavos === 0) {
    partesFrase.push(`${numeroPorExtenso(reais)} ${reais === 1 ? 'real' : 'reais'}`)
  }
  if (centavos > 0) {
    partesFrase.push(`${numeroPorExtenso(centavos)} ${centavos === 1 ? 'centavo' : 'centavos'}`)
  }

  const frase = partesFrase.join(' e ')
  return frase.charAt(0).toUpperCase() + frase.slice(1)
}
