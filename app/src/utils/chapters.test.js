import { describe, expect, it } from 'vitest'
import { generateChapters } from './chapters.js'

describe('chapter generation', () => {
    it('groups receipts by date into a chapter', () => {
        const receipts = [
            { id: '1', type: 'Music', title: 'Song', timestamp: '2024-11-02T10:00:00.000Z' },
            { id: '2', type: 'Purchases', title: 'Groceries', timestamp: '2024-11-02T12:00:00.000Z' },
        ]

        const chapters = generateChapters(receipts)
        expect(chapters.length).toBeGreaterThan(0)
        expect(chapters[0].receiptCount).toBe(2)
    })
})
