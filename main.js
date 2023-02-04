import App from './App'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

import Vue from 'vue'
import login from '@/components/login.vue'
import gotoShare from '@/components/gotoShare.vue'
import store from '@/store/index.js'
Vue.component('login', login)
Vue.component('gotoshare', gotoShare)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App,
	store
})
require('@/config/request.js')(app)
app.$mount()


// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
