<template>
    <Dashboard>
        <Projects>
            <QIcon slot="icon" icon="la:dot-circle" class="icon" width="24" height="24" />
            <b-badge slot="badges" pill variant="success" class="badges-status">Task</b-badge>
        </Projects>
    </Dashboard>
</template>

<script>
import { mapState } from 'vuex';
import Projects from '@/components/Projects.vue';
import Dashboard from './Dashboard.vue';

export default {
    name: "DashboardPage",
    computed: {
        ...mapState({
            user: state => state.user || {}
        })
    },
    components: { Projects, Dashboard }
}
</script>

<style lang="scss" scoped>
</style>