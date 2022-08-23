<template>
    <div class="position-relative">
        <Header/>
        <hrm-tabs class="pt-4" v-if="inHrmRoutes"/>
        <div class="page-content" :class="{hrm: inHrmRoutes}">
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
        components: {Navbar, ProjectFixedButton, Header},
        computed: {
            inHrmRoutes() {
                return this.$route.name.indexOf('hrm') !== -1
            }
        }        
    }
</script>