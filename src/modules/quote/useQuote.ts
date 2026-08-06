import { useCallback, useState } from 'react'
import { resizeImageFile } from '@/shared/image/resize'
import { setCompany } from '@/shared/identity/company'
import {
  type Block,
  type DocMode,
  type ImageAsset,
  type PhotoPlacement,
  type Quote,
  type ServiceItem,
  type Side,
  MAX_IMAGES_PER_SIDE,
  createBlock,
  createItem,
  createQuote,
  newId,
} from './domain'

type MetaField = 'number' | 'issueDate' | 'validUntil' | 'responsible'

export function useQuote() {
  const [quote, setQuote] = useState<Quote>(createQuote)
  const [busy, setBusy] = useState(false)

  const setField = useCallback((key: MetaField, value: string) => {
    setQuote((q) => ({ ...q, [key]: value }))
  }, [])

  const setMode = useCallback((mode: DocMode) => {
    setQuote((q) => ({ ...q, mode }))
  }, [])

  const setPhotoPlacement = useCallback((photoPlacement: PhotoPlacement) => {
    setQuote((q) => ({ ...q, photoPlacement }))
  }, [])

  const setDiscountCents = useCallback((discountCents: number) => {
    setQuote((q) => ({ ...q, discountCents: Math.max(0, Math.round(discountCents)) }))
  }, [])

  // Itens do orçamento.
  const addItem = useCallback(() => {
    setQuote((q) => ({ ...q, items: [...q.items, createItem()] }))
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setQuote((q) => ({
      ...q,
      items: q.items.length > 1 ? q.items.filter((i) => i.id !== itemId) : q.items,
    }))
  }, [])

  const updateItem = useCallback((itemId: string, patch: Partial<Omit<ServiceItem, 'id'>>) => {
    setQuote((q) => ({
      ...q,
      items: q.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
    }))
  }, [])

  // Observações (bullets editáveis).
  const setNote = useCallback((index: number, value: string) => {
    setQuote((q) => ({
      ...q,
      notes: q.notes.map((n, i) => (i === index ? value : n)),
    }))
  }, [])

  const addNote = useCallback(() => {
    setQuote((q) => ({ ...q, notes: [...q.notes, ''] }))
  }, [])

  const removeNote = useCallback((index: number) => {
    setQuote((q) => ({ ...q, notes: q.notes.filter((_, i) => i !== index) }))
  }, [])

  // Blocos de fotos antes/depois — mesmo padrão de `useReport.ts`.
  const addBlock = useCallback(() => {
    setQuote((q) => ({ ...q, blocks: [...q.blocks, createBlock()] }))
  }, [])

  const removeBlock = useCallback((blockId: string) => {
    setQuote((q) => ({
      ...q,
      blocks: q.blocks.length > 1 ? q.blocks.filter((b) => b.id !== blockId) : q.blocks,
    }))
  }, [])

  const setBlockLabel = useCallback((blockId: string, label: string) => {
    setQuote((q) => ({
      ...q,
      blocks: q.blocks.map((b) => (b.id === blockId ? { ...b, label } : b)),
    }))
  }, [])

  const addImages = useCallback(async (blockId: string, side: Side, files: File[]) => {
    if (files.length === 0) return
    setBusy(true)
    try {
      // Reduz sequencialmente para poupar memória em celulares.
      const resized: ImageAsset[] = []
      for (const file of files) {
        try {
          const img = await resizeImageFile(file)
          resized.push({ id: newId(), ...img })
        } catch {
          // ignora arquivo ilegível (ex: formato não suportado)
        }
      }
      setQuote((q) => ({
        ...q,
        blocks: q.blocks.map((b: Block) => {
          if (b.id !== blockId) return b
          const room = MAX_IMAGES_PER_SIDE - b[side].length
          return room <= 0 ? b : { ...b, [side]: [...b[side], ...resized.slice(0, room)] }
        }),
      }))
    } finally {
      setBusy(false)
    }
  }, [])

  const removeImage = useCallback((blockId: string, side: Side, imageId: string) => {
    setQuote((q) => ({
      ...q,
      blocks: q.blocks.map((b) =>
        b.id === blockId ? { ...b, [side]: b[side].filter((img) => img.id !== imageId) } : b,
      ),
    }))
  }, [])

  // Logo da empresa: redimensiona e delega ao store compartilhado `identity/company`
  // (não duplica o dado — o logo não pertence ao domínio do orçamento).
  const setLogo = useCallback(async (file: File) => {
    setBusy(true)
    try {
      const img = await resizeImageFile(file)
      setCompany({ logoDataUrl: img.dataUrl })
    } finally {
      setBusy(false)
    }
  }, [])

  return {
    quote,
    busy,
    setField,
    setMode,
    setPhotoPlacement,
    setDiscountCents,
    addItem,
    removeItem,
    updateItem,
    setNote,
    addNote,
    removeNote,
    addBlock,
    removeBlock,
    setBlockLabel,
    addImages,
    removeImage,
    setLogo,
  }
}
