import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../components/Login.vue'
import Main from '../components/Main.vue'
import Menus from '../components/controllerCenter/Menus.vue'
import User from '../components/controllerCenter/User.vue'
import MyPage from '../components/MyPage.vue'
import Basic from '../components/product/Basic.vue'
import Review from '../components/product/Review.vue'
import Series from '../components/series/series.vue'
import Recommend from '../components/recommend/productrecommend.vue'
Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
  {
    path:'/',redirect: '/login'
  },
  {
    path:'/login',component:Login
  },{
    path:'/main',component:Main,
    children:[
      {path:'/users',component:User},
      {path:'/menus',component:Menus},
      {path:'/company/basic',component:Basic},
      {
           path:'/company/review',component:Review
      },{
        path:'/company/series',component:Series
      },{
        
          path:'/company/recommend',component:Recommend
        
      }
    ]
  },{
    path:'/mypage',component:MyPage
  }
]

const router = new VueRouter({
  routes
})

export default router
