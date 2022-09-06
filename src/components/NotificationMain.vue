
<template>
    <div class="notifications" :class="{fixed}">
        <div class="notifications-content" v-if="anno">
            <marquee>
                <router-link :to="{name: 'view-announcement', params: {id: anno.id}}">
                    <q-icon icon="zondicons:announcement"/>
                    {{ anno.title || '' }}
                </router-link>
            </marquee>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            fixed: {
                type: Boolean,
                default: false
            }
        },

        data: () => ({
            anno: null
        }),

        async mounted() {
            await this.fetchAnnouncement()
        },

        methods: {
            async fetchAnnouncement() {
                try {
                    const { data } = await this.$http.get('announcements/latest')

                    if(!data.error) {
                        this.anno = data.data
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.notifications {
    background-color: #fff;
    font-weight: bold;

    &.fixed {
        position: fixed;
        top: 62px;
        left: 0;
        width: 100%;
        z-index: 1;
    }

    .notifications-content {
        background: #F5F5F5;      
        padding: .15rem; 
    }
}
</style>