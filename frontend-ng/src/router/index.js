import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    meta: { title: '首页', icon: 'dashboard' },
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  // {
  //   path: '/account',
  //   component: Layout,
  //   redirect: '/account/list',
  //   name: 'Account',
  //   meta: { title: '账号管理', icon: 'nested' },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'AccountList',
  //       component: () => import('@/views/account/list'),
  //       meta: { title: '账号管理', icon: 'example' }
  //     },
  //     {
  //       path: 'detail/:id',
  //       name: 'AccountDetail',
  //       hidden: true,
  //       component: () => import('@/views/account/list'),
  //       meta: { title: '账号详情', icon: 'tree' }
  //     }
  //   ]
  // },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'User',
    meta: { title: '用户管理', icon: 'nested' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/list'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'detail/:id',
        name: 'UserDetail',
        hidden: true,
        component: () => import('@/views/user/detail'),
        meta: { title: '用户详情', icon: 'tree' }
      }
    ]
  },
  {
    path: '/boardcast',
    component: Layout,
    redirect: '/boardcast/telegram',
    name: 'Boardcast',
    meta: { title: '对用户广播', icon: 'example' },
    children: [
      {
        path: 'telegram',
        name: 'BoardcastWithTelegram',
        component: () => import('@/views/boardcast/telegram'),
        meta: { title: '电报广播', icon: 'guide' }
      },
      {
        path: 'email',
        name: 'BoardcastWithTelegram',
        component: () => import('@/views/user/list'),
        meta: { title: '邮件广播', icon: 'guide' }
      }
    ]
  },
  {
    path: '/announcement',
    component: Layout,
    redirect: '/announcement/telegram',
    name: 'Announcement',
    meta: { title: '站内公告', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'AnnouncementList',
        component: () => import('@/views/announcement/list'),
        meta: { title: '公告列表', icon: 'guide' }
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/list',
    name: 'Admin',
    meta: { title: '管理员管理', icon: 'user' },
    children: [
      {
        path: 'list',
        name: 'AdminList',
        component: () => import('@/views/admin-manage/list'),
        meta: { title: '管理员列表', icon: 'nested' }
      },
      {
        path: 'add',
        name: 'AdminAdd',
        component: () => import('@/views/admin-manage/add'),
        meta: { title: '添加管理员', icon: 'user' }
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/admin-manage/edit'),
        meta: { title: '修改资料', icon: 'user' }
      }
    ]
  },
  {
    path: '/p',
    component: Layout,
    redirect: '/p/list',
    name: 'Post',
    meta: { title: '文章管理', icon: 'nested' },
    children: [
      {
        path: 'list',
        name: 'PostList',
        component: () => import('@/views/post/list'),
        meta: { title: '文章管理', icon: 'nested' }
      },
      {
        path: 'detail/:id',
        name: 'PostDetail',
        hidden: true,
        component: () => import('@/views/post/detail'),
        meta: { title: '文章详情', icon: 'nested' }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: '/log/list',
    name: 'Logs',
    meta: { title: '日志', icon: 'nested' },
    children: [{
      path: 'list',
      component: () => import('@/views/log/list')
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
