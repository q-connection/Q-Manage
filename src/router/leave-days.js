export default [
    {
        path: '/user/leave-days',
        name: 'leave-days',
        meta: { layout: 'default', requiresAuth: true },
        component: () => import('@/views/LeaveDays.vue')     
    },
    {
        path: '/user/leave-days/my-team',
        name: 'leave-days-my-team',
        meta: { layout: 'default', requiresAuth: true },
        component: () => import('@/views/LeaveDaysMyTeam.vue')     
    },
    {
        path: '/leave-day-status',
        name: 'leave-days-status',
        meta: { layout: 'blank' },
        component: () => import('@/views/LeaveDaysStatus.vue')     
    },
]