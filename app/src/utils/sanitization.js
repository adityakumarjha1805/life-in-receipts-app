export function sanitizeReceipt(receipt) {
    const safe = { ...receipt }

    const blockedFields = [
        'cc_num',
        'street',
        'dob',
        'lat',
        'long',
        'customer_id',
        'password',
        'token',
        'api_key',
        'secret',
        'card number',
    ]

    Object.keys(safe.metadata || {}).forEach((key) => {
        if (blockedFields.some((field) => key.toLowerCase().includes(field))) {
            safe.metadata[key] = '[redacted]'
        }
    })

    return safe
}
