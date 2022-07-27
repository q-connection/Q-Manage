export default [
    {
        path: '/hrm',
        redirect: {name: 'hrm-employees'}
    },
    {
        path: '/hrm/employees',
        name: 'hrm-employees',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'employee.index' },
        component: () => import('@/views/hrm/Employees.vue')
    },
    {
        path: '/hrm/employees/:id',
        name: 'hrm-employees-detail',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'employee.edit' },
        component: () => import('@/views/hrm/EmployeeDetail.vue')
    },
    {
        path: '/hrm/announcements',
        name: 'hrm-annoucements',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'announcements.index' },
        component: () => import('@/views/hrm/Announcements.vue')
    },
]