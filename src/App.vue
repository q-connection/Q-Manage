<template>
    <div id="app">
        <component :is="layout">
            <router-view />
        </component>
        <idle-screen />
        <alert-custom />
        <vue-progress-bar/>
        <b-modal id="modal-organization" hide-footer size="xl">
            <template #modal-title>
                Organizational Chart
            </template>
            <div class="orgchart-wrapper" v-if="ds">
                <organization-chart :datasource="ds" zoom pan/>          
            </div>
        </b-modal>        
        <DailyReportVue/>
    </div>
</template>

<script>
import OrganizationChart from 'vue-organization-chart'
import DailyReportVue from './components/daily-report/DailyReport.vue';
import { mapActions } from 'vuex';

export default {
    name: "App",
    components: {OrganizationChart,DailyReportVue},

    data: () => ({
        innerWidth: 0,
        innerHeight: 0,
        ds: null
    }),

    computed: {
        layout() {
            let device = this.$device.mobile ? "mobile" : "desktop";

            if(device == 'desktop' && this.innerWidth < 1200) {
                device = 'mobile'
            }

            if(device == 'mobile' && this.innerWidth >= 1200) {
                device = 'desktop'
            }

            return (this.$route.meta.layout || "blank") + `-${device}-layout`;
        },
    },
    mounted() {
        const that = this;
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;

        window.addEventListener("resize", function () {
            that.innerWidth = window.innerWidth;
            that.innerHeight = window.innerHeight;
        });

        this.fetchOrgChartData()
        this.fetchBasicData()
    },    
    
    methods: {
        ...mapActions(['fetchBasicData']),
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
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
</style>