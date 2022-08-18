<template>
<div class="page-content" :class="{hrm: inHrmRoutes === true}">
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <TableLeaveDays for-hrm/>
            </b-col>
        </b-row>
    </b-container>
</div>
</template>

<script>
    import TableLeaveDays from '@/components/leave-days/Table.vue'

    export default {
        name: 'HrmLeaveDays',
        components: {TableLeaveDays}
    }
</script>

<style lang="scss" scoped>

</style>