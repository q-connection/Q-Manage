<template>
    <div class="position-relative">
        <DesktopNavbar/>
        <notification-main fixed/>
        <hrm-tabs v-if="inHrmRoutes"/>
        <slot/>
        <sticky-footer/>
        <popup-notification/>
    </div>
</template>

<script>
    import DesktopNavbar from '@/components/desktop/Navbar.vue'
    import StickyFooter from '@/components/StickyFooter.vue'
    import { mapActions } from 'vuex'

    export default {
        components: {
            DesktopNavbar,
            StickyFooter
        },
        mounted() {
            this.fetchBasicData()    
            this.fetchOrgChartData()    
        },        
        methods: {
            ...mapActions(['fetchBasicData']),
            async fetchOrgChartData() {
                try {
                    const { data } = await this.$http.get('department/org-chart-data')

                    if(!data.error) {
                        this.$store.commit('SET_ORG_CHART_DATA', data.data)
                    }
                } catch (err) {
                    console.log(err)
                }
            },            
        }        
    }
</script>