export default [
    {
        path: '/leave-days',
        name: 'leave-days',
        meta: { layout: 'default', requiresAuth: true },
        component: () => import('@/views/LeaveDays.vue')     
    },
    {
        path: '/leave-day-status',
        name: 'leave-days-status',
        meta: { layout: 'blank' },
        component: () => import('@/views/LeaveDaysStatus.vue')     
    },
]