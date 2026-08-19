<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../services/auth.js'
import { deleteOrder, getOrderById, getOrders, updateOrderStatus } from '../services/api.js'
import Trash from '@primeicons/vue/trash';

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const STATUS_OPTIONS = ['Te verwerken', 'Verzonden', 'Geannuleerd']

const order = ref(null)
const loading = ref(true)
const error = ref('')
const orderId = computed(() => route.params.id)
const getToken = () => auth.token || localStorage.getItem('token')

const goBack = () => {
    router.push('/dashboard')
}

const formatTimestamp = (value) => (value ? new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
}).format(new Date(value)) : 'Onbekend')

const formatAddress = (address) => {
    if (!address || typeof address !== 'object') {
        return 'Geen adres beschikbaar'
    }

    const parts = [address.street, address.houseNumber, address.postalCode, address.city].filter(Boolean)
    const streetAndNumber = parts[0] && parts[1] ? `${parts[0]} ${parts[1]}` : parts[0] || parts[1]
    const postalAndCity = parts[2] && parts[3] ? `${parts[2]} ${parts[3]}` : parts[2] || parts[3]
    return [streetAndNumber, postalAndCity].filter(Boolean).join(', ') || 'Geen adres beschikbaar'
}

const toList = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean)
    return [String(value)]
}

const flavorLabels = {
    vanille: 'Vanille',
    chocolate: 'Chocolate Fudge Brownie',
    strawberry: 'Strawberry Cheesecake',
    'cookie-dough': 'Cookie Dough',
    blueberry: 'Blueberry Burst',
    passion: 'Passion Fruit',
};

const sauceLabels = {
    chocolate: 'Chocoladesaus',
    caramel: 'Caramelsaus',
    strawberry: 'Aardbeiensaus',
    'white-chocolate': 'Witte chocoladesaus',
};

const toppingsLabels = {
    'choc-chips': 'Choco chips',
    'cookie-crumble': 'Cookie crumble',
    marshmallow: 'Marshmallow',
    sprinkles: 'Sprinkles',
    brownie: 'Brownie bits',
};

const normalizeOrder = (record) => ({
    id: record?.id || record?._id || orderId.value,
    customerName: record?.customerName || 'Naam onbekend',
    address: formatAddress(record?.address),
    smaak: flavorLabels[record?.smaak] || record?.smaak || 'Onbekend',
    toppings: toList(record?.toppings).map(t => toppingsLabels[t] || t),
    saus: sauceLabels[record?.saus] || record?.saus || 'Geen saus',
    totalPrice: typeof record?.totalPrice === 'number' ? record.totalPrice.toFixed(2) : '0.00',
    status: record?.status || 'Te verwerken',
    timestamp: formatTimestamp(record?.createdAt),
});

const resolveOrder = async () => {
    const token = getToken()
    const id = orderId.value

    if (!token || !id) {
        error.value = 'Kan de bestelling niet laden.'
        loading.value = false
        return
    }

    loading.value = true
    error.value = ''

    try {
        const response = await getOrderById(id, token)
        const candidate = response?.data?.order || response?.data || response

        if (candidate && !Array.isArray(candidate)) {
            order.value = normalizeOrder(candidate)
            return
        }

        const listResponse = await getOrders(token)
        const list = Array.isArray(listResponse.data) ? listResponse.data : listResponse.data.orders || []
        const match = list.find((item) => String(item.id || item._id || item.orderId) === String(id))

        order.value = match ? normalizeOrder(match) : null
        if (!order.value) {
            error.value = 'Bestelling niet gevonden.'
        }
    } catch (err) {
        console.error('Failed to load order detail:', err)
        error.value = 'Er ging iets mis bij het laden van de bestelling.'
        order.value = null
    } finally {
        loading.value = false
    }
}

const handleStatusChange = async (event) => {
    const token = getToken()
    const id = order.value?.id
    const status = event.target.value

    if (!token || !id || !order.value || !status) {
        return
    }

    try {
        await updateOrderStatus(id, status, token)
        order.value = {
            ...order.value,
            status,
        }
    } catch (err) {
        console.error('Failed to update order status:', err)
    }
}

const handleDelete = async () => {
    const token = getToken()
    const id = order.value?.id

    if (!token || !id) {
        console.error('Kan bestelling niet verwijderen: token of ID ontbreekt')
        return
    }

    try {
        await deleteOrder(id, token)
        router.push('/dashboard')
    } catch (err) {
        console.error('Failed to delete order:', err)
    }
}

onMounted(resolveOrder)
watch(orderId, resolveOrder)
</script>

<template>
    <main class="detail-page">
        <button class="back-button" type="button" @click="goBack"> ← Terug naar dashboard</button>

        <div class="detail-card">
            <p v-if="loading" class="detail-state">Bestelling laden...</p>
            <p v-else-if="error" class="detail-state detail-state--error">{{ error }}</p>

            <section v-else-if="order" class="detail-grid">
                <div class="detail-left">
                    <h2>Klantinformatie</h2>
                    <div>
                        <p class="detail-label">Naam:</p>
                        <p>{{ order.customerName }}</p>
                    </div>

                    <div>
                        <p class="detail-label">Adres:</p>
                        <p>{{ order.address }}</p>
                    </div>

                    <div>
                        <p class="detail-label">Besteldatum:</p>
                        <p>{{ order.timestamp }}</p>
                    </div>

                    <div>
                        <p class="detail-label">Status:</p>
                        <span class="status-wrapper">
                            <select class="detail-status" :class="{
                                'status-cancelled': order.status === 'Geannuleerd',
                                'status-pending': order.status === 'Te verwerken',
                                'status-shipped': order.status === 'Verzonden'
                            }" :value="order.status" @change="handleStatusChange">
                                <option v-for="statusOption in STATUS_OPTIONS" :key="statusOption"
                                    :value="statusOption">
                                    {{ statusOption }}
                                </option>
                            </select>
                        </span>
                    </div>
                </div>

                <div class="detail-right">
                    <h2>Bestelling</h2>
                    <div>
                        <p class="detail-label">Smaak:</p>
                        <p>{{ order.smaak }}</p>
                    </div>

                    <div>
                        <p class="detail-label">Toppings:</p>
                        <p>{{ order.toppings.length ? order.toppings.join(', ') : 'Geen toppings' }}</p>
                    </div>

                    <div>
                        <p class="detail-label">Saus:</p>
                        <p>{{ order.saus }}</p>
                    </div>

                    <div>
                        <p class="detail-label">Totaalprijs:</p>
                        <p>€ {{ order.totalPrice }}</p>
                    </div>
                </div>
            </section>
        </div>
        <button class="trashBtn" type="button" title="Verwijder bestelling" @click="handleDelete">
            <span>
                <Trash /> Bestelling verwijderen
            </span>
        </button>
    </main>
</template>

<style scoped>
.detail-page {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, var(--bg) 0%, var(--lightblue) 150%);
    font-family: 'Proxima Nova', sans-serif;
    font-size: 1.2rem;
}

.detail-card {
    width: 60%;
    margin: 0 auto;
    padding: 32px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 24px 60px rgba(17, 24, 39, 0.12);
    backdrop-filter: blur(10px);
}

.back-button {
    position: absolute;
    top: 24px;
    left: 24px;
    margin-bottom: 24px;
    padding: 12px 18px;
    border: 2px solid var(--blue);
    border-radius: 8px;
    background: var(--bg);
    font-family: 'Proxima Nova', sans-serif;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.back-button:hover {
    background: var(--lightblue);
    border-color: var(--darkblue);
}

.back-button:active {
    transform: translateY(2px);
}

.detail-state {
    margin: 0;
    padding: 20px 0;
    font-size: 1.05rem;
    color: var(--black);
}

.detail-state--error {
    color: #b91c1c;
}

.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
}

.detail-grid h2 {
    font-family: 'ChunkFive';
}

.detail-grid p {
    margin: 0;
    color: var(--black);
}

.detail-left,
.detail-right {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.detail-label {
    padding: 0 0 8px 0;
    text-decoration: underline;
}

.detail-status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    min-width: fit-content;
    padding: 8px 32px 8px 12px;
    border-radius: 8px;
    border: none;
    background: rgba(247, 168, 0, 0.5);
    color: var(--black);
    font-family: 'Proxima Nova', sans-serif;
    font-size: 1.1rem;
    line-height: 1;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.status-wrapper {
    position: relative;
    display: inline-block;
}

.status-wrapper::after {
    content: "▼";
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
}

.detail-status.status-cancelled {
    background: #ebaaa4;
    --hover: #e08b83;
}

.detail-status.status-pending {
    background: #ffd06a;
    --hover: #f4c057;
}

.detail-status.status-shipped {
    background: #a3e1a3;
    --hover: #71d171;
}

.detail-status:hover {
    background: var(--hover);
}

.trashBtn {
    position: absolute;
    top: 32px;
    right: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 8px;
    border: 2px solid #DF9B95;
    border-radius: 8px;
    font-family: 'Proxima Nova', sans-serif;
    font-size: 1rem;
    cursor: pointer;
}

.trashBtn:hover {
    border: 2px solid var(--red);
    background-color: #F0CFCC;
    transition: all 0.2s ease-in-out;
}

.trashBtn span {
    display: flex;
    gap: 6px;
    color: var(--red);
}
</style>