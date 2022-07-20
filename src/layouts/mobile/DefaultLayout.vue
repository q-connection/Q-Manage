<template>
    <div>
        <div class="page-content">
            <slot/>
        </div>
        <NotificationFixedButton/>
        <ProjectFixedButton/>
        <Navbar/>
    </div>
</template>

<script>
    import Navbar from '@/components/mobile/Navbar.vue'
    import ProjectFixedButton from '@/components/mobile/ProjectFixedButton.vue'
    import NotificationFixedButton from '@/components/mobile/NotificationFixedButton.vue'

    export default {
        components: {Navbar, ProjectFixedButton, NotificationFixedButton}
    }
</script>

<style lang="scss" scoped>
.page-content {
    padding-top: 20px
}
</style>