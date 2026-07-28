import { createRouter, createWebHistory } from 'vue-router'

import Login from '../vieuws/Login.vue'
import Dashboard from '../vieuws/Dashboard.vue'
import Detail from '../vieuws/Detail.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard },
    { path: '/detail/:id', name: 'detail', component: Detail },
]

export default createRouter({
    history: createWebHistory(),
    routes
})