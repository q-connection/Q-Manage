<template>
    <div class="position-relative">
        <DesktopNavbar/>
        <notification-main fixed/>
        <hrm-tabs v-if="inHrmRoutes"/>
        <slot/>
        <sticky-footer/>
        <popup-notification :show="showPopupNotification" v-if="isShowPopupAllow"/>
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
            if(!this.isShowPopupAllow()) {
                setTimeout(() => {
                    this.showPopupNotification = true
                }, 3000)
            }
        },

        methods: {
            isShowPopupAllow() {
                let cached_data = localStorage.getItem('notification-initialized')

                if(!cached_data) {
                    cached_data = {}
                } else {
                    cached_data = JSON.parse(cached_data)
                }

                const expired_at = parseInt(this.$mm(cached_data.expired_at || null).format('YYYYMMDD'))
                const now = parseInt(this.$mm().format('YYYYMMDD'))
                
                if(!cached_data.expired_at || expired_at <= now) {
                    localStorage.removeItem('notification-initialized')
                    return false
                } else {
                    return true
                }
            }
        }
    }
</script>