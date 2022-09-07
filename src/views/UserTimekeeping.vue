<template>
    <div class="page-content">
        <b-container fluid>
            <timekeeping-table/>
        </b-container>
    </div>
</template>

<script>
    import TimekeepingTable from '@/components/employee/TimekeepingTable.vue'

    export default {
        components: {TimekeepingTable}
    }
</script>

<style lang="scss" scoped>

</style>