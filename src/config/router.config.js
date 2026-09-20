/*
 * @Description:
 * @version: 1.0
 * @Author: renyong
 * @Date: 2021-10-14 15:40:14
 * @LastEditors: renyong
 * @LastEditTime: 2022-08-08 20:19:29
 */
import { BaseLayout, UserLayout } from '@/layouts'
import routers from './routers'

// 异步路由
export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    redirect: '/home/index',
    component: BaseLayout,
    meta: {
      title: '影像查询'
    },
    children: routers
  },
  {
    path: '/landing',  hidden: true,
    component: () => import('@/views/landing'),
  },
    {
    path: '/login',
    component: () => import('@/views/user/loginAuth'),
    hidden: true
  },
  {
    path: '/404', redirect: '/404', hidden: true
  }
]

/* 
  基础路由
*/
// export const constantRouterMap = [
//   {
//     path: '/user',
//     component: UserLayout, // 用户登录
//     redirect: '/user/login',
//     hidden: true,
//     children: [
//       {
//         path: 'login',
//         name: 'login',
//         meta: {
//           title: '登录'
//         },
//         component: () => import('@/views/user/login')
//       }
//     ]
//   },
//   {
//     path: '/404',
//     component: () => import('@/views/404'),
//     hidden: true
//   }
// ]
export const constantRouterMap = []