import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthApi from '@/api/AuthApi'

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
      meta: { requiresAuth: true },
      component: () => import('../views/client/LanguagesView.vue')
    },
  ]
})

router.beforeEach( async (to, from, next) => {
  const requiresAuth = to.matched.some( url => url.meta.requiresAuth )
  if(requiresAuth) {
    try {
      const { data } = await AuthApi.auth()
      // console.log(data)
      if(data.is_active && data.is_staff && data.is_superuser) { // Only admin pane
        admin
        next({name: 'admin'})
      } else {
        //citas
        next({name: '403'})
      }
    } catch (err) {
      console.error(err.response.data.msg)
      // next({name: 'login'})
    }
  } else {
    next()
  }
})

export default router
