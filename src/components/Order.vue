<script setup>
import Trash from '@primeicons/vue/trash';

const STATUS_OPTIONS = ['Te verwerken', 'Verzonden', 'Geannuleerd']

const emit = defineEmits(['delete', 'status', 'select'])

defineProps({
	name: String,
	date: String,
	status: String,
})
</script>

<template>
	<article class="order-card" role="button" tabindex="0" @click="emit('select')" @keydown.enter="emit('select')" @keydown.space.prevent="emit('select')">
		<div class="order_name">
			<h3>{{ name }}</h3>

			<button class="trash_icon" type="button" aria-label="Verwijder bestelling" @click.stop="emit('delete')">
				<Trash />
			</button>
		</div>

		<div class="order_timestamp">
			<p>{{ date }}</p>

			<select class="order_status" :value="status" @click.stop @change="emit('status', $event.target.value)">
				<option v-for="statusOption in STATUS_OPTIONS" :key="statusOption" :value="statusOption">
					{{ statusOption }}
				</option>
			</select>
		</div>
	</article>
</template>

<style scoped>
* {
	box-sizing: border-box;
}

.order-card {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 24px;
	padding: 26px 28px;
	background: #f3f4f6;
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
	font-size: 1.2rem;
	line-height: 1.1;
	font-weight: 700;
	letter-spacing: -0.03em;
	color: #09121a;
	text-align: left;
}

.order-card p {
	margin: 0;
	font-size: 1.15rem;
	color: #09121a;
	text-align: left;
}

.trash_icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 38px;
	height: 38px;
	padding: 0;
	border: 0;
	background: transparent;
	color: #09121a;
	cursor: pointer;
	flex: 0 0 auto;
}

.trash_icon svg {
	width: 30px;
	height: 30px;
	fill: none;
	stroke: currentColor;
	stroke-width: 0.2;
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

.order_status:hover,
.trash_icon:hover {
	opacity: 0.6;
	transition: all 0.2s ease-in-out;
}
</style>