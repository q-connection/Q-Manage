export default [
    {
        path: '/projects',
        name: 'projects',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'projects.index' },
        component: () => import('@/views/project/List.vue')
    }
]