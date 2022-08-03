export default [
    {
        path: '/hrm',
        redirect: {name: 'hrm-employees'}
    },
    /** Start:Employyes */
    {
        path: '/hrm/employees',
        name: 'hrm-employees',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'employee.index' },
        component: () => import('@/views/hrm/Employees.vue')
    },
    {
        path: '/hrm/employees/edit/:id',
        name: 'hrm-employees-detail',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'employee.edit' },
        component: () => import('@/views/hrm/EmployeeDetail.vue')
    },
    {
        path: '/hrm/employees/create',
        name: 'hrm-employees-create',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'employee.create' },
        component: () => import('@/views/hrm/EmployeeCreate.vue')
    },
    /** End:Employyes */
    /** Start:Announcements */
    {
        path: '/hrm/announcements',
        name: 'hrm-announcements',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'announcements.index' },
        component: () => import('@/views/hrm/Announcements.vue')
    },
    /** End:Announcements */
    /** Start:Policies */
    {
        path: '/hrm/policies',
        name: 'hrm-policies',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'announcements.index' },
        component: () => import('@/views/hrm/Policies.vue')
    },
    /** End:Policies */
]