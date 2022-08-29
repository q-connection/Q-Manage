<template>
    <div class="position-relative">
        <DesktopNavbar/>
        <notification-main fixed/>
        <hrm-tabs v-if="inHrmRoutes"/>
        <slot/>
        <sticky-footer/>
        <popup-notification :show="showPopupNotification"/>
    </div>
</template>

<script>
    import DesktopNavbar from '@/components/desktop/Navbar.vue'
    import StickyFooter from '@/components/StickyFooter.vue'
    
    export default {
        components: {
            DesktopNavbar,
            StickyFooter
        },

        data: () => ({
            showPopupNotification: false
        }),

        mounted() {
            if(!localStorage.getItem('notification-initialized')) {
                setTimeout(() => {
                    this.showPopupNotification = true
                }, 3000)
            }
        },
    }
</script>