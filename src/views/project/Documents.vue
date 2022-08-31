<template>
    <project-layout>
        <b-row>
            <b-col cols=12 xl=3 lg=3>
                <wiki-sidebar/>
            </b-col>
            <b-col cols=12 xl=9 lg=9>
                <document-table/>
            </b-col>
        </b-row>
    </project-layout>
</template>

<script>
    import ProjectLayout from '@/components/project/Layout.vue'
    import WikiSidebar from '@/components/wiki/Sidebar.vue'
    import DocumentTable from '@/components/wiki/DocumentTable.vue'

    export default {
        name: 'SpecFilePage',
        components: {ProjectLayout, WikiSidebar, DocumentTable}
    }
</script>

<style lang="scss" scoped>

</style>