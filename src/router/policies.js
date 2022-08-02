export default [
    {
        path: '/policies',
        name: 'policies',
        meta: { layout: 'default', requiresAuth: true },
        component: () => import('@/views/Policies.vue')     
    },  
    {
        path: '/policies/:id',
        name: 'view-policy',
        meta: { layout: 'default', requiresAuth: true },
        component: () => import('@/views/PolicyDetail.vue')     
    },  
]