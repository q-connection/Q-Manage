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
                    class="select-sm"
                    v-model="status"
                    :options="issue_statuses"
                    :reduce="pj => pj.value"
                    style="min-width: 150px"
                    placeholder="Issue status"
                />
            </template>
            <template slot="row-name" slot-scope="{row}">
                <div class="d-flex align-items-center">
                    <div class="h3 mr-3">
                        <q-icon icon="codicon:target"/>
                    </div>
                    <div class="issue-name">
                        <div class="font-weight-bold d-flex align-items-center">
                            <span class="badge bg-danger text-white">{{row.point}}</span>
                            <span class="ml-1 mr-2">[{{ row.cod || 'N/A' }}]{{ row.name }}</span>
                            <span 
                                class="badge mr-1" 
                                :style="{backgroundColor: lbl.color, color: '#fff'}"
                                v-for="(lbl, index) in row.labels"
                                :key="index"
                            >
                                {{ lbl.name }}
                            </span>
                        </div>
                        <div class="small">{{ $mm(row.created_at).format('LL') }} by {{ row.created_by.fullname || 'N/A' }}</div>
                    </div>
                </div>
            </template>
            <template slot="row-customers" slot-scope="{row}">
                <div class="d-none d-xl-flex d-lg-flex align-items-center justify-content-end">
                    <div class="issue-avatar-wrapper" v-for="(customer, index) in row.assignes" :key="index">
                        <img-lazy-load 
                            :src="customer.avatar_url" 
                            error="/images/avatar-placeholder.png"
                            class="avatar" 
                        />                        
                    </div>
                </div>
                <div class="d-block d-xl-none d-lg-none">
                    <div class="h5 m-0 p-0 text-primary">
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
        data: () => ({
            issue_types: [],
            tableConfig: {
                url: 'issues',
                params: {
                    status: ''
                }
            },            
        }),

        computed: {
            status: {
                get() {
                    return this.tableConfig.params.status
                },

                set(val) {
                    this.tableConfig.params.status = val
                }
            },
            columns() {
                return [
                    {label: 'Name', name: 'name', rowClass: 'text-cursor p-3', rowClicked: this.handleClicked},
                    {label: 'Customers', name: 'customers', rowClass: 'text-cursor p-3', rowClicked: this.handleClicked},
                ]
            },
            issue_statuses() {
                return [
                    {label: 'Pending', value: 'to_do'},
                    {label: 'In Progress', value: 'inprogress'},
                    {label: 'Pending', value: 'pending'},
                    {label: 'Done', value: 'done'},
                ]
            }          
        },

        watch: {
            status() {
                this.$nextTick(() => {
                    this.$refs.table.refresh(true)
                })
            }
        },

        methods: {
            handleClicked(row) {
                this.$router.push({
                    name: 'project-issues-detail', 
                    params: {id: row.project_id, issue_id: row.id}
                })
            }
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
</style>