<template>
    <div>
        <DesktopNavbar/>
        <div class="page-content">
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
        }
    }
</script>

<style lang="scss">
.page-content {
    padding-top: 60px
}
</style>