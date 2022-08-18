<template>
<div class="page-content" :class="{hrm: inHrmRoutes === true}">
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <div class="p-1">
                    <TablePolicy/>
                </div>
            </b-col>
        </b-row>
    </b-container>
</div>
</template>

<script>
    import TablePolicy from '@/components/policy/Table.vue'

    export default {
        name: 'HrmPolicies',
        components: {TablePolicy}
    }
</script>

<style lang="scss" scoped>

</style>