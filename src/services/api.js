const API_URL = 'https://api-b-j-challenge.onrender.com'

const authHeaders = (token) => ({ Authorization: `Bearer ${token}` })

async function request(path, token, options = {}) {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            ...authHeaders(token),
            ...(options.body ? { 'Content-Type': 'application/json' } : {}),
            ...(options.headers || {}),
        },
    })

    const text = await response.text()
    let data = null

    if (text) {
        try {
            data = JSON.parse(text)
        } catch {
            data = text
        }
    }

    if (!response.ok) {
        const error = new Error(data?.message || `Request failed with status ${response.status}`)
        error.response = { data, status: response.status }
        throw error
    }

    return { data, status: response.status }
}

export function getOrders(token) {
    return request('/api/orders', token)
}

export function getOrderById(orderId, token) {
    return request(`/api/orders/${orderId}`, token)
}

export function deleteOrder(orderId, token) {
    return request(`/api/orders/${orderId}`, token, { method: 'DELETE' })
}

export function updateOrderStatus(orderId, status, token) {
    return request(`/api/orders/${orderId}`, token, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    })
}