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
      component: () => import('../views/ErrorView.vue'),
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
          name: 'language',
          component: () => import('../views/client/catalogs/LanguagesView.vue')
        },
        {
          path: '/oficial-identifiers',
          name: 'idtype',
          component: () => import('../views/client/catalogs/IDsView.vue')
        },
        {
          path: '/nationalities',
          name: 'nationality',
          component: () => import('../views/client/catalogs/NationalitiesView.vue')
        },
        {
          path: '/currency',
          name: 'currency',
          component: () => import('../views/client/currency/CurrencyView.vue')
        },
        {
          path: '/currency-conversion',
          name: 'currency-conversion',
          component: () => import('../views/client/currency/CurrencyConversion.vue')
        },
        // TODO: partner
        {
          path: '/partner',
          name: 'partner',
          component: () => import('../views/client/partner/PartnerView.vue')
        },
        {
          path: '/add-partner',
          name: 'add-partner',
          component: () => import('../views/client/partner/AddPartnerView.vue')
        },
        {
          path: '/edit-partner/:id',
          name: 'edit-partner',
          component: () => import('../views/client/partner/AddPartnerView.vue')
        },
        /* CLIENTS */
        {
          path: '/clients',
          name: 'clients',
          component: () => import('../views/client/client/ClientsView.vue')
        },
        {
          path: '/add-client',
          name: 'add-client',
          component: () => import('../views/client/client/AddClientView.vue')
        },
        {
          path: '/edit-client/:id',
          name: 'edit-client',
          component: () => import('../views/client/client/AddClientView.vue')
        },
        {
          path: '/clients-massive',
          name: 'clients-massive',
          component: () => import('../views/client/client/MassiveClientsView.vue')
        },
        /* SALES */
        {
          path: '/sales-room',
          name: 'sales-room',
          component: () => import('../views/client/sales/SalesRoomView.vue')
        }
      ]
    },
  ]
})

/* TODO: Verificar si hay otra forma de preguntar por la sesión sin hacer una consulta */
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
      next({name: 'login'})
    }
  } else {
    next()
  }
})

export default router
