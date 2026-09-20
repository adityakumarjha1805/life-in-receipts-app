import { useMemo, useState } from 'react'
import { Activity, Clock3, Link2, MapPin, Sparkles } from 'lucide-react'
import { buildGraphData } from '../utils/connections.js'
import { receipts } from '../data/dataset-loader.js'

const nodePositions = [
    [16, 25], [33, 15], [51, 25], [72, 17], [85, 34], [70, 45],
    [48, 42], [25, 48], [12, 68], [34, 77], [56, 70], [79, 75],
    [91, 62], [67, 88], [45, 91], [19, 88], [55, 12], [6, 43],
]

export default function LifeMap() {
    const [selectedId, setSelectedId] = useState(null)
    const graph = useMemo(() => buildGraphData(receipts), [])
    const selected = graph.nodes.find((node) => node.id === selectedId) || graph.nodes[0] || null
    const positionedNodes = graph.nodes.map((node, index) => {
        const [x, y] = nodePositions[index % nodePositions.length]
        return { ...node, x, y }
    })
    const nodesById = new Map(positionedNodes.map((node) => [node.id, node]))
    const selectedConnections = graph.edges
        .filter((edge) => edge.sourceId === selected?.id || edge.targetId === selected?.id)
        .slice(0, 5)

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Undated receipt'
        return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(timestamp))
    }

    return (
        <main className="page-shell life-map-page">
            <section className="life-map-intro">
                <div>
                    <p className="eyebrow">RELATIONSHIP ENGINE / 01</p>
                    <h1>Your life,<br /><em>in orbit.</em></h1>
                    <p className="life-map-lede">A living map of the moments that happened close together, in the same places, and inside the same rituals.</p>
                </div>
                <div className="map-stat-strip" aria-label="Life Map statistics">
                    <div><strong>{positionedNodes.length}</strong><span>signals mapped</span></div>
                    <div><strong>{graph.edges.length}</strong><span>connections found</span></div>
                    <div><strong>3</strong><span>relationship types</span></div>
                </div>
            </section>

            <section className="life-map-workspace">
                <div className="map-heading">
                    <div>
                        <span className="map-kicker"><span className="live-dot" /> LIVE ARCHIVE VIEW</span>
                        <h2>Connected moments</h2>
                    </div>
                    <div className="map-legend" aria-label="Connection legend">
                        <span><i className="legend-dot temporal" /> Time</span>
                        <span><i className="legend-dot location" /> Place</span>
                        <span><i className="legend-dot behavioral" /> Ritual</span>
                    </div>
                </div>

                <div className="graph-layout">
                    <div className="graph-panel" aria-label="Life relationship graph">
                        <div className="graph-coordinates" aria-hidden="true"><span>NOW</span><span>ARCHIVE / 2013—2024</span></div>
                        <svg className="graph-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            {graph.edges.map((edge, index) => {
                                const source = nodesById.get(edge.sourceId)
                                const target = nodesById.get(edge.targetId)
                                if (!source || !target) return null
                                const isSelected = selected?.id === edge.sourceId || selected?.id === edge.targetId
                                return <line key={`${edge.sourceId}-${edge.targetId}-${edge.type}-${index}`} className={`graph-line ${edge.type} ${isSelected ? 'selected' : ''}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} />
                            })}
                        </svg>
                        {positionedNodes.map((node, index) => (
                            <button
                                key={node.id}
                                type="button"
                                className={`graph-node ${selected?.id === node.id ? 'active' : ''}`}
                                onClick={() => setSelectedId(node.id)}
                                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                                aria-label={`Open ${node.title}`}
                            >
                                <span className="node-index">{String(index + 1).padStart(2, '0')}</span>
                                <span className="node-type">{node.type}</span>
                            </button>
                        ))}
                        <div className="graph-center-label"><Sparkles size={14} /> patterns emerge here</div>
                    </div>
                    <aside className="detail-panel map-detail-panel">
                        {selected ? (
                            <>
                                <div className="detail-overline"><span className="tag">{selected.type}</span><span>Signal {String(positionedNodes.findIndex((node) => node.id === selected.id) + 1).padStart(2, '0')}</span></div>
                                <h3>{selected.title}</h3>
                                <p className="detail-description">{selected.description}</p>
                                <div className="detail-facts">
                                    <span><Clock3 size={15} /> {formatDate(selected.timestamp)}</span>
                                    <span><MapPin size={15} /> {selected.location || 'Digital space'}</span>
                                </div>
                                <div className="connection-list">
                                    <div className="connection-list-heading"><span>Why it connects</span><strong>{selectedConnections.length}</strong></div>
                                    {selectedConnections.map((edge, index) => (
                                        <div className="connection-item" key={`${edge.sourceId}-${edge.targetId}-${edge.type}-${index}`}><i className={`legend-dot ${edge.type}`} /><span>{edge.reason}</span><Link2 size={14} /></div>
                                    ))}
                                </div>
                            </>
                        ) : <div className="empty-state"><Activity size={18} /><p>No relationship data</p></div>}
                    </aside>
                </div>
            </section>
        </main>
    )
}
