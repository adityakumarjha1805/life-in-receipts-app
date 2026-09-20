import { describe, expect, it } from 'vitest'

describe('search and filtering smoke tests', () => {
    it('supports simple query logic', () => {
        const records = [
            { title: 'Morning playlist', type: 'Music', description: 'Playlist before work' },
            { title: 'Train expense', type: 'Purchases', description: 'Travel costs' },
        ]

        const query = 'playlist'
        const result = records.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query))
        expect(result).toHaveLength(1)
    })
})
