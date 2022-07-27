export default [
    {
        path: '/project-list',
        redirect: {name: 'hm-employees'}
    },
    {
        path: '/project-management/projects',
        name: 'hm-projects',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'projects.index' },
        component: () => import('@/views/project-management/Projects.vue')
    }
]