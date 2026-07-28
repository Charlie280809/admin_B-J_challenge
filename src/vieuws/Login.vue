<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const auth = useAuthStore()

const handleLogin = async () => {
    await auth.login(email.value, password.value)
}
</script>

<template>
    <div class="login">
        <h1>Admin Login</h1>

        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />

        <button @click="handleLogin">Login</button>
    </div>
</template>

<style>
.login {
    max-width: 350px;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

input {
    padding: 10px;
}

button {
    padding: 10px;
    cursor: pointer;
}
</style>
