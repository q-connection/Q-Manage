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
                <TableLeaveDays my-team/>
            </b-col>
        </b-row>
    </b-container>
</div>
</template>

<script>
    import TableLeaveDays from '@/components/leave-days/Table.vue'

    export default {
        name: 'PageLeaveDaysMyTeam',
        components: {TableLeaveDays},
        computed: {
            breadcrumb() {
                return [
                    {title: "Dashboard", to: "dashboard"},
                    {title: "Leave Days", to: "leave-days"},
                    {title: "My Team", to: "leave-days-my-team"},
                ]
            }            
        }
    }
</script>

<style lang="scss" scoped>

</style>