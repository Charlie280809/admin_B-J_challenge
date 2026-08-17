<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../services/auth.js'

const email = ref('')
const password = ref('')
const auth = useAuthStore()

const handleLogin = async () => {
    if (auth.loading) return
    await auth.login(email.value, password.value)
}
</script>

<template>
    <div class="login-page">
        <div class="login">
            <h1>Admin Login</h1>
            <label for="email">
                E-mail
                <input id="email" class="form-input" v-model="email" type="email" placeholder="E-mail"
                    :disabled="auth.loading" />
            </label>

            <label for="password">
                Wachtwoord
                <input id="password" class="form-input" v-model="password" type="password" placeholder="Wachtwoord"
                    :disabled="auth.loading" @keyup.enter="handleLogin" />
            </label>

            <button @click="handleLogin" :disabled="auth.loading || !email || !password">
                <span v-if="auth.loading" class="spinner"></span>
                <span>{{ auth.loading ? 'Inloggen...' : 'Inloggen' }}</span>
            </button>

            <p v-if="auth.error" class="error-message">{{ auth.error }}</p>
        </div>
    </div>
</template>

<style>
.login button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 18px;
    width: 80%;
    border: 0;
    border-radius: 999px;
    background: var(--gold);
    font-family: 'ChunkFive', sans-serif;
    font-size: 1.1rem;
    cursor: pointer;
    margin: 0 auto;
    transition: background 0.2s ease, transform 0.15s ease;
}

.login button:disabled {
    background-color: lightgrey;
    cursor: not-allowed;
}

.login button:hover:not(:disabled) {
    background: #F1DA50;
    transform: translateY(-1px);
}

.login button:active:not(:disabled) {
    transform: translateY(1px);
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(35, 31, 32, 0.25);
    border-top-color: var(--black);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.login-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url(../assets/background.svg);
    background-size: cover;
    background-position: bottom;
    font-family: 'Proxima Nova', sans-serif;
}

.login h1 {
    margin: 0 0 32px 0;
    font-family: 'ChunkFive', sans-serif;
    font-size: 2rem;
    color: var(--black);
    text-align: center;
}

label {
    font-size: 1.1rem;
}

.form-input {
    width: 100%;
    padding: 14px 16px;
    margin-bottom: 24px;
    border: 2px solid #d9d9d9;
    border-radius: 12px;
    font-size: 1rem;
    font-family: 'Proxima Nova', sans-serif;
    color: var(--black);
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input::placeholder {
    color: #8a8f98;
}

.form-input:focus {
    border-color: var(--darkblue);
    box-shadow: 0 0 0 3px rgba(0, 47, 135, 0.15);
}

.error-message {
    color: var(--darkred);
    text-align: center;
    margin-top: 18px;
}
</style>
