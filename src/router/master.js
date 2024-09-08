import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthApi from '@/api/AuthApi'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'home',
      redirect: { name: 'master' }
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
      path: '/403',
      name: '403',
      component: () => import('../views/ErrorView.vue'),
    },
    {
      path: '/master',
      component: () => import('../views/master/MasterLayout.vue'),
      meta: { requiresAuth: true },
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

router.beforeEach( async (to, from, next) => {
  const requiresAuth = to.matched.some( url => url.meta.requiresAuth )
  if(requiresAuth) {
    try {
      const { data } = await AuthApi.auth()
      if(data.is_active && data.is_staff && data.is_superuser) {
        // superuser
        next()
      } else {
        //citas
        next({name: '403'})
      }
    } catch (err) {
      console.error(err.response.data.msg)
      next({name: 'login'})
    }
  } else {
    next()
  }
})

export default router
