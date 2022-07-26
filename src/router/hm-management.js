export default [
    {
        path: '/hm-management',
        redirect: {name: 'hm-employees'}
    },
    {
        path: '/hm-management/employees',
        name: 'hm-employees',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'employee.index' },
        component: () => import('@/views/hm-management/Employees.vue')
    }
]