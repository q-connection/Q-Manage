<template>
    <div class="position-relative">
        <DesktopNavbar/>
        <notification-main fixed/>
        <hrm-tabs v-if="inHrmRoutes"/>
        <slot/>
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
    }
</script>