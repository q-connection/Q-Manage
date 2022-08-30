<template>
    <div class="popup-notification-wrapper" :class="{show: isShow === true}">
        <div class="popup-notification-content">
            <div class="mb-1">
                <img src="/images/logo.png" class="popup-logo">
            </div>
            <p class="px-2">Do you want to receive notifications from <b>QConnection</b>?</p>
            <div class="d-flex justify-content-end">
                <b-button
                    variant="outline-dark"
                    size="sm"
                    class="mr-2 p-2"
                    @click="cancel(2)"
                >
                    Cancel
                </b-button>
                <form-button
                    variant="outline-success"
                    size="sm"
                    class="p-2"
                    @click="subscribe"
                    :loading="is_loading"
                    :disabled="is_loading"
                >
                    Allow
                </form-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => ({
            isShow: false,
            is_loading: false
        }),
        mounted() {
            this.initialState()
        },
        methods: {
            async requestPermission() {
                const permission = await Notification.requestPermission()

                if(permission !== 'granted') {
                    this.$toast.error('Permission for Notifications was denied')
                    return false
                }

                return true
            },

            initialState() {
                if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
                    this.$toast.error('Notifications aren\'t supported.')

                    return;
                }

                if (Notification.permission === 'denied') {
                    this.$toast.error('The user has blocked notifications.');

                    return;
                }

                if (!('PushManager' in window)) {
                   this.$toast.error('Push messaging isn\'t supported.');

                    return;
                }

                let cached_data = localStorage.getItem('notification-initialized')

                if(!cached_data) {
                    cached_data = {}
                } else {
                    cached_data = JSON.parse(cached_data)
                }

                const expired_at = parseInt(this.$mm(cached_data.expired_at || null).format('YYYYMMDD'))
                const now = parseInt(this.$mm().format('YYYYMMDD'))
                
                if(!cached_data.expired_at || expired_at <= now) {
                    localStorage.removeItem('notification-initialized')
                    setTimeout(() => {
                        this.isShow = true
                    }, 1000)
                } else {
                    this.isShow = false
                    this.subscribe()
                }                
            },

            subscribe() {
                this.is_loading = true
                const vapidKey  = process.env.VUE_APP_VAPID_KEY || ''
                const messaging = this.$firebase.messaging()
                
                messaging.getToken({ vapidKey })
                .then(async (currentToken) => {
                    if (currentToken) {
                        const { data } = await this.$http.post('employee/fcm-token', {token: currentToken})

                        if(!data.error) {
                            this.cancel(30)
                        } else {
                            this.$toast.error(data.message)
                        }
                    } else {
                        const permission = await this.requestPermission()

                        if(permission == 'granted') {
                            this.subscribe()
                        } else {
                            this.$toast.error("Notification has been denied.")
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                    this.$toast.error("Something went wrong, please try again later.")
                })
                .finally(() => this.is_loading = false)
            },

            sendSubscriptionToServer(subscription) {
                console.log(subscription)
                this.cancel(30)
            },

            cancel(day = 1) {
                this.isShow = false
                localStorage.setItem('notification-initialized', JSON.stringify({
                    value: true,
                    expired_at: this.$mm().add(day, 'days').format('YYYY-MM-DD HH:mm:ss')
                }))                   
            }
        }
    }
</script>

<style lang="scss" scoped>
.popup-notification-wrapper {
    position: fixed;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1021;
    transition: .35s;
    overflow: hidden;

    &.show {
        top: 0
    }

    .popup-notification-content {
        width: 500px;
        height: 160px;
        max-width: 95%;
        background: #fff;
        padding: 1rem;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 8%) !important;

        .popup-logo {
            width: auto;
            height: 48px;
            object-fit: cover;
        }
    }
}
</style>