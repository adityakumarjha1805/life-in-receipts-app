import { describe, expect, it } from 'vitest'
import { normalizeReceipt } from '../data/normalize.js'

describe('normalizeReceipt', () => {
    it('removes unsafe fields and keeps a safe normalized receipt', () => {
        const receipt = normalizeReceipt({
            ts: '2013-07-08 02:44:34',
            track_name: 'Say It, Just Say It',
            artist_name: 'The Mowgli\'s',
            album_name: 'Waiting For The Dawn',
            platform: 'web player',
            ms_played: '3185',
            reason_start: 'autoplay',
            reason_end: 'clickrow',
            shuffle: 'FALSE',
            skipped: 'FALSE',
        }, 'spotify', 0)

        expect(receipt.type).toBe('Music')
        expect(receipt.title).toBe('Say It, Just Say It')
        expect(receipt.metadata.platform).toBe('web player')
        expect(receipt.timestamp).toBeTruthy()
    })
})
