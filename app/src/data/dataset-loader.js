import spotifyCsv from './datasets/spotify_history.csv?raw'
import householdCsv from './datasets/Daily Household Transactions.csv?raw'
import { normalizeReceipt } from './normalize.js'

function parseCsvLine(line) {
    const values = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i]
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"'
                i += 1
            } else {
                inQuotes = !inQuotes
            }
        } else if (char === ',' && !inQuotes) {
            values.push(current)
            current = ''
        } else {
            current += char
        }
    }

    values.push(current)
    return values.map((value) => value.trim())
}

function parseCsvText(text) {
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0)
    if (!lines.length) return []

    const headers = parseCsvLine(lines[0])
    return lines.slice(1).map((line) => {
        const values = parseCsvLine(line)
        const row = {}
        headers.forEach((header, index) => {
            row[header] = values[index] ?? ''
        })
        return row
    })
}

function loadSourceRecords(sourceText, source) {
    return parseCsvText(sourceText).map((record, index) => normalizeReceipt(record, source, index))
}

export function loadReceipts() {
    const spotifyRecords = loadSourceRecords(spotifyCsv, 'spotify')
    const householdRecords = loadSourceRecords(householdCsv, 'household')
    return [...spotifyRecords, ...householdRecords].sort((a, b) => {
        const left = a.timestamp ? new Date(a.timestamp).getTime() : 0
        const right = b.timestamp ? new Date(b.timestamp).getTime() : 0
        return left - right
    })
}

export const receipts = loadReceipts()
