import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Fixture from '../views/Fixture.vue'
import Tabla from '../views/Tabla.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/fixture', name: 'Fixture', component: Fixture },
  { path: '/tabla', name: 'Tabla', component: Tabla }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
