import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { generateChapters } from '../utils/chapters.js'
import { receipts } from '../data/dataset-loader.js'

export default function Chapters() {
    const chapters = useMemo(() => generateChapters(receipts), [])

    return (
        <main className="page-shell">
            <section className="section-block">
                <div className="section-header"><h2>Life Chapters</h2></div>
                <div className="chapter-list">
                    {chapters.map((chapter) => (
                        <article key={chapter.id} className="chapter-card">
                            <div className="chapter-head">
                                <h3>{chapter.title}</h3>
                                <span>{chapter.receiptCount} receipts</span>
                            </div>
                            <p>{chapter.summary}</p>
                            <div className="chapter-categories">{chapter.categories.map((category) => <span key={category} className="tag">{category}</span>)}</div>
                            <Link to={`/story/${chapter.id}`} className="text-link">Open story</Link>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    )
}
