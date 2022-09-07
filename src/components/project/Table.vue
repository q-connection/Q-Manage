<template>
    <div class="project-table">
        <table-default ref="table" :columns="columns" :config="tableConfig" :show-columns="false" searchable hover>
            <template slot="tableHeadActions" v-if="showCreateButton">
                <b-button variant="outline-primary" size="sm" class="px-3 py-2" @click="$emit('create', $event)">
                    Create
                </b-button>
            </template>
            <template slot="row-name" slot-scope="{row}">
                <div class="d-flex align-items-center">
                    <div class="h3 mr-3" v-if="!showThumbnail">
                        <q-icon icon="codicon:target" />
                    </div>
                    <img-lazy-load :src="row.thumbnail" class="thumbnail mr-3" v-else />
                    <div class="project-name">
                        <div class="font-weight-bold">{{ row.name }}
                            <span v-if="$hasPermission('project.edit') && row.created_by == $user.username" @click="$emit('edit-project', row)" v-on:click.stop style="margin-left:8px">
                                <Q-Icon icon="bx:edit" color="#f0b01d" width="18" height="18" />
                            </span>
                            <span v-if="$hasPermission('project.destroy')" @click="$emit('delete-project', row)" v-on:click.stop style="margin-left:8px">
                                <Q-Icon icon="bx:trash" color="var(--danger)" width="18" height="18" />
                            </span>
                        </div>
                        <div class="small">{{ $mm(row.created_at).format('DD/MM/YYYY') }} by {{ row.created_by || 'N/A' }}
                        </div>
                        <div class="small d-flex">
                            <div class="mr-3">
                                <span>Issues: </span>
                                <span class="text-success font-weight-bold">{{ row.total_issues || 0 }}</span>
                            </div>
                            <div>
                                <span>Bugs: </span>
                                <span class="text-danger font-weight-bold">{{ row.total_bugs || 0 }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <template slot="row-customers" slot-scope="{row}">
                <div class="d-none d-xl-flex d-lg-flex align-items-center justify-content-end">
                    <div class="project-avatar-wrapper" v-for="(customer, index) in row.customers" :key="index">
                        <img-lazy-load :src="customer.avatar_thumb_url" error="/images/avatar-placeholder.png"
                            class="avatar" />
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
    name: 'ProjectTable',
    props: {
        showThumbnail: {
            type: Boolean,
            default: false
        },

        showCreateButton: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        columns() {
            return [
                { label: 'Name', name: 'name', rowClass: 'text-cursor p-3', rowClicked: this.redirect },
                { label: 'Customers', name: 'customers', rowClass: 'text-cursor p-3', rowClicked: this.redirect},
            ]
        },
        tableConfig() {
            return {
                url: 'projects'
            }
        },
    },
    created() {
        this.$parent.$on('project-deleted', async () => {
            await this.$refs.table.refresh(true)
            await this.$store.dispatch('project/fetchAllProjects')
        })
    },
    methods: {
        redirect(row) {
            this.$redirectTo('project-issues', {id: row.id}, (() => {
                this.$store.commit('project/SET_DETAIL', row)
            })())            
        }
    },
}
</script>

<style lang="scss" scoped>
.thumbnail {
    width: 44px;
    height: 44px;
    border-radius: 5px;
    overflow: hidden
}

.project-avatar-wrapper {
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