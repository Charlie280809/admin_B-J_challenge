<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../services/auth.js'
import { deleteOrder, getOrders, updateOrderStatus } from '../services/api.js'
import Order from '../components/Order.vue'
import logo from "../assets/Ben_&_Jerry's.svg.webp"

import List from '@primeicons/vue/list';
import CheckCircle from '@primeicons/vue/check-circle';
import SpinnerDotted from '@primeicons/vue/spinner-dotted';
import TimesCircle from '@primeicons/vue/times-circle';
import SignOut from '@primeicons/vue/sign-out';

const auth = useAuthStore()
const router = useRouter()
const orders = ref([])
const loading = ref(true)
const sortOrder = ref('newest')
const selectedStatus = ref(null)

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
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(order.createdAt || order.date || order.created_at)),
    status: order.statusLabel || order.status || 'Te verwerken',
})

const loadOrders = async () => {
    const token = getToken()

    if (!token) {
        loading.value = false
        return
    }

    try {
        const response = await getOrders(token)
        const list = Array.isArray(response.data) ? response.data : response.data.orders || []
        orders.value = list.map(formatOrder)
    } catch (err) {
        console.error('Failed to load orders:', err)
    } finally {
        loading.value = false
    }
}

const handleDelete = async (order) => {
    const token = getToken()
    const orderId = order.id

    if (!token || !orderId) {
        return
    }

    try {
        await deleteOrder(orderId, token)
        orders.value = orders.value.filter((item) => item.id !== orderId)
    } catch (err) {
        console.error('Failed to delete order:', err)
    }
}

const handleStatus = async (order, status) => {
    const token = getToken()
    const orderId = order.id

    if (!token || !orderId || !status) {
        return
    }

    try {
        await updateOrderStatus(orderId, status, token)
        order.status = status
    } catch (err) {
        console.error('Failed to update order:', err)
    }
}

const handleOpen = (order) => {
    if (!order?.id) {
        return
    }

    router.push({ name: 'detail', params: { id: order.id } })
}

const selectStatus = (status) => { selectedStatus.value = status }

const sortedOrders = computed(() => {
    let list = [...orders.value]
    if (selectedStatus.value) {
        list = list.filter((order) => order.status === selectedStatus.value)
    }
    return list.sort((a, b) => {
        const dateA = new Date(a.raw.createdAt || a.raw.date || a.raw.created_at)
        const dateB = new Date(b.raw.createdAt || b.raw.date || b.raw.created_at)
        return sortOrder.value === 'newest' ? dateB - dateA : dateA - dateB
    })
})

const handleLogout = () => {
    auth.logout()
}

onMounted(loadOrders) </script>

<template>
    <div class="dashboard-shell">
        <aside class="sideNav">
            <img :src="logo" alt="Ben & Jerry's logo">

            <button type="button" :class="{ active: selectedStatus === null }" @click="selectStatus(null)">
                <List /> Alle bestellingen
            </button>

            <button type="button" :class="{ active: selectedStatus === 'Verzonden' }"
                @click="selectStatus('Verzonden')">
                <CheckCircle /> Verzonden
            </button>
            <button type="button" :class="{ active: selectedStatus === 'Te verwerken' }"
                @click="selectStatus('Te verwerken')">
                <SpinnerDotted /> Te verwerken
            </button>
            <button type="button" :class="{ active: selectedStatus === 'Geannuleerd' }"
                @click="selectStatus('Geannuleerd')">
                <TimesCircle /> Geannuleerd
            </button>

            <button class="logoutBtn" @click="handleLogout" type="button">
                <SignOut /> Uitloggen
            </button>
        </aside>

        <main class="mainContent">
            <header class="mainContent_top">
                <div>
                    <h2>Dashboard</h2>
                    <p>{{ sortedOrders.length }} bestellingen:</p>
                </div>
                <button type="button" class="sort-btn"
                    @click="sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest'">
                    {{ sortOrder === 'newest' ? '↑↓ Nieuwste eerst' : '↓↑ Oudste eerst' }}
                </button>

            </header>

            <div class="order-list">
                <p v-if="loading" class="state-message">Bestellingen worden geladen...</p>
                <p v-else-if="!orders.length" class="state-message">Er zijn nog geen bestellingen</p>

                <Order v-for="order in sortedOrders" :key="order.id" :name="order.name" :date="order.date"
                    :status="order.status" :address="order.raw.address" @select="handleOpen(order)"
                    @delete="handleDelete(order)" @status="handleStatus(order, $event)" />
            </div>
        </main>
    </div>
</template>

<style scoped>
.dashboard-shell {
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(240px, 280px) 1fr;
    margin: 0;
    padding: 0;
    font-family: 'Proxima Nova', sans-serif;
}

.sideNav {
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 24px;
    background: #cfe3ef;
    position: sticky;
    top: 0;
}

.sideNav img {
    width: 100%;
    height: auto;
    display: block;
    margin-bottom: 10px;
}

.sideNav button {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    border: 0;
    border-radius: 12px;
    background: white;
    color: #231F20;
    font-family: 'Proxima Nova', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(16, 24, 40, 0.08);
}

.sideNav button:hover {
    background: #f5f7fc;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    transition: all 0.2s ease-in-out;
}

.sideNav button.active {
    border: 2px solid var(--darkblue);
    transform: translateY(0);
    transition: all 0.1s ease-in-out;
}

.sideNav .logoutBtn {
    margin-top: auto;
    background-color: rgba(0, 47, 135, 0.2);
}

.sideNav .logoutBtn:hover {
    background-color: rgba(0, 47, 135, 0.4);
}

.mainContent {
    padding: 32px 24px 32px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 22px;
}

.mainContent_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
}

.mainContent_top h2 {
    margin: 0 0 20px;
    font-family: 'ChunkFive', sans-serif;
    font-size: 2.3rem;
    color: #231F20;
}

.mainContent_top p {
    margin: 0;
    font-size: 1.1rem;
    color: #6B7280;
}

.sort-btn {
    padding: 8px 16px;
    border: 2px solid var(--blue);
    border-radius: 8px;
    background: white;
    cursor: pointer;
    font-family: 'Proxima Nova', sans-serif;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s;
    margin-bottom: 16px;
}

.sort-btn:hover {
    background: var(--lightblue);
    border-color: var(--darkblue);
}

.sort-btn:active {
    transform: translateY(2px);
}

.order-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.state-message {
    margin: 0;
    padding: 18px 20px;
}
</style>