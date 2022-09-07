<template>
    <div class="page-content hrm">
        <b-container fluid>
            <timekeeping-table for-hrm/>
        </b-container>
    </div>
</template>

<script>
    import TimekeepingTable from '@/components/employee/TimekeepingTable.vue'

    export default {
        name: 'HrmTimekeeping',
        components: {TimekeepingTable}
    }
</script>

<style lang="scss" scoped>

</style>