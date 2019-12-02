import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import { Util, getToken } from '@/libs/util'

Vue.use(VueRouter);
Vue.use(ViewUI);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 全局路由钩子
ViewUI.LoadingBar.config({
  color: '#01c864',
  failedColor: '#f0ad4e',
  height: 3
});
const login = getToken()
router.beforeEach((to, from, next) => {
  ViewUI.LoadingBar.start();
  /*if (process.env.NODE_ENV === 'development') {
    console.log('开发模式')
  } else {
    if (!login && to.name !== 'login' && to.name !== 'register') {  // 判断是否已经登录且前往的页面不是登录页
      next({
        name: 'login'
      })
    } else if (login && to.name === 'login') {  // 判断是否已经登录且前往的是登录页

      next({
        name: 'home'
      })
    } else {
      next()
    }
  }*/
  next();
});

router.afterEach((to, from, next) => {
  ViewUI.LoadingBar.finish();
  Util.title(to.meta.title);
  window.scrollTo(0, 0);
});

export default router
