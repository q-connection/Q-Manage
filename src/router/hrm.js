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
        path: '/hrm/employees/inactive',
        name: 'hrm-employees-inactive',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'employee.index' },
        component: () => import('@/views/hrm/EmployeesInactive.vue')
    },
    {
        path: '/hrm/employees/point-history/:id',
        name: 'hrm-employees-point-history',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'employee.index' },
        component: () => import('@/views/hrm/EmployeePointHistory.vue')
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
    /** Start:Leave Days */
    {
        path: '/hrm/leave-days',
        name: 'hrm-leave-days',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'annual-leave.index' },
        component: () => import('@/views/hrm/LeaveDays.vue')
    },
    /** End:Leave Days */
    {
        path: '/hrm/timekeeping',
        name: 'hrm-timekeeping',
        meta: { layout: 'default', requiresAuth: true, requiresPermission: 'log-time.index' },
        component: () => import('@/views/hrm/Timekeeping.vue')        
    }
]