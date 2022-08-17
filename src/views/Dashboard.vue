<template>
    <div class="container-fluid mb-5">
        <div class="row">
            <div class="col-12 col-xl-3 col-lg-2">
                <user-info-block  v-if="!$device.mobile"/>
                <user-notworking v-if="!$device.mobile"/>
                <notification-main class="mb-3" v-if="$device.mobile" />
            </div>
            <div class="col-12 col-xl-9 col-lg-10">
                <dashboard-statistics />
                <div class="row" v-if="!$device.mobile">
                    <div class="col-12">
                        <issues-table/>
                    </div>
                </div>
            </div>
            <div class="col-12" v-if="$device.mobile">
                <user-notworking />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import IssuesTable from '@/components/issue/Table.vue'

export default {
    name: "DashboardPage",
    components: {IssuesTable},
    computed: {
        ...mapState({
            user: state => state.user || {}
        })
    },
    data: () => ({
        currentTab: 'project'
    })
}
</script>

<style lang="scss" scoped>
</style>