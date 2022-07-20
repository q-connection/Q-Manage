<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12 col-xl-3 col-lg-2">
                <div class="dashboard-user-info">
                    <h5 class="mb-1">{{ user.fullname }}</h5>
                    <div>Department: <b>{{ user.role_name }}</b></div>
                    <div>Check-in at: <b class="text-danger">{{ formatTime(user.today_check_in_at) }}</b></div>
                    <div>Check-out at: <b class="text-danger">{{ formatTime(user.today_check_out_at) }}</b></div>
                    <hr>
                    <h5 v-if="!user.today_check_in_at">Not working today</h5>
                    <h5 v-else-if="user.today_check_in_at && !user.today_check_out_at" class="text-success">Working</h5>
                    <h5 v-else class="text-danger">End of shift</h5>
                </div>
            </div>
            <div class="col-12 col-xl-9 col-lg-10">
                <div class="dashboard-statistics">
                    <div class="row">
                        <div class="col-12 col-xl-4 col-lg-4">
                            <div class="d-flex align-items-center p-3" style="cursor: pointer" @click="$router.push({name: 'projects'})">
                                <img src="/images/icons/projects.png"/>
                                <div class="statistic-content ml-3">
                                    <h4 class="mb-1">PROJECTS</h4>
                                    <div>4 projects</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-4 col-lg-4">
                            <div class="d-flex align-items-center p-3" style="cursor: pointer" @click="$router.push({name: 'tasks'})">
                                <img src="/images/icons/tasks.png"/>
                                <div class="statistic-content ml-3">
                                    <h4 class="mb-1">TASKS</h4>
                                    <div>11 tasks</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-xl-4 col-lg-4">
                            <div class="d-flex align-items-center p-3" style="cursor: pointer" @click="$router.push({name: 'bugs'})">
                                <img src="/images/icons/bugs.png"/>
                                <div class="statistic-content ml-3">
                                    <h4 class="mb-1">BUGS</h4>
                                    <div>4 bugs</div>
                                </div>
                            </div>
                        </div>                      
                    </div>
                </div>
                <organization-chart :datasource="ds" v-if="ds"></organization-chart>                
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import OrganizationChart from 'vue-organization-chart'

    export default {
        name: 'DashboardPage',
        components: {OrganizationChart},

        data: () => ({
            ds: null
        }),

        computed: {
            ...mapState({
                user: state => state.user || {}
            })
        },

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
            },

            formatTime(time) {
                if(!time || time == 'N/A') {
                    return 'N/A';
                }

                return this.$mm(time).format('HH:mm')
            }
        }
    }
</script>

<style lang="scss" scoped>
.dashboard-statistics {
    background-color: #F5F5F5;
    border-radius: 10px;
    padding: .5rem;
    margin-bottom: .75rem;

    img {
        height: 63px;
        width: 76px;
        object-fit: contain;
    }
}
</style>