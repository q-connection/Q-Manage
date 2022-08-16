<template>
    <div class="project-table">
        <table-default :columns="columns" :config="tableConfig" :show-columns="false" searchable hover
            @redirect="redirect">
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
                            <span v-if="$hasPermission('project.edit')" @click="$emit('edit-project', row.id)" v-on:click.stop style="margin-left:8px">
                                <Q-Icon icon="bx:edit" color="#f0b01d" width="18" height="18" />
                            </span>
                        </div>
                        <div class="small">{{ $mm(row.created_at).format('LL') }} by {{ row.created_by || 'N/A' }}
                        </div>
                        <div class="small d-flex">
                            <div class="mr-3">
                                <span>Tasks: </span>
                                <span class="text-success font-weight-bold">{{ row.total_task || 0 }}</span>
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
                <div class="d-flex align-items-center justify-content-end">
                    <div class="project-avatar-wrapper" v-for="(customer, index) in row.customers" :key="index">
                        <img-lazy-load :src="customer.avatar_url" error="/images/avatar-placeholder.png"
                            class="avatar" />
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
    data: () => ({
        columns: [
            { label: 'Name', name: 'name', rowClass: 'text-cursor p-3' },
            { label: 'Customers', name: 'customers', rowClass: 'text-cursor p-3' },
        ],
        tableConfig: {
            url: 'projects'
        },
    }),
    methods: {
        redirect(id) {
            this.$router.push({ name: 'project-detail', params: { id: id } })
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