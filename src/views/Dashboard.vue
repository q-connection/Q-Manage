<template>
    <div class="container-fluid mb-5">
        <div class="row">
            <div class="col-12 col-xl-3 col-lg-2">
                <user-info-block />
            </div>
            <div class="col-12 col-xl-9 col-lg-10">
                <dashboard-statistics />
                <div class="row">
                    <div class="col-12"  v-if="!$device.mobile">
                        <Projects get-all>
                            <QIcon slot="icon" icon="la:dot-circle" class="icon" width="24" height="24" />
                            <b-badge slot="badges" pill variant="success" class="badges-status">Task</b-badge>
                        </Projects>
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
import Projects from '@/components/Projects.vue';

export default {
    name: "DashboardPage",
    computed: {
        ...mapState({
            user: state => state.user || {}
        })
    },
    components: { Projects }
}
</script>

<style lang="scss" scoped>
</style>