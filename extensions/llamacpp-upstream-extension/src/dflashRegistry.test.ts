import { describe, expect, it } from 'vitest'
import {
  checkDflashSupport,
  listDflashDrafts,
  resolveDflashDraft,
} from './dflashRegistry'

describe('DFlash registry', () => {
  it('matches Qwen3.5-9B model ids with underscore separators', () => {
    const draft = resolveDflashDraft(
      'unsloth/Qwen3_5-9B-GGUF-Qwen3_5-9B-IQ4_XS'
    )

    expect(draft?.repo).toBe('onion515/Qwen3.5-9B-DFlash-GGUF')
    expect(draft?.quant).toBe('Q4_K_M')
    expect(draft?.draftFilename).toBe('qwen3.5-9b-dflash-Q4_K_M.gguf')
  })

  it('lists every published compatible draft quantization', () => {
    expect(listDflashDrafts('Qwen3.5-9B-Instruct')).toHaveLength(5)
    expect(listDflashDrafts('Qwen3.6-27B-Instruct').map((draft) => draft.quant)).toEqual([
      'IQ4_XS',
      'Q4_K_M',
      'Q5_K_M',
      'Q6_K',
      'Q8_0',
      'F16',
    ])
    expect(listDflashDrafts('Qwen3.6-35B-A3B-Instruct')).toHaveLength(6)
  })

  it('resolves a specifically selected quantization', () => {
    const draft = resolveDflashDraft('Qwen3.5-9B-Instruct', 'Q8_0')

    expect(draft?.draftFilename).toBe('qwen3.5-9b-dflash-Q8_0.gguf')
    expect(draft?.draftSize).toBe(1383768256)
  })

  it('matches supported Qwen families across common separators', () => {
    expect(checkDflashSupport('Qwen3.5-9B-Instruct-Q4_K_M')).toBe(true)
    expect(checkDflashSupport('Qwen35-9B-IQ4_XS')).toBe(true)
    expect(checkDflashSupport('Qwen3_6-27B-Q4_K_M')).toBe(true)
    expect(checkDflashSupport('Qwen3-6-35B-A3B-IQ4_XS')).toBe(true)
  })

  it('uses mainline llama.cpp DFlash GGUF repositories', () => {
    expect(resolveDflashDraft('Qwen3.6-27B-Q4_K_M')?.repo).toBe(
      'williamliao/qwen3.6-27B-DFlash-GGUF'
    )
    expect(resolveDflashDraft('Qwen3.6-35B-A3B-Q4_K_M')?.repo).toBe(
      'williamliao/Qwen3.6-35B-A3B-DFlash-GGUF'
    )
  })

  it('does not match unsupported Qwen sizes', () => {
    expect(checkDflashSupport('Qwen3_5-4B-IQ4_XS')).toBe(false)
    expect(checkDflashSupport('Qwen3_6-30B-A3B-IQ4_XS')).toBe(false)
  })
})
