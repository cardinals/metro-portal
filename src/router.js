import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [{
    path: '/',
    redirect: {
      name: 'home'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/edit',
    name: 'edit',
    component: () => import('./views/edit.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/login.vue')
  }
  ]
})
