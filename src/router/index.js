import Vue from 'vue'
import VueRouter from 'vue-router'
import lodash from 'lodash'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
    {
        path: '/404',
        name: 'not_found',
        meta: { layout: 'blank'},
        component: () => import('@/views/errors/NotFound.vue')        
    },
    {
        path: '/',
        name: 'dashboard',
        meta: { layout: 'default', requiresAuth: true },
        component: () => import('@/views/Dashboard.vue')
    },
    {
        path: '/user/profile',
        name: 'profile',
        meta: { layout: 'default', requiresAuth: true },
        component: () => import('@/views/UserProfile.vue')
    },
    {
        path: '/user/security',
        name: 'secutiry',
        meta: { layout: 'default', requiresAuth: true },
        component: () => import('@/views/UserSecurity.vue')
    },
    {
        path: '/auth/login',
        name: 'login',
        meta: { layout: 'blank', requiresGuest: true },
        component: () => import('@/views/AuthLogin.vue')     
    },  
    {
        path: '/auth/forgot',
        name: 'forgot',
        meta: { layout: 'blank', requiresGuest: true },
        component: () => import('@/views/AuthForgot.vue')     
    },  
    {
        path: '/auth/reset-password/:uuid',
        name: 'reset-password',
        meta: { layout: 'blank', requiresGuest: true },
        component: () => import('@/views/AuthReset.vue')     
    },  
]

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach(async (to, from, next) => {
    const { userInfo } = store.getters;
    const token        = localStorage.getItem('access_token')

    if(!to.name) {
        next({name: "not_found"})
    }

    if(to.matched.some((record) => record.meta.requiresAuth) != from.matched.some((record) => record.meta.requiresAuth)) {
        store.commit('SET_IDLE_LOADING', true)
    }
    
    if (to.matched.some((record) => record.meta.requiresAuth)) {        
        if(lodash.isEmpty(userInfo) && !token) {
            next({name: 'login'});
        } else  {
            if(token) {
                const isLoggedIn = await store.dispatch('fetchUser')

                if(!isLoggedIn) {
                    next({name: 'login'});
                } else {
                    next()
                }
            } else {
                next({name: 'login'});
            }
        }
    } else if (to.matched.some((record) => record.meta.requiresGuest)) {
        if(token) {
            const isLoggedIn = await store.dispatch('fetchUser')
                
            if(isLoggedIn) {
                next({name: 'dashboard'});
            } else {
                next();
            }  
        } else {
            next();
        }
    } else next();
});

router.afterEach(async () => {
    // app.$Progress.finish()
    store.commit('SET_IDLE_LOADING', false)
})

export default router
