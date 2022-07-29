<template>
    <b-navbar type="dark" variant="primary" sticky>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item :to="{name: 'dashboard'}">Dashboard</b-nav-item>
                <b-nav-item-dropdown class="project-dropdown" no-caret>
                    <template #button-content>
                        Projects
                    </template>
                    <b-dropdown-item class="project-names" href="javascript:;" active>
                        <div class="project-title active">
                            OhRey
                        </div>
                        <div class="project-title">
                            KB-Hero
                        </div>
                        <div class="project-title">
                            FOWI
                        </div>
                    </b-dropdown-item>
                    <b-dropdown-form>
                        <b-icon class="mr-1" icon="search" variant="dark"/>
                        <b-input placeholder="Search recenly viewed issues"/>
                    </b-dropdown-form>
                    <b-dropdown-item href="#">
                        <b-icon class="mr-1" icon="record-circle" variant="primary"/>
                        <span class="task-title">[TASK] Login</span>
                    </b-dropdown-item>
                    <b-dropdown-item href="#">
                        <b-icon class="mr-1" icon="record-circle" variant="primary"/>
                        <span class="task-title">[TASK] Register</span>
                    </b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item href="#">Recently Viewed</b-nav-item>
                <b-nav-item v-if="$hasPermission('hrm.index') && $hasPermission('employee.index')" :to="{name: 'hrm-employees'}">HRM</b-nav-item>
                <b-nav-item href="#">
                    <span class="h2">
                        <q-icon icon="bxs:message-square-add"/>
                    </span>
                </b-nav-item>
                <b-nav-form>
                    <div class="attendance-wrapper">
                        <b-form-input :value="getTime" readonly></b-form-input>
                        <form-button variant="primary" v-if="user.today_check_in_at && !user.today_check_out_at" @click="onCheckout" :disabled="isLoggingTime" :loading="isLoggingTime" size="sm">Check Out</form-button>
                        <form-button variant="primary" v-else @click="onCheckin" :disabled="isLoggingTime" :loading="isLoggingTime" size="sm">Check In</form-button>
                    </div>
                </b-nav-form>                
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-item :to="{name: 'announcements'}">
                    <span class="h3">
                        <q-icon icon="clarity:bell-solid"/>
                    </span>                    
                </b-nav-item>

                <b-nav-item href="#">
                    <span class="h3">
                        <q-icon icon="ant-design:question-circle-filled"/>
                    </span>                    
                </b-nav-item>

                <b-nav-item-dropdown class="account-dropdown" right>
                    <template #button-content>
                        <span class="h3 text-white">
                            <q-icon icon="carbon:user-avatar-filled"/>
                        </span>
                    </template>
                    <b-dropdown-item class="account-name" href="javascript:;" active>
                        {{ user.fullname }}
                    </b-dropdown-item>
                    <b-dropdown-item :to="{name: 'profile'}">
                        <span><q-icon icon="bxs:user-rectangle"/>Profile</span>
                    </b-dropdown-item>
                    <b-dropdown-item :to="{name: 'secutiry'}">
                        <span><q-icon icon="teenyicons:password-solid"/>Security</span>
                    </b-dropdown-item>
                    <b-dropdown-item :to="{name: 'announcements'}">
                        <span><q-icon icon="zondicons:announcement"/>Announcements</span>
                    </b-dropdown-item>
                    <b-dropdown-item @click="onLogout">
                        <span><q-icon icon="ri:logout-circle-r-fill"/>Sign Out</span>
                    </b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "DesktopNavbar",
    data: () => ({
        isLoggingTime: false,
    }),

    computed: {
        ...mapState({
            user: state => state.user || {}
        }),

        getTime() {
            return this.$mm().format('LLLL')
        }
    },
    methods: {
        async onLogout() {
            this.$store.commit('SET_IDLE_LOADING', true)
            await this.$store.dispatch('logout')
        },

        async onCheckin() {
            try {
                this.isLoggingTime = true
                const { data } = await this.$http.post('log-time/checkin')

                if(!data.error) {
                    this.$showAlert({type: 'success', message: 'Checkin successfully'})
                    await this.$store.dispatch('fetchUser')
                } else {
                    this.$showAlert({type: 'danger', message: data.message})
                }
            } catch (err) {
                console.log(err)
                this.$showAlert({type: 'danger', message: err.response.data.message})
            } finally {
                this.isLoggingTime = false
            }
        },

        async onCheckout() {
            try {
                this.isLoggingTime = true
                const { data } = await this.$http.post('log-time/checkout/' + this.user.last_checkin_id)

                if(!data.error) {
                    this.$showAlert({type: 'success', message: 'Checkout successfully'})
                    await this.$store.dispatch('fetchUser')
                } else {
                    this.$showAlert({type: 'danger', message: data.message})
                }
            } catch (err) {
                console.log(err)
                this.$showAlert({type: 'danger', message: err.response.data.message})
            } finally {
                this.isLoggingTime = false
            }
        },


    }
};
</script>

<style lang="scss" scoped>
.attendance-wrapper {
    position: relative;
    
    .form-control {
        width: 370px;
        border: 0;
        min-height: 36px;

        &:disabled, &[readonly] {        
            background-color: #fff;
        }
    }

    .btn {
        position: absolute;
        top: 50%;
        right: 4px;
        transform: translateY(-50%);
        border-radius: 8px;
        color: #fff;
        padding: .20rem .5rem;
        min-width: auto;
        font-size: 16px;
        height: auto;

        &:hover {
            outline: none;
        }
    }
}

.router-link-exact-active {
    font-weight: bold;
}
</style>
