import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },
  {
    path: '/banner',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '轮播图管理',
        component: () => import('@/views/banner/list'),
        meta: { title: '轮播图管理', icon: 'example' }
      }
    ]
  },
  {
    path: '/poetry',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '诗人轮播控制',
        component: () => import('@/views/poetry/list'),
        meta: { title: '诗人轮播控制', icon: 'example' }
      }
    ]
  },
  {
    path: '/learingBanner',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '学习轮播',
        component: () => import('@/views/learingBanner/list'),
        meta: { title: '学习轮播', icon: 'example' }
      }
    ]
  },
  {
    path: '/cet',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '词汇',
        component: () => import('@/views/cet/list'),
        meta: { title: '英语词汇', icon: 'example' }
      }
    ]
  },
  // {
  //   path: '/poetryArticle',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'list',
  //       name: '诗',
  //       component: () => import('@/views/poetryArticle/list'),
  //       meta: { title: '诗', icon: 'example' }
  //     }
  //   ]
  // },
  // {
  //   path: '/shijing',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'list',
  //       name: '诗经',
  //       component: () => import('@/views/shijing/list'),
  //       meta: { title: '诗经', icon: 'example' }
  //     }
  //   ]
  // },
  {
    path: '/novel',
    component: Layout,
    name: '小说',
    meta: {
      title: '小说',
      icon: 'nested'
    },
    children: [
      {
        path: '小说管理',
        name: '小说管理',
        component: () => import('@/views/novel/list'),
        meta: { title: '小说管理', icon: 'example' }
      },
      {
        path: '小说章节',
        name: '小说章节',
        component: () => import('@/views/article/list'),
        meta: { title: '小说章节', icon: 'example' }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: '诗词',
      icon: 'nested'
    },
    children: [
      {
        path: '诗经',
        component: () => import('@/views/shijing/list'), // Parent router-view
        name: '诗经',
        meta: { title: '诗经' },
      },
      {
        path: '诗',
        component: () => import('@/views/poetryArticle/list'),
        name: '诗',
        meta: { title: '诗' }
      },
      {
        path: '词',
        component: () => import('@/views/poems/list'), // Parent router-view
        name: '词',
        meta: { title: '词' },
      },
      {
        path: '论语',
        component: () => import('@/views/lunyu/list'), // Parent router-view
        name: '论语',
        meta: { title: '论语' },
      },
    ]
  },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },
  {
    path: '/famousWorks',
    component: Layout,
    children: [
      {
        path: 'list',
        name: '名著',
        component: () => import('@/views/famousWorks/list'),
        meta: { title: '名著', icon: 'example' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
