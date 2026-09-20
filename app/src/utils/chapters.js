export function generateChapters(receipts) {
    const grouped = new Map()

    receipts.forEach((receipt) => {
        if (!receipt.timestamp) return
        const dateKey = new Date(receipt.timestamp).toISOString().slice(0, 10)
        if (!grouped.has(dateKey)) grouped.set(dateKey, [])
        grouped.get(dateKey).push(receipt)
    })

    return [...grouped.entries()]
        .map(([dateKey, items]) => {
            const safeItems = items.filter((item) => item && item.type)
            const categories = [...new Set(safeItems.map((item) => item.type))]
            const sorted = [...safeItems].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            const first = sorted[0]
            const last = sorted[sorted.length - 1]
            const title = new Date(dateKey).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
            })

            return {
                id: `chapter-${dateKey}`,
                title,
                dateRange: { start: first?.timestamp || dateKey, end: last?.timestamp || dateKey },
                receiptCount: sorted.length,
                categories,
                summary: `${sorted.length} receipts connected across ${categories.join(', ').toLowerCase() || 'activity'}.`,
                receipts: sorted.slice(0, 10),
            }
        })
        .filter((chapter) => chapter.receiptCount > 0)
        .slice(0, 12)
}
