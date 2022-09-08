<template>
    <div class="page-content">
        <b-container fluid>
            <h5 class="mb-4">Notifications</h5>
            <b-row>
                <b-col cols=12 xl=3 lg=3>
                    <b-list-group class="page-sidebar">
                        <b-list-group-item href="javascript:;" :active="queryParams.type == 'project'" @click="switchType('project')">
                            <div class="d-flex align-items-center">
                                <div class="h3 mb-0" style="line-height: 1; width: 36px">
                                    <q-icon icon="ant-design:project-outlined"/>
                                </div>
                                <div>Projects</div>
                            </div>
                        </b-list-group-item>
                        <b-list-group-item href="javascript:;" :active="queryParams.type == 'others'" @click="switchType('others')">
                            <div class="d-flex align-items-center">
                                <div class="h3 mb-0" style="line-height: 1; width: 36px">
                                    <q-icon icon="carbon:warning-other"/>
                                </div>
                                <div>Others</div>
                            </div>
                        </b-list-group-item>
                    </b-list-group>                    
                </b-col>
                <b-col cols=12 xl=9 lg=9>
                    <b-card body-class="p-0">
                        <b-row>
                            <b-col cols=12>
                                <div class="d-flex justify-content-between px-3 pt-3 pb-2">
                                    <h5 class="mb-0">{{ title }}</h5>
                                    <b-spinner variant="primary" small v-if="is_loading"></b-spinner>
                                </div>
                            </b-col>
                            <b-col cols=12 v-for="(item, index) in history" :key="index">
                                <div class="notification-item" :class="{seen: item.seen}" @click="updateNotiSeen(item.id)">
                                    <div class="pr-2">
                                        <div class="font-weight-bold text-break">
                                            <span class="text-primary">[{{ item.title }}]</span> 
                                            <span v-html="item.action_value"></span>
                                        </div>
                                    </div>
                                    <div class="text-muted">{{ $mm(item.created_at).format('DD/MM/YYYY HH:mm:ss') }}</div>
                                </div>
                            </b-col>
                            <b-col cols=12 v-if="history.length <= 0">
                                <div class="text-muted p-3">
                                    No records to show.
                                </div>
                            </b-col>
                            <b-col cols=12 v-if="queryParams.page < last_page">
                                <div class="text-center text-cursor text-primary p-5" @click="viewMore" :style="is_loading ? 'pointer-events: none' : ''">
                                    <u>View more</u>
                                </div>
                            </b-col>
                        </b-row>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
    export default {
        data: () => ({
            history: [],
            total: 0,
            last_page: 1,
            is_loading: false,
            queryParams: {
                page: 1,
                per_page: 10,
                type: 'project'
            }
        }),

        computed: {
            title() {
                return this.queryParams.type == 'project' ? 'Projects' : 'Others'
            }
        },

        watch: {
            queryParams: {
                deep: true,
                async handler() {
                    await this.fetchHistory()
                }
            }
        },

        async mounted() {
            await this.fetchHistory()
        },

        methods: {
            async fetchHistory() {
                try {
                    this.is_loading = true
                    const params = Object.assign({}, this.queryParams)
                    
                    const { data } = await this.$http.get('notifications', {params})

                    if(!data.error) {
                        this.total = data.data.total
                        this.last_page = data.data.last_page
                        this.history = this.history.concat(data.data.data)
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    this.is_loading = false
                }
            },

            switchType(type) {
                this.history = []
                this.queryParams.type = type
            },

            viewMore() {
                this.queryParams.page += 1
            },

            async updateNotiSeen(id) {
                try {
                    const idx = this.history.findIndex(x => x.id == id)
                    if(idx !== -1) {
                        const obj = this.history[idx]
                        obj.seen = true

                        this.$set(this.history, idx, obj)
                        await this.$http.put('notifications/seen/' + id)
                        if(obj.url) {
                            window.location.href = `/${obj.url}`
                        }                        
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.notification-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    padding: .5rem 1rem;
    border-bottom: 1px solid #F5F5F5;

    &:hover {
        background-color: #F5F5F5;
    }

    &.seen {
        opacity: .65;
    }
}
</style>