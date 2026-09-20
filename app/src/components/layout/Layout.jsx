import { NavLink, Outlet } from 'react-router-dom'
import AmbientScene from '../background/AmbientScene.jsx'

const links = [
    { to: '/', label: 'Discover' },
    { to: '/life-map', label: 'Life Map' },
    { to: '/chapters', label: 'Chapters' },
    { to: '/receipts', label: 'Receipts' },
    { to: '/insights', label: 'Insights' },
]

export default function Layout() {
    return (
        <div className="app-shell">
            <AmbientScene />
            <header className="topbar">
                <div className="brand-wrap">
                    <div className="brand-mark">R</div>
                    <div>
                        <p className="brand-name">RECEIPTS</p>
                    </div>
                </div>
                <nav aria-label="Main navigation" className="main-nav">
                    {links.map((link) => (
                        <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </header>
            <Outlet />
            <footer className="site-footer">
                <div className="footer-brand">
                    <span className="footer-mark">R</span>
                    <span>RECEIPTS</span>
                </div>
                <p>Every moment leaves a trace.</p>
                <span className="footer-status"><span className="live-dot" /> ARCHIVE ONLINE</span>
            </footer>
        </div>
    )
}
