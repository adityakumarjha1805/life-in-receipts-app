import { useMemo, useState } from 'react'
import { receipts } from '../data/dataset-loader.js'

const categoryOptions = ['All', 'Music', 'Places', 'Purchases', 'Photos', 'Events', 'Messages', 'Searches']

export default function Receipts() {
    const [query, setQuery] = useState('')
    const [category, setCategory] = useState('All')
    const [page, setPage] = useState(1)
    const [selectedId, setSelectedId] = useState(null)

    const filtered = useMemo(() => {
        const search = query.trim().toLowerCase()
        return receipts.filter((receipt) => {
            const matchesCategory = category === 'All' || receipt.type === category
            const haystack = `${receipt.title} ${receipt.description} ${receipt.location}`.toLowerCase()
            const matchesQuery = !search || haystack.includes(search)
            return matchesCategory && matchesQuery
        })
    }, [category, query])

    const totalPages = Math.max(1, Math.ceil(filtered.length / 8))
    const visible = filtered.slice((page - 1) * 8, page * 8)
    const selected = filtered.find((receipt) => receipt.id === selectedId) || visible[0] || null

    return (
        <main className="page-shell">
            <section className="section-block filters-panel">
                <div className="filter-row">
                    <label>
                        Search
                        <input aria-label="Search receipts" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Track, note, location..." />
                    </label>
                    <label>
                        Category
                        <select aria-label="Filter receipts by category" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1) }}>
                            {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                    </label>
                </div>
            </section>

            <section className="receipt-layout">
                <div className="receipt-list">
                    {visible.length ? visible.map((receipt) => (
                        <button key={receipt.id} className={`receipt-card ${selected?.id === receipt.id ? 'active' : ''}`} type="button" onClick={() => setSelectedId(receipt.id)}>
                            <div className="receipt-meta"><span>{receipt.type}</span><time>{receipt.timestamp ? new Date(receipt.timestamp).toLocaleString() : 'Unknown date'}</time></div>
                            <h3>{receipt.title}</h3>
                            <p>{receipt.description}</p>
                            <small>{receipt.location}</small>
                        </button>
                    )) : <div className="empty-state"><h3>No receipts match</h3><p>Try a different search or category filter.</p></div>}

                    {filtered.length > 0 && (
                        <div className="pagination" aria-label="Receipt pagination">
                            <button type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
                            <span>Page {page} of {totalPages}</span>
                            <button type="button" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</button>
                        </div>
                    )}
                </div>

                <aside className="receipt-detail">
                    {selected ? (
                        <>
                            <div className="detail-header">
                                <span className="tag">{selected.type}</span>
                                <h2>{selected.title}</h2>
                            </div>
                            <p>{selected.description}</p>
                            <dl>
                                <div><dt>When</dt><dd>{selected.timestamp ? new Date(selected.timestamp).toLocaleString() : 'Unknown time'}</dd></div>
                                <div><dt>Where</dt><dd>{selected.location}</dd></div>
                                <div><dt>Source</dt><dd>{selected.source}</dd></div>
                            </dl>
                        </>
                    ) : <div className="empty-state"><h3>Select a receipt</h3><p>Details will appear here.</p></div>}
                </aside>
            </section>
        </main>
    )
}
