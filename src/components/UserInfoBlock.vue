<template>
    <div>
        <div class="dashboard-user-info mb-3" :class="{ mobile: $device.mobile === true }">
            <div class="user-avatar shadow-sm d-none" v-lazy-container="{selector: 'img'}">
                <img :data-src="user.avatar_url"  data-error="/images/default-avatar.png" />
            </div>
            <div class="user-info">
                <h5 class="mb-1">{{ user.fullname }}</h5>
                <div class="text-primary">{{ user.department_name }}</div>
                <div>Position: <b>{{ user.role_name }}</b></div>
                <div>Point: <b>{{ user.point || 0 }}</b></div>
                <div>Check-in at: <b class="text-danger">{{ formatTime(user.today_check_in_at) }}</b></div>
                <div>Check-out at: <b class="text-danger">{{ formatTime(user.today_check_out_at) }}</b></div>
                <hr v-if="!$device.mobile">
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            user: state => state.user || {}
        })
    },

    methods: {
        formatTime(time) {
            if (!time || time == 'N/A') {
                return 'N/A';
            }

            return this.$mm(time).format('HH:mm')
        }
    }
}
</script>

<style lang="scss" scoped>
.dashboard-user-info {
    .user-avatar {
        border-radius: 50%;
        background: var(--light);
        width: 185px;
        height: 185px;
        border: 1px solid var(--light);
        overflow: hidden;
        margin-bottom: 10px;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .user-info {
        padding-left: .5rem;

        .title-notworking {
            font-style: normal;
            font-weight: 600;
            font-size: 18px;
            line-height: 22px;
        }

    }

    &.mobile {
        text-align: center;
        display: flex;
        align-items: center;
        flex-direction: column;
    }
}

.organizational-chart {
    font-style: italic;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
}
</style>