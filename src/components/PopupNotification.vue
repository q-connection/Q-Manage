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
                    @click="cancel"
                >
                    Cancel
                </b-button>
                <b-button
                    variant="outline-success"
                    size="sm"
                    class="p-2"
                    @click="subscribe"
                >
                    Allow
                </b-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['show'],
        data: () => ({
            isShow: false
        }),
        watch: {
            show: {
                immediate: true,
                handler(val) {
                    this.isShow = val
                }
            },
        },
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

                navigator.serviceWorker.ready.then( serviceWorkerRegistration => {
                    serviceWorkerRegistration.pushManager.getSubscription()
                    .then(subscription => this.sendSubscriptionToServer(subscription))
                    .catch(err => console.log(err))
                })
            },

            subscribe() {
                navigator.serviceWorker.ready.then( serviceWorkerRegistration => {
                    serviceWorkerRegistration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: 'BG1idf27fhLin4lnhLIyS3jbOdfg2hEU8YNDtzFqBhUtSVp-OopFC2pxgv7gTlnnmhAtQZHz9aqM0m4hYVmfdCg'
                    })
                    .then(subscription => this.sendSubscriptionToServer(subscription))
                    .catch(err => {
                        if (Notification.permission === 'denied') {
                            this.$toast.error('Permission for Notifications was denied')
                        } else {
                            console.log(err)
                        }
                    })
                    .finally(() => this.isShow = false)
                }).finally(() => {
                    this.cancel(30)               
                });
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