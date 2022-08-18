<template>
<div class="page-content" :class="{hrm: inHrmRoutes === true}">
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <page-breadcrumb :items="breadcrumb"/>
            </b-col>
            <b-col cols=12>
                <TableAnnouncements only-view/>
            </b-col>
        </b-row>
    </b-container>
</div>
</template>

<script>
    import TableAnnouncements from '@/components/announcement/Table.vue'

    export default {
        name: 'PageAnnouncements',
        components: {TableAnnouncements},
        computed: {
            breadcrumb() {
                return [
                    {title: "Dashboard", to: "dashboard"},
                    {title: "Announcements", to: "announcements"}
                ]
            }
        },        
    }
</script>

<style lang="scss" scoped>

</style>