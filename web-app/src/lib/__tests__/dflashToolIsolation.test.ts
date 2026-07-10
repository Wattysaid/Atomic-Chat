import { describe, expect, it } from 'vitest'

import { shouldSuppressToolsForUpstreamDflash } from '../custom-chat-transport'

function setting(key: string, value: boolean): ProviderSetting {
  return {
    key,
    title: key,
    description: '',
    controller_type: 'checkbox',
    controller_props: { value },
  }
}

describe('shouldSuppressToolsForUpstreamDflash', () => {
  it('suppresses tools for upstream llama.cpp when DFlash is enabled', () => {
    expect(
      shouldSuppressToolsForUpstreamDflash('llamacpp-upstream', [
        setting('dflash', true),
      ])
    ).toBe(true)
  })

  it('keeps tools enabled when upstream DFlash is disabled', () => {
    expect(
      shouldSuppressToolsForUpstreamDflash('llamacpp-upstream', [
        setting('dflash', false),
      ])
    ).toBe(false)
  })

  it('does not suppress tools for other providers', () => {
    expect(
      shouldSuppressToolsForUpstreamDflash('llamacpp', [
        setting('dflash', true),
      ])
    ).toBe(false)
  })
})
