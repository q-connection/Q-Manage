<template>
<project-layout>
    <b-row>
        <b-col cols=12>
            <h5>Closed Issues</h5>
        </b-col>
        <b-col cols=12>
            <issues-table use-router only-closed/>
        </b-col>
    </b-row>
</project-layout>
</template>

<script>
    import ProjectLayout from '@/components/project/Layout.vue'
    import IssuesTable from '@/components/issue/Table.vue'

    export default {
        components: {IssuesTable, ProjectLayout}
    }
</script>

<style lang="scss" scoped>

</style>