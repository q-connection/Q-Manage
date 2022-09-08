<template>
    <div>
        <b-row v-if="hrm && employees.length > 0">
            <b-col cols=12 xl=3 lg=3>
                <b-select2
                    class="mb-3"
                    label="fullname"
                    :options="employees"
                    :reduce="emp => emp.id.toString()"
                    v-model="queryParams.employee_id"
                    :clearable="false"
                    :loading="is_loading"
                >
                    <template #option="{username, fullname}">
                        <div>
                            <span class="font-weight-bold">{{ fullname }}</span>
                            <span> - {{ username }}</span>
                        </div>
                    </template>
                    <template #selected-option="{username, fullname}">
                        <div>
                            <span class="font-weight-bold">{{ fullname }}</span>
                            <span> - {{ username }}</span>
                        </div>
                    </template>
                </b-select2>
            </b-col>
        </b-row>
        <h5 class="mb-4">{{ page_title }}</h5>
        <b-row>
            <b-col cols=12 xl=3 lg=3>
                <b-list-group class="page-sidebar">
                    <b-list-group-item href="javascript:;" :active="!queryParams.type" @click="switchType('')">
                        <div class="d-flex align-items-center">
                            <div class="h3 mb-0" style="line-height: 1; width: 36px">
                                <q-icon icon="bi:check-all"/>
                            </div>
                            <div>All</div>
                        </div>
                    </b-list-group-item>
                    <b-list-group-item href="javascript:;" :active="queryParams.type == 'in'" @click="switchType('in')">
                        <div class="d-flex align-items-center">
                            <div class="h3 mb-0" style="line-height: 1; width: 36px">
                                <q-icon icon="bx:log-in"/>
                            </div>
                            <div>In</div>
                        </div>
                    </b-list-group-item>
                    <b-list-group-item href="javascript:;" :active="queryParams.type == 'out'" @click="switchType('out')">
                        <div class="d-flex align-items-center">
                            <div class="h3 mb-0" style="line-height: 1; width: 36px">
                                <q-icon icon="bx:log-out"/>
                            </div>
                            <div>Out</div>
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
                            <div class="history-item">
                                <div class="pr-2">
                                    <div class="font-weight-bold" v-html="item.note || 'No Title'"></div>
                                    <div class="text-muted">{{ $mm(item.created_at).format('DD/MM/YYYY HH:mm:ss') }}</div>
                                </div>
                                <div class="text-right">
                                    <div class="h4 font-weight-bold mb-0" :class="{'text-success': item.amount > 0, 'text-danger': item.amount <= 0}">{{ item.amount > 0 ? `+${item.amount}` : item.amount }}</div>
                                    <div class="text-primary font-weight-bold">Balance: {{ item.balance_after }}</div>
                                </div>
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
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        props: ['employeeId', 'hrm'],
        data: () => ({
            page_title: 'Point History',
            history: [],
            total: 0,
            last_page: 1,
            is_loading: false,
            queryParams: {
                page: 1,
                per_page: 10,
                type: '',
                employee_id: ''
            }
        }),

        computed: {
            ...mapState({
                employees: state => state.employees || [],
            }),

            title() {
                const title = this.queryParams.type || 'All'
                return this.$lodash.upperFirst(title.replace('_', ' '))
            }
        },

        watch: {
            queryParams: {
                deep: true,
                async handler(newval, oldval) {
                    if(newval.employee_id != oldval.employee_id || newval.type != oldval.type) {
                        this.queryParams.page = 1
                        return
                    }

                    await this.fetchHistory()
                }
            },

            employeeId: {
                immediate: true,
                handler(newval) {
                    if(newval) {
                        this.queryParams.employee_id = `${newval}`
                    }
                }
            }
        },

        async mounted() {
            await this.fetchHistory()
        },

        methods: {
            async fetchHistory() {
                try {
                    if(this.is_loading) {
                        return
                    }

                    this.is_loading = true
                    const { data } = await this.$http.get('employee/point-history', {params: this.queryParams})

                    if(!data.error) {
                        this.total = data.data.total
                        this.last_page = data.data.last_page

                        if(this.queryParams.page == 1) {
                            this.history = data.data.data
                        } else {
                            this.history = this.history.concat(data.data.data)
                        }
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
            }
        }
    }
</script>

<style lang="scss" scoped>
.history-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: .5rem 1rem;

    &:hover {
        background-color: #F5F5F5;
    }
}
</style>