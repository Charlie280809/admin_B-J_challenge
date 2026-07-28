<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '../services/auth.js'
import { deleteOrder, getOrders, updateOrderStatus } from '../services/api.js'
import Order from '../components/Order.vue'
import logo from "../assets/Ben_&_Jerry's.svg.webp"

import CheckCircle from '@primeicons/vue/check-circle';
import SpinnerDotted from '@primeicons/vue/spinner-dotted';
import TimesCircle from '@primeicons/vue/times-circle';

const auth = useAuthStore()
const orders = ref([])

const getToken = () => auth.token || localStorage.getItem('token')

const formatOrder = (order) => ({
    raw: order,
    id: order.id || order._id || order.orderId,
    name:
        order.customerName ||
        order.fullName ||
        order.name ||
        [order.firstName, order.lastName].filter(Boolean).join(' ') ||
        'Naam onbekend',
    date: new Intl.DateTimeFormat('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(order.createdAt || order.date || order.created_at)),
    status: order.statusLabel || order.status || 'Te verwerken',
})

const loadOrders = async () => {
    const token = getToken()

    if (!token) {
        return
    }

    try {
        const response = await getOrders(token)
        const list = Array.isArray(response.data) ? response.data : response.data.orders || []
        orders.value = list.map(formatOrder)
    } catch (err) {
        console.error('Failed to load orders:', err)
    }
}

const nextStatus = (status) => {
    if (status === 'Te verwerken') return 'Verzonden'
    if (status === 'Verzonden') return 'Geannuleerd'
    return 'Te verwerken'
}

const handleCardClick = async (event, order) => {
    const action = event.target.closest('button')?.dataset.action

    if (!action) return

    const token = getToken()
    const orderId = order.id

    if (!token || !orderId) {
        return
    }

    try {
        if (action === 'delete') {
            await deleteOrder(orderId, token)
            orders.value = orders.value.filter((item) => item.id !== orderId)
            return
        }

        const status = nextStatus(order.status)
        await updateOrderStatus(orderId, status, token)
        order.status = status
    } catch (err) {
        console.error('Failed to update order:', err)
    }
}

onMounted(loadOrders)
</script>

<template>
    <div class="dashboard-shell">
        <aside class="sideNav">
            <img :src="logo" alt="Ben & Jerry's logo">

            <button type="button">Alle bestellingen</button>
            <button type="button"> <CheckCircle /> Verzonden</button>
            <button type="button"> <SpinnerDotted /> Te verwerken</button>
            <button type="button"> <TimesCircle /> Geannuleerd</button>

            <button @click="auth.logout" type="button">Uitloggen</button>
        </aside>

        <main class="mainContent">
            <header class="mainContent__header">
                <h2>Bestellingen:</h2>
            </header>

            <div class="order-list">
                <p v-if="!orders.length" class="state-message">Er zijn nog geen bestellingen om te tonen.</p>

                <Order v-for="order in orders" :key="order.id" :name="order.name" :date="order.date"
                    :status="order.status" @click="handleCardClick($event, order)" />
            </div>
        </main>
    </div>
</template>

<style scoped>


.dashboard-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(240px, 280px) 1fr;
    /* background: white; */
}

.sideNav {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 24px;
    background: #f3f4f6;
    box-sizing: border-box;
}

.sideNav img {
    width: 100%;
    height: auto;
    display: block;
    margin-bottom: 10px;
}

.sideNav button {
    padding: 14px 18px;
    border: 0;
    border-radius: 12px;
    background: #ffffff;
    color: #231F20;
    font-family: 'Proxima Nova', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.08);
}

.mainContent {
    padding: 32px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.mainContent__header h2 {
    margin: 0 0 6px;
    font-size: 2rem;
    color: #231F20;
}

.mainContent__header p {
    margin: 0;
    color: #cbd5e1;
}

.order-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.state-message {
    margin: 0;
    padding: 18px 20px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.08);
    color: #f8fafc;
}

.state-message--error {
    background: rgba(185, 28, 28, 0.18);
    color: #fecaca;
}

@media (max-width: 960px) {
    .dashboard-shell {
        grid-template-columns: 1fr;
    }

    .sideNav {
        order: 2;
    }

    .mainContent {
        order: 1;
        padding: 20px;
    }
}
</style>