import Vue from 'vue'
import Router from 'vue-router'
import coreRouter from './core.js'
import mainRouter from './mainRouter/index.js'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...coreRouter,
    mainRouter
  ]
})

router.beforeEach((to, from, next) => {
  // ...
  if (to.path === '/') {
    next({
      path: 'login'
    })
  } else {
    next()
  }
})

export default router
