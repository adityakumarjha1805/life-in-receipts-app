import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout.jsx'
import Discover from './pages/Discover.jsx'
import LifeMap from './pages/LifeMap.jsx'
import Chapters from './pages/Chapters.jsx'
import Receipts from './pages/Receipts.jsx'
import Insights from './pages/Insights.jsx'
import Story from './pages/Story.jsx'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Discover />} />
          <Route path="/life-map" element={<LifeMap />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/story/:chapterId" element={<Story />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
