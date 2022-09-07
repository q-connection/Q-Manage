<template>
    <div class="page-content hrm">
        <b-container fluid>
            <PointHistoryTable :employee-id="employeeId"/>
        </b-container>
    </div>
</template>

<script>
    import PointHistoryTable from '@/components/employee/PoinHistoryTable.vue'

    export default {
        components: {PointHistoryTable},
        computed: {
            employeeId() {
                return this.$route.params.id
            }
        }
    }
</script>