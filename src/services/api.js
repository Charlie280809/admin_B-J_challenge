import axios from 'axios'

const API_URL = 'https://api-b-j-challenge.onrender.com'

export function login(email, password) {
    return axios.post(`${API_URL}/api/login`, {
        email,
        password
    })
}

export function getOrders(token) {
    return axios.get(`${API_URL}/api/orders`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}