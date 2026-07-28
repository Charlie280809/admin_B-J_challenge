<script setup>
import Trash from '@primeicons/vue/trash';

defineProps({
	name: String,
	date: String,
	status: String,
})
</script>

<template>
	<article class="order-card">
		<div class="order-card__header">
			<h3>{{ name }}</h3>

			<button class="order-card__icon-button" type="button" data-action="delete" aria-label="Verwijder bestelling">
				<Trash />
			</button>
		</div>

		<div class="order-card__footer">
			<p>{{ date }}</p>

			<button class="order-card__status" type="button" data-action="status">
				{{ status }}
			</button>
		</div>
	</article>
</template>

<style scoped>
*{
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
}

.order-card__header,
.order-card__footer {
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

.order-card__icon-button {
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

.order-card__icon-button svg {
	width: 30px;
	height: 30px;
	fill: none;
	stroke: currentColor;
	stroke-width: 0.2;
}

.order-card__status {
	min-width: fit-content;
	padding: 13px 24px;
	border-radius: 8px;
	border: 2px solid #F7A800;
	background: rgba(247, 168, 0, 0.5);
	color: #121212;
	font-size: 1.1rem;
	line-height: 1;
	cursor: pointer;
	box-shadow: 0 1px 0 rgba(255, 255, 255, 0.35) inset;
}

.order-card__status:hover,
.order-card__icon-button:hover {
	opacity: 0.92;
}
</style>