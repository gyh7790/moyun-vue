import Vue from 'vue'
import App from './App.vue'
import router from '@/router/router'
import store from '@/store/store'
import { ajax, cookie } from '@/utils/ajax'
import iView from 'iview'
import './components/components.js'
import 'iview/dist/styles/iview.css'

Vue.use(iView)

Vue.config.productionTip = false
Vue.prototype.$ajax = ajax
Vue.prototype.$cookie = cookie

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
