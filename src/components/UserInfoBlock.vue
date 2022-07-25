<template>
    <div class="dashboard-user-info mb-3">
        <div class="user-avatar shadow-sm">
            <img src="/images/default-avatar.png" />
        </div>
        <div class="user-info">
            <h5 class="mb-1">{{ user.fullname }}</h5>
            <div>Department: <b>{{ user.department_name }}</b></div>
            <div>Position: <b>{{ user.role_name }}</b></div>
            <div>Point: <b>{{ user.point || 0 }}</b></div>
            <div>Check-in at: <b class="text-danger">{{ formatTime(user.today_check_in_at) }}</b></div>
            <div>Check-out at: <b class="text-danger">{{ formatTime(user.today_check_out_at) }}</b></div>
            <hr>
            <div v-if="not_working_users.length > 0">
                <div class="d-flex">
                    <h5>Not working today</h5>
                    <img src="/images/icons/down.png" :class="[{'not-show': !is_show_working_users},'ml-auto', 'icon-down']"  @click="is_show_working_users=!is_show_working_users" />
                </div>
                <div class="user-notworking-wrapper" v-show="is_show_working_users">
                    <div class="notworking-item" v-for="(u, index) in not_working_users" :key="index">
                        {{ u }}
                    </div>
                </div>
            </div>
            <div class="text-right mt-2">
                <h5 class="text-primary text-cursor" @click="$bvModal.show('modal-organization')">
                    Organizational Charts
                </h5>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data: () => ({
        not_working_users: [],
        is_show_working_users: true,
    }),

    computed: {
        ...mapState({
            user: state => state.user || {}
        })
    },

    async mounted() {
        await this.fetchNotWorkingUsers()
    },

    methods: {
        async fetchNotWorkingUsers() {
            try {
                const { data } = await this.$http.get('employee/not-working-today')

                if (!data.error) {
                    this.not_working_users = data.data.map((x) => x.name)
                }
            } catch (err) {
                console.log(err)
            }
        },

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
.user-avatar {
    border-radius: 50%;
    background: var(--light);
    width: 150px;
    height: 150px;
    padding: .5rem;
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

    .user-notworking-wrapper {
        margin-top: 10px;
        max-height: 150px;
        overflow: auto;

        .notworking-item {
            padding: .25rem .5rem;
            font-size: 18px;
            background: #F5F5F5;
            border-bottom: 1px solid #d9d9d9;
            margin-bottom: 5px;
        }
    }
}
</style>