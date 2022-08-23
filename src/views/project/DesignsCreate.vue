<template>
    <project-layout>
        <b-row>
            <b-col cols=12 xl=3 lg=3>
                <wiki-sidebar/>
            </b-col>
            <b-col cols=12 xl=9 lg=9>
                <design-form/>
            </b-col>
        </b-row>
    </project-layout>
</template>

<script>
    import ProjectLayout from '@/components/project/Layout.vue'
    import WikiSidebar from '@/components/wiki/Sidebar.vue'
    import DesignForm from '@/components/wiki/DesignForm.vue'

    export default {
        components: {ProjectLayout, WikiSidebar, DesignForm}    
    }
</script>

<style lang="scss" scoped>

</style>