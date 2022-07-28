export default [
    {
        path: '/announcements',
        name: 'announcements',
        meta: { layout: 'default', requiresAuth: true },
        component: () => import('@/views/Announcements.vue')     
    },  
    {
        path: '/announcements/:id',
        name: 'view-announcement',
        meta: { layout: 'default', requiresAuth: true },
        component: () => import('@/views/AnnouncementDetail.vue')     
    },  
]