export function getStats(receipts) {
    const categoryCounts = new Map()
    const locationCounts = new Map()
    const hourlyCounts = new Map(Array.from({ length: 24 }, (_, index) => [String(index), 0]))

    receipts.forEach((receipt) => {
        const type = receipt.type || 'Other'
        categoryCounts.set(type, (categoryCounts.get(type) || 0) + 1)

        const location = receipt.location || 'Unknown'
        locationCounts.set(location, (locationCounts.get(location) || 0) + 1)

        if (receipt.timestamp) {
            const date = new Date(receipt.timestamp)
            if (!Number.isNaN(date.getTime())) {
                const hour = String(date.getHours())
                hourlyCounts.set(hour, (hourlyCounts.get(hour) || 0) + 1)
            }
        }
    })

    const dates = receipts
        .map((receipt) => (receipt.timestamp ? new Date(receipt.timestamp) : null))
        .filter((date) => date && !Number.isNaN(date.getTime()))
        .sort((a, b) => a.getTime() - b.getTime())

    const categoryList = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])
    const locationList = [...locationCounts.entries()].sort((a, b) => b[1] - a[1])

    const mainCategory = categoryList[0]
    const mainLocation = locationList[0]

    return {
        totalReceipts: receipts.length,
        musicMoments: categoryCounts.get('Music') || 0,
        places: categoryCounts.get('Places') || 0,
        purchases: categoryCounts.get('Purchases') || 0,
        photos: categoryCounts.get('Photos') || 0,
        events: categoryCounts.get('Events') || 0,
        messages: categoryCounts.get('Messages') || 0,
        searches: categoryCounts.get('Searches') || 0,
        dateRange: dates.length ? { start: dates[0].toISOString(), end: dates[dates.length - 1].toISOString() } : null,
        topCategory: mainCategory ? { name: mainCategory[0], count: mainCategory[1] } : null,
        topLocation: mainLocation ? { name: mainLocation[0], count: mainLocation[1] } : null,
        categoryCounts: categoryList,
        locationCounts: locationList,
        hourlyCounts: [...hourlyCounts.entries()].map(([hour, value]) => ({ hour, value })),
    }
}

export function getInsights(receipts) {
    const stats = getStats(receipts)
    const insights = []

    if (stats.topCategory) {
        insights.push({
            title: 'Most common activity',
            detail: `${stats.topCategory.name} is the most frequent category with ${stats.topCategory.count} receipts.`,
        })
    }

    if (stats.topLocation) {
        insights.push({
            title: 'Most visited location',
            detail: `${stats.topLocation.name} appears in ${stats.topLocation.count} receipt moments.`,
        })
    }

    if (stats.musicMoments > 0) {
        insights.push({
            title: 'Music footprint',
            detail: `${stats.musicMoments} listening receipts are tied directly to album and artist data.`,
        })
    }

    if (stats.purchases > 0) {
        insights.push({
            title: 'Spend pattern',
            detail: `${stats.purchases} purchase records show recurring household spending behavior.`,
        })
    }

    if (stats.dateRange) {
        const start = new Date(stats.dateRange.start)
        const end = new Date(stats.dateRange.end)
        insights.push({
            title: 'Date range',
            detail: `${start.toLocaleDateString()} to ${end.toLocaleDateString()} across the available archive.`,
        })
    }

    return insights.slice(0, 5)
}
