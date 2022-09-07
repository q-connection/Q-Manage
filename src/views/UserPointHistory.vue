<template>
    <div class="page-content">
        <b-container fluid>
            <PointHistoryTable/>
        </b-container>
    </div>
</template>

<script>
    import PointHistoryTable from '@/components/employee/PointHistoryTable.vue'

    export default {
        components: {PointHistoryTable}
    }
</script>