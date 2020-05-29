import 'intersection-observer'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import ViewUI from 'view-design'
import './theme/index.less'  // 主题样式

import vView from 'vue-view-lazy'
import 'xe-utils'

import './plugins/table'
Vue.use(vView,{
  //error:'../../static/images/loading.png',
  loading:'../../static/images/loading.gif',
});

import '@/assets/icons/iconfont.css'
import './index.less' // 全局样式
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
