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
      path: '/auth',
      name: 'auth',
      component: () => import('../views/auth/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/auth/LoginView.vue')
        },
      ]
    },
    {
      path: '/client-view',
      name: 'client-view',
      component: () => import('../views/ClientView.vue')
    },
    {
      path: '/languages',
      name: 'languages',
      component: () => import('../views/client/LanguagesView.vue')
    },
  ]
})

export default router
