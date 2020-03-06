import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

import { LoadingBar } from 'view-design'

import { Util, getToken } from '@/libs/util'

Vue.use(VueRouter);

Vue.component("LoadingBar", LoadingBar)
console.log(process.env.BASE_URL)
const router = new VueRouter({
  mode: 'history',
  base: '/ng/',
  routes
});

// 全局路由钩子
LoadingBar.config({
  color: '#01c864',
  failedColor: '#f0ad4e',
  height: 3
});
const login = getToken()
router.beforeEach((to, from, next) => {
  LoadingBar.start();
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
  LoadingBar.finish();
  Util.title(to.meta.title);
  window.scrollTo(0, 0);
});

export default router
