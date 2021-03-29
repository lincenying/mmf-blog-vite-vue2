/* eslint-disable no-inline-comments */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import cookies from 'js-cookie'

import { inBrowser } from '../utils'

const login = () => import(/* webpackChunkName: "backend-login" */ '../pages/backend-login.vue')
const articleList = () => import(/* webpackChunkName: "backend-topics" */ '../pages/backend-article-list.vue')
const articleInsert = () => import(/* webpackChunkName: "backend-topics" */ '../pages/backend-article-insert.vue')
const articleModify = () => import(/* webpackChunkName: "backend-topics" */ '../pages/backend-article-modify.vue')
const articleComment = () => import(/* webpackChunkName: "backend-topics" */ '../pages/backend-article-comment.vue')

const categoryList = () => import(/* webpackChunkName: "backend-category" */ '../pages/backend-category-list.vue')
const categoryInsert = () => import(/* webpackChunkName: "backend-category" */ '../pages/backend-category-insert.vue')
const categoryModify = () => import(/* webpackChunkName: "backend-category" */ '../pages/backend-category-modify.vue')

const adminList = () => import(/* webpackChunkName: "backend-admin" */ '../pages/backend-admin-list.vue')
const adminModify = () => import(/* webpackChunkName: "backend-admin" */ '../pages/backend-admin-modify.vue')

const userList = () => import(/* webpackChunkName: "backend-user" */ '../pages/backend-user-list.vue')
const userModify = () => import(/* webpackChunkName: "backend-user" */ '../pages/backend-user-modify.vue')

Vue.use(VueRouter)
Vue.use(Meta)

/**
 * to 如果在这个列表中，始终采用从左到右的滑动效果，首页比较适合用这种方式
 *
 * @type {Array.<string>}
 * @const
 */
const alwaysBackPage = ['index', 'trending', 'category', 'search']

/**
 * to 如果在这个列表中，始终采用从右到左的滑动效果
 *
 * @type {Array.<string>}
 * @const
 */
const alwaysForwardPage = ['frontend-article']

/**
 * 历史记录，记录访问过的页面的 fullPath
 *
 * @type {Array.<string>}
 * @const
 */
const historyStack = []

/**
 * 判断当前是否是前进，true 表示是前进，否则是回退
 *
 * @param {Object} to 目标 route
 * @param {Object} from 源 route
 * @return {boolean} 是否表示返回
 */
const isForward = (to, from) => {
    // to 如果在这个列表中，始终认为是后退
    if (to.name && alwaysBackPage.indexOf(to.name) !== -1) {
        // 清空历史
        historyStack.length = 0
        return false
    }

    if (from.name && alwaysBackPage.indexOf(from.name) !== -1) {
        // 如果是从 alwaysBackPage 过来的，那么永远都是前进
        historyStack.push(to.fullPath)
        return true
    }

    if (to.name && alwaysForwardPage.indexOf(to.name) !== -1) {
        // to 如果在这个列表中，始终认为是前进
        historyStack.push(to.fullPath)
        return true
    }

    // 根据 fullPath 判断当前页面是否访问过，如果访问过，则属于返回
    const index = historyStack.indexOf(to.fullPath)
    if (index !== -1) {
        historyStack.length = index + 1
        return false
    }

    // 将 to.fullPath 加到栈顶
    historyStack.push(to.fullPath)
    return true
}

const scrollBehavior = to => {
    const position = {}
    if (to.hash) {
        position.selector = to.hash
    }
    if (to.matched.some(mm => mm.meta.scrollToTop)) {
        position.x = 0
        position.y = 0
    }
    return position
}

const index = () => import(/* webpackChunkName: "frontend-topics" */ '../pages/frontend-index.vue')

const guardRoute = (to, from, next) => {
    var token = cookies.get('user') || !inBrowser
    if (!token) {
        next('/')
    } else {
        next()
    }
}
const guardRouteBackend = (to, from, next) => {
    const token = cookies.get('b_user') || !inBrowser
    if (!token) {
        next('/backend')
    } else {
        next()
    }
}

export function createRouter() {
    const router = new VueRouter({
        mode: 'history',
        //base: __dirname,
        scrollBehavior,
        routes: [
            {
                name: 'index',
                path: '/',
                component: index
            },
            {
                name: 'trending',
                path: '/trending/:by',
                component: index
            },
            {
                name: 'category',
                path: '/category/:id',
                component: index
            },
            {
                name: 'search',
                path: '/search/:key',
                component: index
            },
            {
                name: 'article',
                path: '/article/:id',
                component: () => import(/* webpackChunkName: "frontend-topics" */ '../pages/frontend-article.vue'),
                meta: { scrollToTop: true, notKeepAlive: true }
            },
            {
                name: 'about',
                path: '/about',
                component: () => import(/* webpackChunkName: "frontend-about" */ '../pages/frontend-about.vue'),
                meta: { scrollToTop: true }
            },
            {
                name: 'account',
                path: '/user/account',
                component: () => import(/* webpackChunkName: "frontend-user" */ '../pages/frontend-user-account.vue'),
                meta: { scrollToTop: true },
                beforeEnter: guardRoute
            },
            {
                name: 'password',
                path: '/user/password',
                component: () => import(/* webpackChunkName: "frontend-user" */ '../pages/frontend-user-password.vue'),
                meta: { scrollToTop: true },
                beforeEnter: guardRoute
            },
            { name: 'login', path: '/backend', component: login },

            {
                name: 'admin_list',
                path: '/backend/admin/list',
                component: adminList,
                meta: { scrollToTop: true },
                beforeEnter: guardRouteBackend
            },
            {
                name: 'admin_modify',
                path: '/backend/admin/modify/:id',
                component: adminModify,
                meta: { scrollToTop: true },
                beforeEnter: guardRouteBackend
            },

            {
                name: 'article_list',
                path: '/backend/article/list',
                component: articleList,
                meta: { scrollToTop: true },
                beforeEnter: guardRouteBackend
            },
            {
                name: 'article_insert',
                path: '/backend/article/insert',
                component: articleInsert,
                meta: { scrollToTop: true },
                beforeEnter: guardRouteBackend
            },
            {
                name: 'article_modify',
                path: '/backend/article/modify/:id',
                component: articleModify,
                meta: { scrollToTop: true },
                beforeEnter: guardRouteBackend
            },
            {
                name: 'article_comment',
                path: '/backend/article/comment/:id',
                component: articleComment,
                meta: { scrollToTop: true },
                beforeEnter: guardRouteBackend
            },

            {
                name: 'category_list',
                path: '/backend/category/list',
                component: categoryList,
                meta: { scrollToTop: true },
                beforeEnter: guardRouteBackend
            },
            {
                name: 'category_insert',
                path: '/backend/category/insert',
                component: categoryInsert,
                meta: { scrollToTop: true },
                beforeEnter: guardRouteBackend
            },
            {
                name: 'category_modify',
                path: '/backend/category/modify/:id',
                component: categoryModify,
                meta: { scrollToTop: true },
                beforeEnter: guardRouteBackend
            },

            {
                name: 'user_list',
                path: '/backend/user/list',
                component: userList,
                meta: { scrollToTop: true },
                beforeEnter: guardRouteBackend
            },
            {
                name: 'user_modify',
                path: '/backend/user/modify/:id',
                component: userModify,
                meta: { scrollToTop: true },
                beforeEnter: guardRouteBackend
            }
        ]
    })
    /**
     * 切换动画名称
     *
     * @type {string}
     * @const
     */
    const slideLeft = 'slide-left'

    /**
     * 切换动画名称
     *
     * @type {string}
     * @const
     */
    const slideRight = 'slide-right'

    router.beforeEach((to, from, next) => {
        if (router.app.$store) {
            // 如果不需要切换动画，直接返回
            if (router.app.$store.state.appShell.needPageTransition) {
                // 判断当前是前进还是后退，添加不同的动画效果
                const pageTransitionName = isForward(to, from) ? slideLeft : slideRight
                router.app.$store.commit(`appShell/setPageTransitionName`, { pageTransitionName })
            }
        }
        next()
    })

    return router
}
