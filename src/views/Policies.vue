<template>
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <page-breadcrumb :items="breadcrumb"/>
            </b-col>
            <b-col cols=12>
                <TablePolicy view-only/>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import TablePolicy from '@/components/policy/Table.vue'

    export default {
        name: 'PagePolicies',
        components: {TablePolicy},
        computed: {
            breadcrumb() {
                return [
                    {title: "Dashboard", to: "dashboard"},
                    {title: "Policies", to: "policies"}
                ]
            }
        },        
    }
</script>