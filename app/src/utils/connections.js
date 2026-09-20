function getMinutesApart(left, right) {
    const leftTime = new Date(left.timestamp).getTime()
    const rightTime = new Date(right.timestamp).getTime()
    return Math.abs(leftTime - rightTime) / 60000
}

export function findConnections(receipts) {
    const edges = []
    const valid = receipts
        .filter((receipt) => receipt && receipt.timestamp && Number.isFinite(new Date(receipt.timestamp).getTime()))
        .sort((left, right) => new Date(left.timestamp).getTime() - new Date(right.timestamp).getTime())

    for (let i = 0; i < valid.length; i += 1) {
        for (let j = i + 1; j < valid.length; j += 1) {
            const left = valid[i]
            const right = valid[j]
            const minutes = getMinutesApart(left, right)

            if (minutes > 90) break

            if (minutes <= 90) {
                edges.push({
                    sourceId: left.id,
                    targetId: right.id,
                    type: 'temporal',
                    reason: 'Connected by time',
                })
            }

            if (left.location && right.location && left.location === right.location) {
                edges.push({
                    sourceId: left.id,
                    targetId: right.id,
                    type: 'location',
                    reason: 'Connected by location',
                })
            }

            if (left.type === right.type && left.type === 'Music') {
                edges.push({
                    sourceId: left.id,
                    targetId: right.id,
                    type: 'behavioral',
                    reason: 'Part of the same activity cluster',
                })
            }

            if (edges.length >= 150) return edges.slice(0, 150)
        }
    }

    return edges.slice(0, 150)
}

export function buildGraphData(receipts) {
    const connections = findConnections(receipts)
    const nodeMap = new Map()

    receipts.forEach((receipt) => {
        nodeMap.set(receipt.id, { ...receipt, connected: 0 })
    })

    connections.forEach((connection) => {
        if (nodeMap.has(connection.sourceId)) nodeMap.get(connection.sourceId).connected += 1
        if (nodeMap.has(connection.targetId)) nodeMap.get(connection.targetId).connected += 1
    })

    return {
        nodes: [...nodeMap.values()]
            .filter((node) => node.connected > 0)
            .sort((a, b) => b.connected - a.connected)
            .slice(0, 18),
        edges: connections.slice(0, 80),
    }
}
