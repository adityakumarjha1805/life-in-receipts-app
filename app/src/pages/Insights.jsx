import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useMemo } from 'react'
import { receipts } from '../data/dataset-loader.js'
import { getStats } from '../utils/insights.js'

export default function Insights() {
    const stats = useMemo(() => getStats(receipts), [])
    const categoryData = stats.categoryCounts.map(([name, count]) => ({ name, count }))
    const hourlyData = stats.hourlyCounts.map(({ hour, value }) => ({ hour, value }))

    return (
        <main className="page-shell">
            <section className="section-block">
                <div className="section-header"><h2>Insights</h2></div>
                <div className="chart-grid">
                    <div className="chart-card">
                        <h3>Activity by category</h3>
                        <div className="chart-wrap">
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2b2d42" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8db8ff" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="chart-card">
                        <h3>Activity by hour</h3>
                        <div className="chart-wrap">
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={hourlyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2b2d42" />
                                    <XAxis dataKey="hour" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#9ae6b4" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
