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
      component: () => import('../views/403View.vue'),
    },
    {
      path: '/client-view',
      name: 'client-view',
      component: () => import('../views/ClientView.vue')
    },
    {
      path: '',
      meta: { requiresAuth: true },
      component: () => import('../views/client/MenuContainerLayout.vue'),
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('../views/client/DashboardView.vue')
        },
        {
          path: '/languages',
          name: 'languages',
          component: () => import('../views/client/catalogs/LanguagesView.vue')
        },
        {
          path: '/oficial-identifiers',
          name: 'oficial-ids',
          component: () => import('../views/client/catalogs/IDsView.vue')
        },
        {
          path: '/nationalities',
          name: 'nationalities',
          component: () => import('../views/client/catalogs/NationalitiesView.vue')
        }
      ]
    },
  ]
})

router.beforeEach( async (to, from, next) => {
  const requiresAuth = to.matched.some( url => url.meta.requiresAuth )
  if(requiresAuth) {
    try {
      const { data } = await AuthApi.auth()
      // console.log(data)
      if(data.is_active && data.is_staff) { // Only admin pane
        // admin
        next()
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
