import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { generateChapters } from '../utils/chapters.js'
import { receipts } from '../data/dataset-loader.js'

export default function Story() {
    const { chapterId } = useParams()
    const chapters = useMemo(() => generateChapters(receipts), [])
    const chapter = chapters.find((entry) => entry.id === chapterId) || chapters[0]

    if (!chapter) {
        return <main className="page-shell"><section className="section-block"><h2>No chapter found</h2></section></main>
    }

    return (
        <main className="page-shell story-page">
            <section className="section-block story-intro">
                <p className="eyebrow">Chapter</p>
                <h1>{chapter.title}</h1>
                <p>{chapter.summary}</p>
                <div className="chapter-categories">{chapter.categories.map((category) => <span key={category} className="tag">{category}</span>)}</div>
            </section>

            <section className="story-flow">
                {chapter.receipts.map((receipt, index) => (
                    <article key={receipt.id} className="story-step">
                        <div className="story-ordinal">{index + 1}</div>
                        <div>
                            <h3>{receipt.title}</h3>
                            <p>{receipt.description}</p>
                            <small>{receipt.location}</small>
                        </div>
                    </article>
                ))}
            </section>

            <section className="section-block explanation-panel">
                <h2>Why are these connected?</h2>
                <p>{chapter.summary}</p>
            </section>

            <div className="story-actions">
                <Link to="/chapters" className="text-link">Back to chapters</Link>
                <Link to="/life-map" className="primary-button">View life map</Link>
            </div>
        </main>
    )
}
