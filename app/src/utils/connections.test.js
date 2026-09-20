import { describe, expect, it } from 'vitest'
import { findConnections } from './connections.js'

describe('connection detection', () => {
    it('matches receipts within the same time proximity', () => {
        const receipts = [
            { id: 'a', type: 'Music', title: 'Song 1', timestamp: '2024-11-02T10:00:00.000Z', location: 'Streaming' },
            { id: 'b', type: 'Music', title: 'Song 2', timestamp: '2024-11-02T10:15:00.000Z', location: 'Streaming' },
        ]

        const connections = findConnections(receipts)
        expect(connections.some((connection) => connection.sourceId === 'a' && connection.targetId === 'b')).toBe(true)
    })
})
