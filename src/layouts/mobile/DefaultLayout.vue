<template>
    <div class="position-relative">
        <Header/>
        <div class="page-content">
            <slot/>
        </div>
        <ProjectFixedButton/>
        <Navbar/>
    </div>
</template>

<script>
    import Navbar from '@/components/mobile/Navbar.vue'
    import ProjectFixedButton from '@/components/mobile/ProjectFixedButton.vue'
    import Header from '@/components/mobile/Header.vue'

    export default {
        components: {Navbar, ProjectFixedButton, Header}
    }
</script>

<style lang="scss" scoped>
.page-content {
    padding-top: 68px;
    margin-bottom: 40px;
}
</style>