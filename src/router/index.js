import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register/index.vue'),
    hidden: true
  },
  {
    path: '/forget',
    component: () => import('@/views/forget/index.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/homepage',
    children: [{
      path: 'homepage',
      name: 'homepage',
      component: () => import('@/views/homePage/index.vue')
    }]
  },
  {
    path: '/homepage',
    component: Layout,
    children: [
      {
        path: '/',
        component: () => import('@/views/homePage/index.vue')
      },
      {
        path: 'collectionClothings',
        component: () => import('@/views/collectionClothings/index.vue')
      },
      {
        path: 'getClothings',
        component: () => import('@/views/getClothings/index.vue')
      },
      {
        path: 'vipManagement',
        component: () => import('@/views/vipManagement/index.vue')
      },
      {
        path: 'vipTopUp',
        component: () => import('@/views/vipTopUp/index.vue')
      },
      {
        path: 'feedbackManagement',
        component: () => import('@/views/feedbackManagement/index.vue')
      },
      {
        path: 'notice',
        component: () => import('@/views/notice/index.vue')
      },
      {
        path: 'statisticalManagement/memberConsumptionStatistics',
        component: () => import('@/views/statisticalManagement/memberConsumptionStatistics.vue')
      },
      {
        path: 'systemSettings/basicData',
        component: () => import('@/views/systemSettings/basicData')
      },
      {
        path: 'systemSettings/clothesPrice',
        component: () => import('@/views/systemSettings/clothesPrice')
      },
      {
        path: 'feedback', 
        component: () => import('@/views/userFeedback/index.vue')
      },
      {
        path: 'systemNotice',
        component: () => import('@/views/userNotice/index.vue')
      },
      {
        path: 'userInfo',
        component: () => import('@/views/userInfo/index.vue')
      },
      {
        path: 'userAddClothes',
        component: () => import('@/views/userAddClothes/index.vue')
      },
      {
        path: 'userLaundryRecord',
        component: () => import('@/views/userLaundryRecord/index.vue')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
