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
    {
        path: '/projects/:id/wiki',
        name: 'project-wiki',
        meta: { layout: 'default', requiresAuth: true },
        redirect: {name: 'project-wiki-designs'}
    },    
    {
        path: '/projects/:id/wiki/designs',
        name: 'project-wiki-designs',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'project.design.index' },
        component: () => import('@/views/project/Designs.vue')
    },    
    {
        path: '/projects/:id/wiki/designs/create',
        name: 'project-wiki-designs-create',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'project.design.create' },
        component: () => import('@/views/project/DesignsCreate.vue')
    },    
    {
        path: '/projects/:id/wiki/spec-files',
        name: 'project-wiki-spec-files',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'project.spec.index' },
        component: () => import('@/views/project/SpecFiles.vue')
    },    
    {
        path: '/projects/:id/wiki/spec-files/create',
        name: 'project-wiki-spec-files-create',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'project.spec.create' },
        component: () => import('@/views/project/SpecFilesCreate.vue')
    },    
]