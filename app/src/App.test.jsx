import { render, screen } from '@testing-library/react'
import App from './App.jsx'

describe('App smoke test', () => {
    it('renders the discover layout and main navigation', () => {
        render(<App />)
        expect(screen.getByText(/Your Life, In Receipts/i)).toBeInTheDocument()
        expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
    })
})
