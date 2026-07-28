import axios from 'axios'

const API_URL = 'https://api-b-j-challenge.onrender.com'

export function login(email, password) {
    return axios.post(`${API_URL}/api/v1/user/auth`, {
        email,
        password
    })
}

export function getBags(token) {
    return axios.get(`${API_URL}/api/v1/bag`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}