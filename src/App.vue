<template>
    <div id="app">
        <component :is="layout">
            <router-view />
        </component>
        <idle-screen />
        <alert-custom />
        <vue-progress-bar/>
        <b-modal id="modal-organization" hide-footer size="xl">
            <template #modal-title>
                Organizational Chart
            </template>
            <div class="orgchart-wrapper" v-if="ds">
                <organization-chart :datasource="ds" zoom pan/>          
            </div>
        </b-modal>        
        <DailyReportVue/>
        <div class="notification-wrapper">
            <transition-group name="fade" tag="div" class="notification-content">
                <div class="notification-item" v-for="(noti, index) in notifications" :key="index" @click="onNotiClicked(index)">
                    <div class="d-flex w-100">
                        <div class="notification-logo">
                            <img src="/images/favicon.png">
                        </div>
                        <div class="notification-body pl-3 pt-2 w-100">
                            <div class="title">{{ noti.title }}</div>
                            <div class="text-muted">{{ noti.datetime }}</div>
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script>
import OrganizationChart from 'vue-organization-chart'
import DailyReportVue from './components/daily-report/DailyReport.vue';
import {v4 as uuid} from 'uuid'

export default {
    name: "App",
    components: {OrganizationChart,DailyReportVue},

    data: () => ({
        innerWidth: 0,
        innerHeight: 0,
        notifications: []
    }),

    computed: {
        layout() {
            let device = this.$device.mobile ? "mobile" : "desktop";

            if(device == 'desktop' && this.innerWidth < 1200) {
                device = 'mobile'
            }

            if(device == 'mobile' && this.innerWidth >= 1200) {
                device = 'desktop'
            }

            return (this.$route.meta.layout || "blank") + `-${device}-layout`;
        },

        ds() {
            return this.$store.state.org_chart_data
        }
    },

    created() {
        this.$root.$on('disableAnnouncement', (resp) => {
            this.$nextTick(() => {
                const el = document.querySelector('.hrm-tabs')
                
                if(resp && el) {
                    el.style.marginTop = 0;
                    el.style.padding = 0;
                }          
                
                if(!resp && el) {
                    el.style.marginTop = '2rem';
                    el.style.padding = '0.5 0 0 0';
                }
            })
        })
    },

    mounted() {
        const that = this;
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;

        window.addEventListener("resize", function () {
            that.innerWidth = window.innerWidth;
            that.innerHeight = window.innerHeight;
        });     
        
        this.initFirebase()
    },    
    
    methods: {
        initFirebase() {
            const messaging = this.$firebase.messaging();
            messaging.onMessage((payload) => {
                this.pushNotification(payload)
                this.$root.$emit('onNewNotification', true) 
            });            
        },
        pushNotification(payload) {
            const noti = payload.notification,
                  data = payload.data || {},
                  id   = uuid().toString().split('-')[0];

            this.notifications.push({
                id,
                title: noti.title,
                datetime: this.$mm().format('DD/MM/YYYY HH:mm:ss'),
                data: {
                    type: data.type || 'none',
                    id: data.id || null,
                    url: data.url || '#'
                }
            })

            setTimeout(() => {
                const idx = this.notifications.findIndex(x => x.id == id)

                if(idx !== -1) {
                    this.$delete(this.notifications, idx)
                }
            }, 10000)
        },

        async onNotiClicked(idx) {
            const noti = Object.assign({}, this.notifications[idx])
            this.$delete(this.notifications, idx)

            try {
                await this.$http.put('notifications/seen/' + noti.data.id)
            } catch (err) {
                console.log(err)
            }

            if(noti.url) {
                window.location.href = noti.url
                return
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.notification-wrapper {
    position: fixed;
    z-index: 9999;
    bottom: 1.5rem;
    right: 1.5rem;    

    .notification-content {
        position: relative;

        .notification-item {
            width: 360px;
            max-width: 95%;
            background: #fff;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 10px;
            padding: .75rem;
            margin-bottom: .75rem;
            cursor: pointer;

            .notification-logo {
                width: 48px;
                height: 48px;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    -o-object-fit: contain
                }
            }

            .title {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;         
                font-weight: bold       
            }
        }
    }
}
</style>

<style lang="scss">
@import "@/assets/sass/main.scss";
</style>