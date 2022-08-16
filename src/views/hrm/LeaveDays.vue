<template>
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <TableLeaveDays for-hrm/>
            </b-col>
        </b-row>
    </b-container>
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