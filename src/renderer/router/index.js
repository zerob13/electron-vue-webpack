import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'pagea',
      component: require('@/components/PageA').default
    },
    {
      path: '/b',
      name: 'pageb',
      component: () => import('@/components/PageB')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
