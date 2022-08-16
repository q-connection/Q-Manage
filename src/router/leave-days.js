export default [
    {
        path: '/leave-days',
        name: 'leave-days',
        meta: { layout: 'default', requiresAuth: true },
        component: () => import('@/views/LeaveDays.vue')     
    }
]