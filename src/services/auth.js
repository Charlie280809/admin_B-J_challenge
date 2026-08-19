import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        loading: false,
        error: ''
    }),
    actions: {
        async login(email, password) {
            this.loading = true;
            try {
                const response = await fetch('https://api-b-j-challenge.onrender.com/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                })

                const data = await response.json()
                if (!response.ok) throw new Error(data?.message || 'Login failed')

                this.token = data.token;
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