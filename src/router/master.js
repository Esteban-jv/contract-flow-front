import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      component: () => import('../views/auth/AuthLayout.vue'),
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('../views/auth/LoginView.vue')
        },
      ]
    },
    {
      path: '/master',
      component: () => import('../views/master/MasterLayout.vue'),
      children: [
        {
          path: '',
          name: 'master',
          component: () => import('../views/master/dashboard/DashboardView.vue')
        },
      ]
    }
  ]
})

export default router
