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
          component: () => import('@/views/Home.vue')
        },
        {
          path:      'about',
          component: () => import('@/views/About.vue')
        }
      ]
    }
  ]
})
