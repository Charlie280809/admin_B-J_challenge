<script setup>
import { computed } from 'vue'
import Trash from '@primeicons/vue/trash';

const STATUS_OPTIONS = ['Te verwerken', 'Verzonden', 'Geannuleerd']

const emit = defineEmits(['delete', 'status', 'select'])

const props = defineProps({
	name: String,
	date: String,
	status: String,
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
		<div class="order_name">
			<h3>{{ name }}</h3>

			<select class="order_status" :class="statusClass" :value="status" @click.stop
				@change="emit('status', $event.target.value)">
				<option v-for="statusOption in STATUS_OPTIONS" :key="statusOption" :value="statusOption">
					{{ statusOption }}
				</option>
			</select>
		</div>

		<div class="order_timestamp">
			<p>{{ date }}</p>

			<button class="trashBtn" type="button" aria-label="Verwijder bestelling" @click.stop="emit('delete')">
				<span>
					<Trash />
				</span>
				Verwijder bestelling
			</button>
		</div>
	</article>
</template>

<style scoped>
.order-card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 16px;
	padding: 20px 24px;
	background: #f3f4f6;
	color: var(--black);
	border-radius: 18px;
	border: 1px solid rgba(13, 30, 41, 0.08);
	cursor: pointer;
}

.order-card:focus-visible {
	outline: 3px solid rgba(247, 168, 0, 0.8);
	outline-offset: 3px;
}

.order_name,
.order_timestamp {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
}

.order-card h3 {
	margin: 0;
	font-family: 'Proxima Nova', sans-serif;
	font-size: 1.25rem;
	line-height: 1.1;
	font-weight: 700;
	letter-spacing: -0.01em;
	text-align: left;
}

.order-card p {
	margin: 0;
	font-size: 1.15rem;
	text-align: left;
}

.order_timestamp p {
	font-size: 1rem;
}

.trashBtn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 8px 12px;
	border: 2px solid #DF9B95;
	border-radius: 8px;
	color: #09121a;
	font-family: 'Proxima Nova', sans-serif;
	font-size: 1rem;
	line-height: 1;
	cursor: pointer;
}

.trashBtn:hover {
	color: var(--red);
	border: 2px solid var(--red);
	background-color: #F0CFCC;
	transition: all 0.2s ease-in-out;
}

.trashBtn span {
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--red);
}

.order_status {
	min-width: fit-content;
	padding: 6px 12px;
	border-radius: 8px;
	border: 2px solid #F7A800;
	background: rgba(247, 168, 0, 0.5);
	color: var(--black);
	font-family: 'Proxima Nova', sans-serif;
	font-size: 1.1rem;
	line-height: 1;
	cursor: pointer;
}

.order_status:hover {
	opacity: 0.6;
	transition: all 0.2s ease-in-out;
}

.order_status.status-cancelled {
	background: #DF9B95;
}

.order_status.status-pending {
	background: #F7A800;
}

.order_status.status-shipped {
	background: #8BCF8B;
}
</style>