<template>
    <div class="position-relative">
        <DesktopNavbar/>
        <notification-main fixed/>
        <hrm-tabs v-if="inHrmRoutes"/>
        <div class="page-content" :class="{hrm: inHrmRoutes === true}">
            <slot/>
        </div>
        <sticky-footer/>
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

        computed: {
            inHrmRoutes() {
                return this.$route.name.indexOf('hrm') !== -1
            }
        }
    }
</script>

<style lang="scss">
.page-content {
    padding-top: 60px;
    padding-bottom: 60px;

    &.hrm {
        padding-top: 30px
    }
}

.hrm-tabs {
    margin-top: 2rem;
}
</style>