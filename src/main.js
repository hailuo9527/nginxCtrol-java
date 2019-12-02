import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'

/*import vView from 'vue-view-lazy'
Vue.use(vView,{
  //error:'../../static/images/loading.png',
 // loading:'../../static/images/loading.gif',
});*/


import './theme/index.less'
import '@/assets/icons/iconfont.css'
import './index.less'
import config from '@/config'
import * as vueExpand from '@/libs/vue-expand'
import directives from "./plugins/directives.js"
import components from "./plugins/components.js"

Vue.use(directives);
Vue.use(components);
Vue.use(ViewUI);
Vue.config.productionTip = false


/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 生成常用方法
 */
Object.keys(vueExpand).forEach(key => {
  Vue.prototype[key] = vueExpand[key]
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
