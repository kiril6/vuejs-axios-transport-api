import Vue from 'vue'
import VueRouter from 'vue-router'
import LineStop from '../components/LineStop.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/station/:id',
    name: 'LineStop',
    component: LineStop
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
