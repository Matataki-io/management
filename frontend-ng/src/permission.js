import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // getToken from cookie
import { getCookie } from './utils/cookie'

NProgress.configure({ showSpinner: false })// NProgress configuration

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  // console.log('to', to, from)
  NProgress.start()
  // if (getToken()) {
  //   if (to.path === '/login') {
  //     NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
  //   } else {
  //     next()
  //   }
  // } else {
  //   if (whiteList.indexOf(to.path) !== -1) {
  //     next()
  //   } else {
  //     next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
  //     NProgress.done()
  //   }
  // }

  if (getCookie('access-token')) {
    if (to.path === '/login') {
      NProgress.done()
      next({ path: '/' })
    }
    next()
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      NProgress.done()
      next()
    } else {
      NProgress.done()
      next({ name: 'login' })
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
