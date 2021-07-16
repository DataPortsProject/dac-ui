import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import VueLayoutComposer from 'vue-layout-composer'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters
import FormBuilder from 'element-form-builder'// https://www.npmjs.com/package/element-form-builder/v/1.0.0

// import '@/assets/css/tailwind.css'

import VueSkycons from 'vue-skycon'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// TODO: Remove this to online
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(FormBuilder) // form-builder

Vue.use(VueLayoutComposer)

Vue.use(VueSkycons, { 'color': 'white' })
// Vue.use(VueSkycons)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch//assets/css/leaflet.css'

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

import VueNativeSock from 'vue-native-websocket'
Vue.use(VueNativeSock, 'ws://localhost:3010/websockets', {
  store: store,
  // format: 'json',
  reconnection: true,
  reconnectionDelay: 3000
})

setInterval(() => {
  if (window.localStorage.getItem('isOk') === '1') {
    var notification = store.getters.getSocketMessage
    // console.log(notification)
    const myArr = notification.split(',')
    if (myArr.length === 3) {
      // console.log(myArr)
      var container = myArr[0]
      var notificationType = myArr[1]
      // var text = myArr[2]

      Vue.prototype.$message({
        message: 'Notification received. Container: ' + container,
        type: notificationType,
        duration: 1000
      })
    }

    window.localStorage.setItem('isOk', '0')
  }
}, 1000)

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
