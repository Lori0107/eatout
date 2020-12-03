import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'fomantic-ui-css/semantic.min.css'
import './assets/javascript/semantic.min.js'
import './assets/style/application.sass'
import * as GmapVue from 'gmap-vue'

let EventBus;
export default EventBus = new Vue();

Vue.config.productionTip = false;

Vue.use(GmapVue, {
  load: {
    key: process.env.VUE_APP_API_KEY,
    libraries: 'places'
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
