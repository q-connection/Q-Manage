<template>
    <div class="position-relative">
        <DesktopNavbar/>
        <notification-main fixed/>
        <div class="page-content">
            <slot/>
        </div>
        <sticky-footer/>
        <b-modal id="modal-organization" hide-footer size="lg">
            <template #modal-title>
                Organizational Chart
            </template>
            <div class="orgchart-wrapper" v-if="ds">
                <organization-chart :datasource="ds" zoom pan/>          
            </div>
        </b-modal>
    </div>
</template>

<script>
    import DesktopNavbar from '@/components/desktop/Navbar.vue'
    import StickyFooter from '@/components/StickyFooter.vue'
    import OrganizationChart from 'vue-organization-chart'
    
    export default {
        components: {
            DesktopNavbar,
            StickyFooter,
            OrganizationChart
        },

        data: () => ({
            ds: null
        }),

        async mounted() {
            await this.fetchOrgChartData()
        },

        methods: {
            async fetchOrgChartData() {
                try {
                    const { data } = await this.$http.get('department/org-chart-data')

                    if(!data.error) {
                        this.ds = data.data
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }        
    }
</script>

<style lang="scss">
.page-content {
    padding-top: 60px;
    padding-bottom: 60px;
}
</style>