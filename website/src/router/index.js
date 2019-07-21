import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:      '/',
      name:      'home',
      component: MainLayout,
      children:  [
        {
          path:      'default',
          alias:     '/',
          component: () => import('@/views/Home.vue'),
          children:  [
            {
              path:      'credit-card',
              alias:     '/',
              component: () => import('@/views/Create.vue')
            },
            {
              path:      'manage',
              component: () => import('@/views/Manage.vue')
            },
            {
              path:      'learn',
              component: () => import('@/views/Learn.vue')
            }
          ]
        },
        {
          path:      'about',
          component: () => import('@/views/About.vue')
        }
      ]
    }
  ]
})
