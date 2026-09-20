const TEXT_UI_PATTERN = /[\u0000-\u001F\u007F]/g

export function normalizeText(value) {
    if (value === null || value === undefined) return ''
    const text = String(value).replace(TEXT_UI_PATTERN, ' ').trim()
    return text.replace(/\s+/g, ' ')
}

export function safeNumber(value) {
    if (value === null || value === undefined || value === '') return null
    const cleaned = String(value).replace(/[^0-9.\-]/g, '')
    if (!cleaned) return null
    const number = Number(cleaned)
    return Number.isFinite(number) ? number : null
}

function parseDateValue(rawValue) {
    const value = normalizeText(rawValue)
    if (!value) return null

    const isoLike = /^\d{4}-\d{2}-\d{2}/
    if (isoLike.test(value)) {
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? null : date
    }

    const slashFormat = /^\d{1,2}\/\d{1,2}\/\d{4}/
    if (slashFormat.test(value)) {
        const datePart = value.split(/\s+/)[0]
        const [day, month, year] = datePart.split('/')
        const date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
        return Number.isNaN(date.getTime()) ? null : date
    }

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

function safeLocation(raw, source) {
    if (source === 'spotify') {
        return normalizeText(raw.platform) || 'Listening Session'
    }

    const note = normalizeText(raw.Note)
    if (/Place\s*\d+/i.test(note)) {
        return note.match(/Place\s*\d+/i)?.[0] || 'Location'
    }
    if (/Permanent Residence/i.test(note)) return 'Permanent Residence'
    if (/Station/i.test(note)) return 'Station'
    if (/Home/i.test(note)) return 'Home'
    return normalizeText(raw.Mode) || 'Expense'
}

function summarizeSpotify(raw) {
    const artist = normalizeText(raw.artist_name)
    const album = normalizeText(raw.album_name)
    const track = normalizeText(raw.track_name)
    const parts = [track, artist, album].filter(Boolean)
    return parts.length ? `${parts[0]} by ${artist || 'artist'}${album ? ` / ${album}` : ''}` : 'Music moment'
}

function summarizeHousehold(raw) {
    const note = normalizeText(raw.Note)
    const category = normalizeText(raw.Category)
    const amount = safeNumber(raw.Amount)
    const detail = [note || category || 'Expense', amount ? `₹${amount}` : null].filter(Boolean).join(' • ')
    return detail || 'Expense record'
}

function metadataSpotify(raw) {
    return {
        platform: normalizeText(raw.platform),
        artist: normalizeText(raw.artist_name),
        album: normalizeText(raw.album_name),
        reasonStart: normalizeText(raw.reason_start),
        reasonEnd: normalizeText(raw.reason_end),
        msPlayed: safeNumber(raw.ms_played),
        shuffle: String(raw.shuffle).toLowerCase() === 'true',
        skipped: String(raw.skipped).toLowerCase() === 'true',
    }
}

function metadataHousehold(raw) {
    return {
        mode: normalizeText(raw.Mode),
        category: normalizeText(raw.Category),
        subcategory: normalizeText(raw.Subcategory),
        amount: safeNumber(raw.Amount),
        currency: normalizeText(raw.Currency),
        incomeExpense: normalizeText(raw['Income/Expense']),
        note: normalizeText(raw.Note),
    }
}

export function normalizeReceipt(raw, source, index = 0) {
    const timestamp = parseDateValue(source === 'spotify' ? raw.ts : raw.Date)
    const type = source === 'spotify' ? 'Music' : (() => {
        const note = normalizeText(raw.Note)
        const category = normalizeText(raw.Category)
        if (/Place|Residence|Station|Home/i.test(`${note} ${category}`)) return 'Places'
        return 'Purchases'
    })()

    const title = source === 'spotify'
        ? normalizeText(raw.track_name) || 'Music moment'
        : normalizeText(raw.Note) || normalizeText(raw.Category) || 'Receipt'

    return {
        id: `${source}-${timestamp ? timestamp.getTime() : index}-${index}`,
        type,
        title,
        timestamp: timestamp ? timestamp.toISOString() : null,
        location: safeLocation(raw, source),
        description: source === 'spotify' ? summarizeSpotify(raw) : summarizeHousehold(raw),
        metadata: source === 'spotify' ? metadataSpotify(raw) : metadataHousehold(raw),
        source,
    }
}

export function sortReceiptsByTimestamp(receipts) {
    return [...receipts].sort((a, b) => {
        const left = a.timestamp ? new Date(a.timestamp).getTime() : 0
        const right = b.timestamp ? new Date(b.timestamp).getTime() : 0
        return left - right
    })
}
