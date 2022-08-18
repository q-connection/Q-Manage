<template>
<div class="page-content" :class="{hrm: inHrmRoutes === true}">
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <page-breadcrumb
                    :items="breadcrumb"
                />
            </b-col>
            <b-col cols=12>
                <TableLeaveDays/>
            </b-col>
        </b-row>
    </b-container>
</div>
</template>

<script>
    import TableLeaveDays from '@/components/leave-days/Table.vue'

    export default {
        name: 'PageLeaveDays',
        components: {TableLeaveDays},
        computed: {
            breadcrumb() {
                return [
                    {title: "Dashboard", to: "dashboard"},
                    {title: "Leave Days", to: "leave-days"},
                ]
            }            
        }
    }
</script>

<style lang="scss" scoped>

</style>