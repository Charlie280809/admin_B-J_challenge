import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        loading: false,
    }),
    actions: {
        async login(email, password) {
            this.loading = true;
            try {
                const res = await axios.post('https://api-b-j-challenge.onrender.com/api/login', {
                    email,
                    password
                })

                this.token = res.data.token;
                localStorage.setItem('token', this.token);

                window.location.href = '/dashboard';
            } catch (error) {
                this.error = 'Gelieve een geldig e-mailadres en wachtwoord in te voeren.';
                console.error('Login failed:', error);
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.token = null;
            localStorage.removeItem('token')
            window.location.href = '/login';
        }
    },
});