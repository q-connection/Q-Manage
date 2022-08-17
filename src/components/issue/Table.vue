<template>
    <div class="issue-table">
        <table-default 
            ref="table"
            :columns="columns"
            :config="tableConfig"
            :show-columns="false"
            searchable
            hover     
        >
            <template slot="tableHeadActions">
                <b-select2
                    class="select-sm"
                    v-model="projectId"
                    :options="projects"
                    :reduce="pj => pj.value"
                    style="min-width: 150px"
                    :clearable="false"
                />
            </template>
            <template slot="row-name" slot-scope="{row}">
                <div class="d-flex align-items-center">
                    <div class="h3 mr-3">
                        <q-icon icon="codicon:target"/>
                    </div>
                    <div class="issue-name">
                        <div class="font-weight-bold">{{ row.name }}</div>
                        <div class="small">{{ $mm(row.created_at).format('LL') }} by {{ row.created_by || 'N/A' }}</div>
                    </div>
                </div>
            </template>
            <template slot="row-customers" slot-scope="{row}">
                <div class="d-none d-xl-flex d-lg-flex align-items-center justify-content-end">
                    <div class="issue-avatar-wrapper" v-for="(customer, index) in row.customers" :key="index">
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
                        {{ row.customers.length > 5 ? '5+' : row.customers.length }}
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
            projects: [{label: 'All', value: ''}],
            columns: [
                {label: 'Name', name: 'name', rowClass: 'text-cursor p-3'},
                {label: 'Customers', name: 'customers', rowClass: 'text-cursor p-3'},
            ],
            tableConfig: {
                url: 'issues',
                params: {
                    project_id: ''
                }
            },            
        }),

        computed: {
            projectId: {
                get() {
                    return this.tableConfig.params.project_id
                },

                set(val) {
                    this.tableConfig.params.project_id = val
                }
            }
        },

        watch: {
            projectId() {
                this.$nextTick(() => {
                    this.$refs.table.refresh(true)
                })
            }
        },

        async mounted() {
            await this.fetchProjects()
        },

        methods: {
            async fetchProjects() {
                try {
                    const { data } = await this.$http.get('projects/all-for-select')

                    if(!data.error) {
                        this.projects = this.projects.concat(data.data.map(pj => ({
                            label: pj.name,
                            value: pj.id
                        })))
                    }
                } catch (err) {
                    console.log(err)
                }
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