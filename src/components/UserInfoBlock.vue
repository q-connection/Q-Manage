<template>
    <div class="dashboard-user-info">
        <h5 class="mb-1">{{ user.fullname }}</h5>
        <div>Department: <b>{{ user.department_name }}</b></div>
        <div>Position title: <b>{{ user.role_name }}</b></div>
        <div>Check-in at: <b class="text-danger">{{ formatTime(user.today_check_in_at) }}</b></div>
        <div>Check-out at: <b class="text-danger">{{ formatTime(user.today_check_out_at) }}</b></div>
        <hr>
        <h5 v-if="!user.today_check_in_at">Not working today</h5>
        <h5 v-else-if="user.today_check_in_at && !user.today_check_out_at" class="text-success">Working</h5>
        <h5 v-else class="text-danger">End of shift</h5>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        computed: {
            ...mapState({
                user: state => state.user || {}
            })
        },
        
        methods: {
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

</style>