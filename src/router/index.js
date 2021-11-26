import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Image from '@/views/image'
import Comment from '@/views/comment'
import Settings from '@/views/settings'
import Fans from '@/views/fans'

Vue.use(VueRouter)

// 路由配置
const routes = [
  // { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: Login },
  {
    path: '/',
    // name: 'layout', // 注意：有默认子路由的话就不需要设置name属性
    component: Layout,
    children: [
      {
        path: '', // path为空则为默认子路由
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 登录路由导航守卫
router.beforeEach((to, from, next) => {
  // 获取用户要访问的hash地址 to.path
  // 判断hash地址是否为 /login
  if (to.path !== '/login') {
    // 判断登录状态(登录才允许访问)
    // 判断登录状态，获取localStorage的token值(localStorage.getItem('user'))
    const user = localStorage.getItem('user')
    if (user) {
      next() // 有user放行
    } else {
      next('/login') // 没有user跳转登录页
    }
  } else {
    // 直接放行
    next()
  }
})

export default router
