import Vue from 'vue'
import MainApp from './MainApp'
import router from '../router'

Vue.config.productionTip = false

new Vue({
  components: { MainApp },
  router,
  template: '<main-app/>'
}).$mount('#app')
