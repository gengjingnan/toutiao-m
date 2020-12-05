import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // name: 'layout',如果父路由有默认子路由.那么他的name没有意义
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 默认子路由,只能有一个
        name: 'home',
        component: () => import('@/views/home')
      },
      { path: '/qa', name: 'qa', component: () => import('@/views/qa') },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleID',
    name: 'article',
    component: () => import('@/views/article'),
    props: true // 如果 props 被设置为 true，route.params 将会被设置为组件属性 其他组件可以使用使用 props 接收路由参数
  },
  {
    path: '/user/profile',
    name: 'profile',
    component: () => import('@/views/user-profile')
  }
]

const router = new VueRouter({
  routes
})

export default router
