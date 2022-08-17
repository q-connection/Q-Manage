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
                    v-model="type"
                    :options="projects"
                    :reduce="pj => pj.value"
                    style="min-width: 150px"
                    :closeOnSelect="false"
                    deselectFromDropdown
                    placeholder="Issue types"
                    multiple
                >
                    <template v-slot:option="option">
                        <slot name="option-data" class="option-data" v-bind="option">
                            <div class="d-flex w-100 justify-content-between">
                                <b-badge variant="success" v-if="option.value == 'task'">Task</b-badge>
                                <b-badge variant="danger" v-else>{{ option.label }}</b-badge>
                                <span class="small text-danger text-cursor mb-0" @click="handleTypeCheck(option.value, false)" v-if="type.includes(option.value)">
                                    <q-icon icon="el:remove"/>
                                </span>
                                <span class="m-0 p-0 text-success text-cursor" @click="handleTypeCheck(option.value, true)" v-else>
                                    <q-icon icon="carbon:add-filled"/>
                                </span>
                            </div>
                        </slot>
                    </template>
                    <template #selected-option-container="{option}">
                        <div class="mt-1" style="padding: .25rem .15rem">
                            <b-badge class="p-1" variant="success" v-if="option.value == 'task'">Task</b-badge>
                            <b-badge class="p-1" variant="danger" v-else>{{ option.label }}</b-badge>
                        </div>
                    </template>
                </b-select2>
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
            projects: [
                {label: 'Task', value: 'task'},
                {label: 'Bug', value: 'bug'},
                {label: 'Hot fix', value: 'hot_fix'},
            ],
            columns: [
                {label: 'Name', name: 'name', rowClass: 'text-cursor p-3'},
                {label: 'Customers', name: 'customers', rowClass: 'text-cursor p-3'},
            ],
            tableConfig: {
                url: 'issues',
                params: {
                    type: []
                }
            },            
        }),

        computed: {
            type: {
                get() {
                    return this.tableConfig.params.type
                },

                set(val) {
                    this.tableConfig.params.type = val
                }
            }
        },

        watch: {
            type() {
                this.$nextTick(() => {
                    this.$refs.table.refresh(true)
                })
            }
        },

        methods: {
            handleTypeCheck(value, checked) {
                if(!checked) {
                    const idx = this.type.findIndex(x => x == value)
                    if(idx !== false) {
                        this.$delete(this.type, idx)
                    }
                } else {
                    this.type.push(value)
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