import {defineStore} from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('user') || null,
        user: JSON.parse(localStorage.getItem('user')) || null
    }),
    actions:{
        async login(email, password){
            try {
                const res = await axios.post('https://api-b-j-challenge.onrender.com/api/v1/user/auth', {
                    email,
                    password
                })

                this.token = res.data.token;
                this.user = res.data.user;

                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(res.data));

                window.location.href = '/dashboard';
            } catch (error) {
                alert('Wrong email or password');
                console.error('Login failed:', error);
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            localStorage.clear();
            window.location.href = '/login';
        }
    }
    // actions: {
    //     setToken(token) {
    //         this.token = token;
    //         localStorage.setItem('user', JSON.stringify(token));
    //     },
    //     setUser(user) {
    //         this.user = user;
    //         localStorage.setItem('user', JSON.stringify(user));
    //     },
    //     logout() {
    //         this.token = null;
    //         this.user = null;
    //         localStorage.removeItem('user');
    //     }
    // }
});

// export default useAuthStore;