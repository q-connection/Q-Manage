<template>
<div class="page-content" :class="{hrm: inHrmRoutes === true}">
    <div class="container-fluid mb-5">
        <div class="row">
            <div class="col-12 col-xl-3 col-lg-2">
                <user-info-block />
            </div>
            <div class="col-12 col-xl-9 col-lg-10">
                <div class="attendance-wrapper mb-4">
                    <b-form-input :value="getTime" readonly></b-form-input>
                    <form-button variant="success" v-if="$user.today_check_in_at && !$user.today_check_out_at" @click="onCheckout" :disabled="isLoggingTime" :loading="isLoggingTime" size="sm">Check Out</form-button>
                    <form-button variant="success" v-else @click="onCheckin" :disabled="isLoggingTime" :loading="isLoggingTime" size="sm">Check In</form-button>
                </div>                
            </div>
            <div class="col-12">
                <div class="mb-2">
                    <b-button :to="{name: 'profile'}" variant="outline-primary" block>
                        <div class="d-flex align-items-center">
                            <div class="h2 mb-0" style="line-height: 0; width: 40px">
                                <q-icon icon="bxs:user-rectangle"/>
                            </div>
                            <div class="ml-2">Profile</div>
                        </div>
                    </b-button>
                </div>
                <div class="mb-2">
                    <b-button :to="{name: 'announcements'}" variant="outline-primary" block>
                        <div class="d-flex align-items-center">
                            <div class="h2 mb-0" style="line-height: 0; width: 40px">
                                <q-icon icon="zondicons:announcement"/>
                            </div>
                            <div class="ml-2">Announcements</div>
                        </div>
                    </b-button>
                </div>
                <div class="mb-2">
                    <b-button :to="{name: 'policies'}" variant="outline-primary" block>
                        <div class="d-flex align-items-center">
                            <div class="h2 mb-0" style="line-height: 0; width: 40px">
                                <q-icon icon="ic:baseline-policy"/>
                            </div>
                            <div class="ml-2">Policies</div>
                        </div>
                    </b-button>
                </div>
                <div class="mb-5">
                    <b-button :to="{name: 'leave-days'}" variant="outline-primary" block>
                        <div class="d-flex align-items-center">
                            <div class="h2 mb-0" style="line-height: 0; width: 40px">
                                <q-icon icon="ic:baseline-work-history"/>
                            </div>
                            <div class="ml-2">Leave Days</div>
                        </div>
                    </b-button>
                </div>
                <div>
                    <b-button @click="onLogout" variant="danger" block>
                        <div class="d-flex align-items-center justify-content-center">
                            <div class="mr-1">Logout</div>
                            <div class="h2 mb-0" style="line-height: 0; width: 40px">
                                <q-icon icon="ri:logout-circle-r-fill"/>
                            </div>                            
                        </div>
                    </b-button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    export default {
        name: "AccountPage",
        data: () => ({
            isLoggingTime: false,            
        }),

        computed: {
            getTime() {
                return this.$mm().format('LLL')
            },            
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
                    
                    this.$bvModal.show('modal-daily-report');
                    this.isLoggingTime = true
                    const { data } = await this.$http.post('log-time/checkout/' + this.$user.last_checkin_id)

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
    }
</script>

<style lang="scss" scoped>
.attendance-wrapper {
    position: relative;
    border: 1px solid var(--success);
    border-radius: 10px;
    
    .form-control {
        width: 370px;
        max-width: 100%;
        border: 0;
        min-height: 47px;

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
        height: 38px;

        &:hover {
            outline: none;
        }
    }
}
</style>