<template>
    <div class="container-fluid mb-5">
        <div class="row">
            <div class="col-12 col-xl-3 col-lg-2">
                <user-info-block />
            </div>
            <div class="col-12 col-xl-9 col-lg-10">
                <dashboard-statistics />
                <div class="row">
                    <div class="col-12">
                     <slot/>
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

export default {
    name: "DashboardPage",
    computed: {
        ...mapState({
            user: state => state.user || {}
        })
    },
}
</script>

<style lang="scss" scoped>
</style>