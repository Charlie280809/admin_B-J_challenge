<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../services/auth.js'
import { getOrderById, getOrders } from '../services/api.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const order = ref(null)
const loading = ref(true)
const error = ref('')

const orderId = computed(() => route.params.id)

const getToken = () => auth.token || localStorage.getItem('token')

const formatTimestamp = (value) => (value ? new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
}).format(new Date(value)) : 'Onbekend')

const toList = (value) => {
    if (!value) return []
    if (Array.isArray(value)) return value
    if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean)
    return [String(value)]
}

const formatAddress = (address) => {
    if (!address || typeof address !== 'object') {
        return 'Geen adres beschikbaar'
    }

    const parts = [address.street, address.houseNumber, address.postalCode, address.city].filter(Boolean)
    return parts.length ? parts.join(', ') : 'Geen adres beschikbaar'
}

const flavorLabels = {
    vanille: 'Vanille',
    chocolate: 'Chocolate Fudge Brownie',
    strawberry: 'Strawberry Cheesecake',
    'cookie-dough': 'Cookie Dough',
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

const goBack = () => {
    router.push('/dashboard')
}

const formatPrice = (value) => `€ ${value}`

onMounted(resolveOrder)

watch(orderId, resolveOrder)
</script>

<template>
    <main class="detail-page">
        <div class="detail-card">
            <button class="back-button" type="button" @click="goBack">Terug naar dashboard</button>

            <p v-if="loading" class="detail-state">Bestelling laden...</p>
            <p v-else-if="error" class="detail-state detail-state--error">{{ error }}</p>

            <section v-else-if="order" class="detail-grid">
                <div>
                    <p class="detail-label">Naam</p>
                    <h1>{{ order.customerName }}</h1>
                </div>

                <div>
                    <p class="detail-label">Smaak</p>
                    <p>{{ order.smaak }}</p>
                </div>

                <div>
                    <p class="detail-label">Toppings</p>
                    <p>{{ order.toppings.length ? order.toppings.join(', ') : 'Geen toppings' }}</p>
                </div>

                <div>
                    <p class="detail-label">Saus</p>
                    <p>{{ order.saus }}</p>
                </div>

                <div>
                    <p class="detail-label">Adres</p>
                    <p>{{ order.address }}</p>
                </div>

                <div>
                    <p class="detail-label">Totaalprijs</p>
                    <p>{{ formatPrice(order.totalPrice) }}</p>
                </div>

                <div>
                    <p class="detail-label">Timestamp</p>
                    <p>{{ order.timestamp }}</p>
                </div>

                <div>
                    <p class="detail-label">Status</p>
                    <p class="detail-status">{{ order.status }}</p>
                </div>
            </section>
        </div>
    </main>
</template>

<style scoped>
.detail-page {
    min-height: 100vh;
    padding: 32px 24px;
    background: linear-gradient(180deg, #f7f5ef 0%, #eef4f8 100%);
    font-family: 'Proxima Nova', sans-serif;
}

.detail-card {
    max-width: 920px;
    margin: 0 auto;
    padding: 28px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 24px 60px rgba(17, 24, 39, 0.12);
    backdrop-filter: blur(10px);
}

.back-button {
    margin-bottom: 24px;
    padding: 12px 18px;
    border: 0;
    border-radius: 999px;
    background: #09121a;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
}

.detail-state {
    margin: 0;
    padding: 20px 0;
    font-size: 1.05rem;
    color: #09121a;
}

.detail-state--error {
    color: #b91c1c;
}

.detail-grid {
    display: grid;
    gap: 22px;
}

.detail-label {
    margin: 0 0 6px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b7280;
}

.detail-grid h1,
.detail-grid p {
    margin: 0;
    color: #09121a;
}

.detail-grid h1 {
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.05;
}

.detail-status {
    display: inline-flex;
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(247, 168, 0, 0.18);
    font-weight: 700;
}
</style>