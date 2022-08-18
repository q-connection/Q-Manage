export default [
    {
        path: '/projects',
        name: 'projects',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'projects.index' },
        component: () => import('@/views/project/Index.vue')
    },
    {
        path: '/projects/:id',
        name: 'project-detail',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'projects.index' },
        redirect: {name: 'project-issues'}
    },
    {
        path: '/projects/:id/issues',
        name: 'project-issues',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'projects.index' },
        component: () => import('@/views/project/Issues.vue')
    }
]