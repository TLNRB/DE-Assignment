import { createRouter, createWebHistory } from 'vue-router'
import GamesView from '@/views/GamesView.vue'
import AdminView from '@/views/AdminView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'games',
      component: GamesView,
    },
    {
      path: '/admin',
      name: 'admin',
      meta: { requiresAuth: true },
      component: AdminView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    }
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated: boolean = !!localStorage.getItem('token')
  const requiresAuth: boolean = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) next('/login')
  else if (isAuthenticated && (to.name === 'login' || to.name === 'register')) next(from.fullPath)
  else next()
})

export default router
