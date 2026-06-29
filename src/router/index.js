import { createRouter, createWebHistory } from 'vue-router'

import Login from '../vieuws/Login.vue'
import Dashboard from '../vieuws/Dashboard.vue'
import Detail from '../vieuws/Detail.vue'
import Votes from '../vieuws/Votes.vue'

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard },
    { path: '/detail/:id', component: Detail },
    { path: '/votes', component: Votes }
]

export default createRouter({
    history: createWebHistory(),
    routes
})