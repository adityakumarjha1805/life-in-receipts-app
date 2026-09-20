import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Music2, MapPin, ShoppingBag, Camera, CalendarRange, MessageSquareText, Search, Sparkles } from 'lucide-react'
import { receipts } from '../data/dataset-loader.js'
import { getInsights, getStats } from '../utils/insights.js'

const palette = {
    Music: '#b9d0ff',
    Places: '#ffd6b3',
    Purchases: '#c8f0d2',
    Photos: '#f7d4f2',
    Events: '#d7d2ff',
    Messages: '#fecaca',
    Searches: '#fef3c7',
}

const categoryList = [
    { key: 'Music', label: 'Music', icon: Music2 },
    { key: 'Places', label: 'Places', icon: MapPin },
    { key: 'Purchases', label: 'Purchases', icon: ShoppingBag },
    { key: 'Photos', label: 'Photos', icon: Camera },
    { key: 'Events', label: 'Events', icon: CalendarRange },
    { key: 'Messages', label: 'Messages', icon: MessageSquareText },
    { key: 'Searches', label: 'Searches', icon: Search },
]

export default function Discover() {
    const stats = useMemo(() => getStats(receipts), [])
    const insights = useMemo(() => getInsights(receipts), [])

    return (
        <main className="page-shell discover-page">
            <section className="hero-panel">
                <div>
                    <p className="eyebrow">RECEIPTS</p>
                    <h1>Your Life, In Receipts.</h1>
                    <p className="subtitle">Thousands of tiny moments. Connected into stories.</p>
                </div>
                <div className="hero-metrics" aria-label="life statistics overview">
                    <div className="metric-card"><span>Total receipts</span><strong>{stats.totalReceipts}</strong></div>
                    <div className="metric-card"><span>Music moments</span><strong>{stats.musicMoments}</strong></div>
                    <div className="metric-card"><span>Places</span><strong>{stats.places}</strong></div>
                    <div className="metric-card"><span>Purchases</span><strong>{stats.purchases}</strong></div>
                </div>
            </section>

            <section className="section-block">
                <div className="section-header">
                    <h2>Digital Journey</h2>
                    <Link to="/chapters" className="text-link">View chapter story</Link>
                </div>
                <div className="insights-grid">
                    {insights.map((insight) => (
                        <article key={insight.title} className="insight-card">
                            <div className="icon-wrap"><Sparkles size={18} /></div>
                            <h3>{insight.title}</h3>
                            <p>{insight.detail}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="section-block">
                <div className="section-header">
                    <h2>Category snapshot</h2>
                </div>
                <div className="category-grid">
                    {categoryList.map(({ key, label, icon: Icon }) => {
                        const valueKey = key === 'Music' ? 'musicMoments' : key === 'Places' ? 'places' : key === 'Purchases' ? 'purchases' : key.toLowerCase()
                        const count = stats[valueKey] ?? 0
                        return (
                            <div key={key} className="category-chip" style={{ background: palette[key] || '#dfe7ff' }}>
                                <span><Icon size={16} /></span>
                                <strong>{label}</strong>
                                <small>{count}</small>
                            </div>
                        )
                    })}
                </div>
            </section>
        </main>
    )
}
