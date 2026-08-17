<script setup>
import { computed } from 'vue'
import Trash from '@primeicons/vue/trash';

const STATUS_OPTIONS = ['Te verwerken', 'Verzonden', 'Geannuleerd']

const emit = defineEmits(['delete', 'status', 'select'])

const props = defineProps({
	name: String,
	date: String,
	status: String,
	address: { type: Object, default: () => ({}) }
})

const statusClass = computed(() => ({
	'status-cancelled': props.status === 'Geannuleerd',
	'status-pending': props.status === 'Te verwerken',
	'status-shipped': props.status === 'Verzonden',
}))
</script>

<template>
	<article class="order-card" role="button" tabindex="0" @click="emit('select')" @keydown.enter="emit('select')"
		@keydown.space.prevent="emit('select')">
		<h3 class="order-name">{{ name }}</h3>

		<p class="order-date">{{ date }}</p>

		<p class="order-street">{{ address.street }} {{ address.houseNumber }}</p>

		<p class="order-city">{{ address.postalCode }} {{ address.city }}</p>

		<div class="select-wrapper">
			<select class="order_status" :class="statusClass" :value="status" @click.stop
				@change="emit('status', $event.target.value)">
				<option v-for="statusOption in STATUS_OPTIONS" :key="statusOption" :value="statusOption">
					{{ statusOption }}
				</option>
			</select>
		</div>

		<button class="trashBtn" type="button" title="Verwijder bestelling" @click.stop="emit('delete')">
			<span>
				<Trash />
			</span>
		</button>
	</article>
</template>

<style scoped>
.order-card {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: auto auto;
	gap: 12px 24px;
	align-items: center;
	justify-content: center;
	padding: 20px 24px;
	background: #f3f4f6;
	color: var(--black);
	border-radius: 18px;
	border: 1px solid rgba(13, 30, 41, 0.08);
	cursor: pointer;
}

.order-card:hover {
	background-color: #e5e7eb;
	transition: all 0.2s ease-in-out;
}

.order-name {
	grid-column: 1;
	grid-row: 1;
	margin: 0;
	font-family: 'Proxima Nova', sans-serif;
	font-size: 1.25rem;
	font-weight: 700;
	letter-spacing: -0.01em;
}

.order-date {
	grid-column: 1;
	grid-row: 2;
	margin: 0;
	font-size: 1rem;
	color: #6B7280;
}

.order-street {
	grid-column: 2;
	grid-row: 1;
	margin: 0;
	font-size: 1.15rem;
}

.order-city {
	grid-column: 2;
	grid-row: 2;
	margin: 0;
	font-size: 1.15rem;
}

.select-wrapper {
	position: relative;
	display: inline-flex;
	grid-column: 3;
	grid-row: 1;
	justify-self: end;
}

.order_status {
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

.select-wrapper::after {
	content: "▼";
	position: absolute;
	right: 10px;
	top: 50%;
	transform: translateY(-50%);
}

.order_status.status-cancelled { background: #ebaaa4; --hover: #e08b83; }
.order_status.status-pending { background: #ffd06a; --hover: #f4c057; }
.order_status.status-shipped { background: #a3e1a3; --hover: #71d171; }
.order_status:hover { background: var(--hover); }

.trashBtn {
	grid-column: 3;
	grid-row: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 6px 8px;
	border: 2px solid #DF9B95;
	border-radius: 8px;
	color: var(--black);
	font-family: 'Proxima Nova', sans-serif;
	font-size: 0.85rem;
	cursor: pointer;
	justify-self: end;
}

.trashBtn:hover {
	color: var(--red);
	border: 2px solid var(--red);
	background-color: #F0CFCC;
	transition: all 0.2s ease-in-out;
}

.trashBtn span {
	display: flex;
	color: var(--red);
}
</style>