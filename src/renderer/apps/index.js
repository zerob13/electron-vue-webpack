import Vue from 'vue'
import IndexApp from './IndexApp'
import router from '../router'

Vue.config.productionTip = false

/* eslint-disable no-new */
const a = new Vue({
  components: { IndexApp },
  router,
  template: '<index-app/>'
}).$mount('#app')
