<template>
<div>
    <b-row>
        <b-col cols=12>
            <h5>Timekeeping</h5>
        </b-col>
        <b-col cols=12 xl=3 lg=3>
            <form-group
                mode="datepicker"
                label="From"
                v-model="queryParams.from"
                :max="queryParams.to"
                @input="fetchReports(1)"
            />
            <form-group
                mode="datepicker"
                label="To"
                v-model="queryParams.to"
                :min="queryParams.from"
                @input="fetchReports(1)"
            />
            <form-group
                mode="input"
                label="Employee"
                placeholder="Search by name, username."
                v-model="queryParams.q"
                @input="onSearch"
                v-if="forHrm"
            />
            <div class="d-flex justify-content-end">
                <a :href="exportUrl" class="btn btn-success" v-if="forHrm">
                    Export
                </a>
            </div>
        </b-col>
        <b-col cols=12 xl=9 lg=3>
            <b-card class="overflow-hidden" body-class="p-0">
                <div 
                    class="timekeeping-item"
                    v-for="(item, index) in items"
                    :key="index"
                >
                    <div class="timekeeping-item__title">
                        <div class="font-weight-bold" v-if="!forHrm">{{ $mm(item.created_at).format('DD/MM/YYYY') }}</div>
                        <div v-else>
                            <span class="font-weight-bold">{{ $mm(item.created_at).format('DD/MM/YYYY') }}</span>
                            <span> - {{ item.employee?.fullname || 'N/A' }}</span>
                        </div>
                        <div>
                            <span class="text-muted">Check in:</span>
                            <span class="font-weight-bold" :class="{'text-success': !!item.checkin_at, 'text-danger': !!item.checkin_at === false}">
                                {{ item.checkin_at ? $mm(item.checkin_at).format('HH:mm') : 'N/A' }}
                            </span>
                            <span class="text-muted ml-3">Check out:</span>
                            <span class="font-weight-bold" :class="{'text-success': !!item.checkout_at, 'text-danger': !!item.checkout_at === false}">
                                {{ item.checkout_at ? $mm(item.checkout_at).format('HH:mm') : 'N/A' }}
                            </span>
                        </div>
                    </div>
                    <div class="timekeeping-item__action">
                        <form-button-icon
                            :ref="`btn_${item.id}`"
                            icon="ant-design:eye-filled"
                            @click="getReports(item)"
                        />
                    </div>
                </div>
                <div class="timekeeping-item" v-if="items.length <= 0">
                    <div class="text-muted">No records to show.</div>
                </div>
                <div class="timekeeping-item text-center text-cursor" v-if="queryParams.page < last_page && !is_loading" @click="viewMore">
                    <div class="text-primary w-100"><u>View more</u></div>
                </div>
                <div class="timekeeping-item text-center" v-if="is_loading">
                    <div class="text-primary w-100">
                        <b-spinner small></b-spinner>
                        Loading...
                    </div>
                </div>
            </b-card>
        </b-col>
    </b-row>
    <b-modal id="timekeeping-modal" size="xl" hide-header hide-footer>
        <modal-custom-header modalId="timekeeping-modal" :title="`${selected.employee?.fullname} - ${$mm(selected.created_at || '').format('DD/MM/YYYY')}`"/>
        <div class="d-flex justify-content-between mb-3">
            <div class="font-weight-bold">Report List</div>
            <div>
                <span class="text-muted">Check in:</span>
                <span class="font-weight-bold" :class="{'text-success': !!selected.checkin_at, 'text-danger': !!selected.checkin_at === false}">
                    {{ selected.checkin_at ? $mm(selected.checkin_at).format('HH:mm') : 'N/A' }}
                </span>
                <span class="text-muted ml-3">Check out:</span>
                <span class="font-weight-bold" :class="{'text-success': !!selected.checkout_at, 'text-danger': !!selected.checkout_at === false}">
                    {{ selected.checkout_at ? $mm(selected.checkout_at).format('HH:mm') : 'N/A' }}
                </span>
            </div>
        </div>
        <div class="daily-report-item" v-for="(item, index) in reports" :key="index">
            <div class="daily-report-item__title">
                {{ item.issue?.name || 'N/A' }}
            </div>
            <div class="daily-report-item__data">
                <div class="data-label">{{ item.project?.name || 'N/A' }}</div>
                <div class="data-label" :style="{backgroundColor: getStatusColor(item.issue?.status || 'N/A').color}">
                    {{ getStatusColor(item.issue?.status || 'N/A').name }}
                </div>
                <div class="data-label bg-light border border-primary text-primary">{{ item.process || '0' }}%</div>
            </div>
        </div>
        <div class="p-3 text-center text-muted" v-if="reports.length <= 0">
            No any report to show.
        </div>
    </b-modal>
</div>
</template>

<script>
    export default {
        props: {
            forHrm: {
                type: Boolean,
                default: false
            }
        },

        data: () => ({
            searchTimer: null,
            is_loading: false,
            selected: {},
            items: [],
            reports: [],
            last_page: 1,
            queryParams: {
                page: 1,
                per_page: 5,
                from: '',
                to: '',
                q: '',
                hrm: 0
            }
        }),

        computed: {
            exportUrl() {
                const {from, to, q} = this.queryParams
                return `https://manage.qconnection.vn/api/v1/log-time/export?from=${from}&to=${to}&employee_id${q}`
            },

            employees() {
                return this.$store.state.employees || []
            }
        },

        async mounted() {
            this.queryParams.from = this.$mm().add(-5, 'days').format('YYYY-MM-DD')
            this.queryParams.to = this.$mm().format('YYYY-MM-DD')
            this.queryParams.hrm = this.forHrm ? 1 : 0

            await this.fetchReports(1)
        },

        methods: {
            async fetchReports(page = null) {
                if(this.is_loading) return
                if(page) {
                    this.queryParams.page = page
                }

                try {
                    this.is_loading = true
                    const { data } = await this.$http.get('log-time', {params: this.queryParams})

                    if(!data.error) {
                        if(this.queryParams.page == 1) {
                            this.items = data.data.items
                        } else {
                            this.items = this.items.concat(data.data.items)
                        }
                        this.last_page = data.data.last_page
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    this.is_loading = false
                }
            },

            async viewMore() {
                this.queryParams.page += 1
                await this.fetchReports()
            },

            async getReports(item) {
                try {
                    this.selected = item
                    this.$refs[`btn_${item.id}`][0].toggleLoading(true)
                    const params = {
                        date: this.$mm(item.created_at).format('YYYY-MM-DD'),
                        user_id: this.forHrm ? item.user_id : this.$user.id,
                        page: 1,
                        per_page: 50
                    }
                    const { data } = await this.$http.get('daily_reports', {params})

                    if(!data.error) {
                        this.reports = data.data.data
                        this.$bvModal.show('timekeeping-modal')
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    this.$refs[`btn_${item.id}`][0].toggleLoading(false)
                }
            },

            getStatusColor(status) {
                let color = '#333',
                    name  = 'N/A';

                switch(status) {
                    case 'to_do':
                        color = 'var(--info)';
                        name  = 'To Do';
                    break;
                    case 'inprogess':
                        color = 'var(--warning)';
                        name  = 'In Progress';
                    break;
                    case 'pending':
                        color = 'var(--secondary)';
                        name  = 'Pending';
                    break;
                    case 'done':
                        color = 'var(--success)';
                        name  = 'Done';
                    break;
                }

                return {color, name}
            },

            onSearch() {
                clearTimeout(this.searchTimer)
                this.searchTimer = setTimeout(async () => {
                    await this.fetchReports(1) 
                }, 500)
            }
        }
    }
</script>

<style lang="scss" scoped>
.timekeeping-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #fff;
    border-bottom: 1px solid #f5f5f5;

    &:hover {
        background-color: #f5f5f5;
    }
}

.daily-report-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: .5rem;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: .5rem;
    flex-wrap: wrap;

    .daily-report-item__title {
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        -ms-text-overflow: ellipsis;
        overflow: hidden;
        max-width: 350px;
        font-weight: bold;
    }

    .daily-report-item__data {
        display: flex;
        overflow-x: auto;

        .data-label {
            height: 30px;
            font-weight: bold;
            line-height: 1;
            background-color: var(--primary);
            color: #fff;
            padding: .5rem 1rem;
            margin-right: .5rem;
            border-radius: 10px;
            min-width: 140px;
            text-align: center;

            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>