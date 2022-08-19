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
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'issues.index' },
        component: () => import('@/views/project/Issues.vue')
    },
    {
        path: '/projects/:id/issues/create',
        name: 'project-issues-create',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'issues.create' },
        component: () => import('@/views/project/IssuesCreate.vue')
    },
    {
        path: '/projects/:id/issues/edit/:issue_id',
        name: 'project-issues-edit',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'issues.edit' },
        component: () => import('@/views/project/IssuesEdit.vue')
    },
]