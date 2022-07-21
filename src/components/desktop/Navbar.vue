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
                        <span>[TASK] Login</span>
                    </b-dropdown-item>
                    <b-dropdown-item href="#">
                        <b-icon class="mr-1" icon="record-circle" variant="primary"/>
                        <span>[TASK] Register</span>
                    </b-dropdown-item>
                </b-nav-item-dropdown>
                <b-nav-item href="#">Recently Viewed</b-nav-item>
                <b-nav-item href="#">
                    <span class="h5">
                        <b-icon icon="plus-square-fill"/>
                    </span>
                </b-nav-item>
                <b-nav-form>
                    <div class="attendance-wrapper">
                        <b-form-input :value="getTime" readonly></b-form-input>
                        <form-button variant="primary" v-if="user.today_check_in_at && !user.today_check_out_at" @click="onCheckout" :disabled="isLoggingTime" :loading="isLoggingTime">Check Out</form-button>
                        <form-button variant="primary" v-else @click="onCheckin" :disabled="isLoggingTime" :loading="isLoggingTime">Check In</form-button>
                    </div>
                </b-nav-form>                
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-item href="#">
                    <span class="h5">
                        <b-icon icon="bell-fill"/>
                    </span>                    
                </b-nav-item>

                <b-nav-item href="#">
                    <span class="h5">
                        <b-icon icon="question-circle"/>
                    </span>                    
                </b-nav-item>

                <b-nav-item-dropdown class="account-dropdown" right>
                    <template #button-content>
                        <span class="h5 text-white">
                            <b-icon icon="person-circle"/>
                        </span>
                    </template>
                    <b-dropdown-item class="account-name" href="javascript:;" active>
                        {{ user.fullname }}
                    </b-dropdown-item>
                    <b-dropdown-item :to="{name: 'profile'}">
                        <b-icon icon="person" variant="dark"/>
                        Profile
                    </b-dropdown-item>
                    <b-dropdown-item :to="{name: 'secutiry'}">
                        <b-icon icon="lock" variant="dark"/>
                        Security
                    </b-dropdown-item>
                    <b-dropdown-item @click="onLogout">
                        <b-icon icon="power" variant="dark"/>
                        Sign Out
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
        min-height: 42px;

        &:disabled, &[readonly] {        
            background-color: #fff;
        }
    }

    .btn {
        position: absolute;
        top: 50%;
        right: 5px;
        transform: translateY(-50%);
        border-radius: 5px;
        color: #fff;
        padding: .20rem .5rem;

        &:hover {
            outline: none;
        }
    }
}
</style>
