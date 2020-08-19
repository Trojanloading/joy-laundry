import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui' // element-ui
import 'element-ui/lib/theme-chalk/index.css' // element-ui css
import '../src/styles/element-#78A17B/index.css'// 自定义主题色

import '@/styles/index.scss' // global css

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.filter('toDate', date => {
  const d = new Date(date)
  return d.getFullYear() + '-' +
    (d.getMonth() + 1) + '-' +
    d.getDate()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
