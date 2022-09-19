<template>
    <div class="issue-table">
        <table-default 
            ref="table"
            :columns="columns"
            :config="tableConfig"
            :show-columns="false"
            searchPlaceholder="Search by issue name..."
            searchable
            hover     
        >
            <template slot="tableHeadActions">
                <b-select2
                    class="select-sm mr-2"
                    v-model="status"
                    :options="issue_statuses"
                    :reduce="pj => pj.value"
                    style="min-width: 150px"
                    placeholder="Status"
                    v-if="!onlyClosed"
                />
                <b-select2
                    class="select-sm"
                    v-model="labels"
                    :options="filteredLabels"
                    :reduce="lbl => lbl.value"
                    style="min-width: 150px"
                    placeholder="Label"
                />
            </template>
            <template slot="row-name" slot-scope="{row}">
                <div class="d-flex align-items-center">
                    <div class="h3 mr-3">
                        <q-icon icon="codicon:target" v-if="row.status == 'to_do'"/>
                        <q-icon icon="mdi:progress-wrench" v-if="row.status == 'inprogess'"/>
                        <q-icon icon="mdi:progress-pencil" v-if="row.status == 'pending'"/>
                        <q-icon icon="mdi:progress-check" v-if="row.status == 'done'"/>
                    </div>
                    <div class="issue-name">
                        <div class="font-weight-bold d-flex">
                            <div><span class="badge bg-danger text-white">{{row.point}}</span></div>
                            <div class="title ml-1 mr-2"><span>[{{ row.cod || 'N/A' }}]{{ row.name }}</span></div>
                            <div v-if="!$device.mobile">
                                <span 
                                    class="badge mr-1" 
                                    :style="{backgroundColor: lbl.color, color: '#fff'}"
                                    v-for="(lbl, index) in row.labels"
                                    :key="index"
                                >
                                    {{ lbl.name }}
                                </span>
                            </div>
                        </div>
                        <div class="small">{{ $mm(row.created_at).format('DD/MM/YYYY') }} by {{ row.created_by.fullname || 'N/A' }}</div>
                    </div>
                </div>
            </template>
            <template slot="row-customers" slot-scope="{row}">
                <div class="d-none d-xl-flex d-lg-flex align-items-center justify-content-end">
                    <div class="issue-avatar-wrapper" v-for="(customer, index) in row.assignes" :key="index">
                        <img-lazy-load 
                            :src="customer.avatar_thumb_url" 
                            error="/images/avatar-placeholder.png"
                            class="avatar" 
                        />                        
                    </div>
                </div>
                <div class="d-block d-xl-none d-lg-none">
                    <div class="h5 m-0 p-0 text-primary text-center">
                        <q-icon icon="fa-solid:user-friends"/>
                        {{ row.assignes.length > 5 ? '5+' : row.assignes.length }}
                    </div>
                </div>
            </template>
        </table-default>
    </div>
</template>

<script>
    export default {
        name: 'TableIssues',
        props: {
            useRouter: {
                type: Boolean,
                default: false
            },
            onlyClosed: {
                type: Boolean,
                default: false
            },
        },        
        data: () => ({
            issue_types: [],   
            status: '',
            project_id: '',
            labels: ''
        }),

        computed: {
            columns() {
                return [
                    {label: 'Name', name: 'name', rowClass: 'text-cursor p-3', rowClicked: this.handleClicked},
                    {label: 'Customers', name: 'customers', rowClass: 'text-cursor p-3', rowClicked: this.handleClicked},
                ]
            },
            issue_statuses() {
                return [
                    {label: 'To Do', value: 'to_do'},
                    {label: 'In Progress', value: 'inprogress'},
                    {label: 'Pending', value: 'pending'},
                    {label: 'Done', value: 'done'},
                ]
            },
            filteredLabels() {
                return this.$lodash
                .chain(this.$store.state.labels)
                .groupBy('name')
                .map((lbls, name) => ({label: name, value: lbls.map(x => x.id).join(',')}))
                .value()
            },
            tableConfig() {
                let operator = ''
                let status   = 'done'

                const configs = {
                    url: 'issues',
                    params: {
                        labels: this.labels || '',
                        project_id: this.useRouter ? this.$route.params.id : this.project_id
                    }
                }                  

                if(!this.onlyClosed) {
                    status = this.status || 'done'

                    if(!this.status) {
                        operator = '<>'
                    }

                    configs.params.status = status
                    configs.params.status_operator = operator
                } else {
                    configs.params.closed = true
                }

                return configs
            }               
        },

        methods: {
            handleClicked(row) {
                this.$store.commit('project/SET_ISSUE', row)

                this.$router.push({
                    name: 'project-issues-detail', 
                    params: {id: row.project_id, issue_id: row.id}
                })
            }
        },

        created() {
            this.$parent.$on('projectChanged', pid => {
                this.project_id = pid || ''
            })
        }
    }
</script>

<style lang="scss" scoped>
.issue-avatar-wrapper {
    padding: 0 .25rem;

    .avatar {
        height: 38px;
        width: 38px;
        overflow: hidden;
        border-radius: 50%;
        border: 1px solid var(--primary);
        
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            -o-object-fit: cover;
        }
    }

    &:last-child {
        padding-right: 0;
    }
}

.issue-name {
    .title {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;         
        font-weight: bold   
    }
}
</style>