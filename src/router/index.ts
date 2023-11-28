import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import authGuard from '@/guards/authGuard';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1',
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tab1',
        component: () => import('@/views/TabPage/Home.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tab1/:id',
        component: () => import('@/views/Preventivo/Titulos.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tab1/:id/:idOden',
        component: () => import('@/views/Preventivo/Items.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tab1/datos-grua/:id/:user',
        component: () => import('@/views/Preventivo/FotosDatosGrua.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tab2',
        component: () => import('@/views/TabPage/Correctivo.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tab3',
        component: () => import('@/views/TabPage/Solucion.vue'),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'tab4',
        component: () => import('@/views/TabPage/Operaciones.vue'),
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Auth/Login.vue'),
    meta: {
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  authGuard(to, from, next);
});

export default router
