import { describe, expect, it } from 'vitest'
import { getStats } from './insights.js'

describe('insights statistics', () => {
    it('calculates totals from receipts', () => {
        const receipts = [
            { type: 'Music', timestamp: '2024-11-02T10:00:00.000Z', location: 'Streaming' },
            { type: 'Purchases', timestamp: '2024-11-02T10:05:00.000Z', location: 'Home' },
            { type: 'Music', timestamp: '2024-11-03T10:00:00.000Z', location: 'Streaming' },
        ]

        const stats = getStats(receipts)
        expect(stats.totalReceipts).toBe(3)
        expect(stats.musicMoments).toBe(2)
        expect(stats.purchases).toBe(1)
    })
})
