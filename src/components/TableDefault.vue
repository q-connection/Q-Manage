<template>
    <div class="table-default-wrapper">
        <b-table-simple class="table-qconnection" :hover="hover"
            :class="{ 'table-responsive-md': responsive === true }">
            <b-thead>
                <b-tr>
                    <b-td width="5%" v-if="selectable">
                        <b-form-checkbox :checked="selected.length == items.length && items.length > 0"
                            @change="toggleSelectAll">
                            All
                        </b-form-checkbox>
                    </b-td>
                    <b-td :colspan="getHeadColSpan" class="px-0">
                        <div class="d-flex align-items-center" :class="headActionsClass">
                            <div class="d-flex">
                                <slot name="tableHeadActions" v-bind="{ selected }" />
                            </div>
                            <div v-if="searchable">
                                <form-input-group class="d-none d-xl-block d-lg-block search-form">
                                    <b-form-input style="min-width: 285px; min-height: 40px" placeholder="Search..."
                                        v-model.lazy="queryParams.search"></b-form-input>
                                    <template #append>
                                        <span class="h3">
                                            <q-icon icon="bx:search-alt" />
                                        </span>
                                    </template>
                                </form-input-group>
                            </div>
                        </div>
                    </b-td>
                </b-tr>
            </b-thead>
            <b-tbody>
                <template v-if="showColumns">
                    <b-tr>
                        <b-th v-for="(col, index) in tableColumns" :key="index" :width="col.width" :class="col.class">
                            <slot :name="`col-${col.name}`" v-bind="{ col }">
                                {{ col.label || 'N/A' }}
                            </slot>
                        </b-th>
                    </b-tr>
                </template>
                <b-tr v-for="(row, rowIdx) in items" :key="rowIdx" @click="$emit('redirect', row.id)">
                    <b-td width="5%" v-if="selectable">
                        <b-checkbox :checked="selected.includes(row.id)" @change="toggleSelect(row.id)" />
                    </b-td>
                    <b-td v-for="(col, colIdx) in tableColumns" :key="colIdx" :width="col.width"
                        :class="col.rowClass" @click="onRowClick(col, row)">
                        <slot :name="`row-${col.name}`" v-bind="{ row }">
                            {{ row[col.name] || '' }}
                        </slot>
                    </b-td>
                </b-tr>
                <b-tr v-if="items.length <= 0 && !tableLoading">
                    <b-td :colspan="tableColumns.length || 1">
                        <div class="text-center">
                            No records to show.
                        </div>
                    </b-td>
                </b-tr>
                <b-tr v-if="tableLoading && items.length <= 0">
                    <b-td :colspan="tableColumns.length || 1">
                        <div class="text-center text-primary">
                            <div>
                                <b-spinner type="grow" variant="primary" />
                            </div>
                            <div>Loading data...</div>
                        </div>
                    </b-td>
                </b-tr>
                <b-tr class="table-loading" v-if="tableLoading && items.length > 0">
                    <div class="text-center text-primary">
                        <div>
                            <b-spinner type="grow" variant="primary" />
                        </div>
                        <div>Loading data...</div>
                    </div>
                </b-tr>
            </b-tbody>
        </b-table-simple>
        <div class="d-flex justify-content-end" v-if="hasPagination">
            <b-pagination v-model="queryParams.page" :total-rows="totalItems" :per-page="queryParams.per_page"
                aria-controls="table-qconnection">
                <template #first-text>
                    <b-icon icon="chevron-double-left" />
                </template>
                <template #last-text>
                    <b-icon icon="chevron-double-right" />
                </template>
                <template #prev-text>
                    <b-icon icon="chevron-left" />
                </template>
                <template #next-text>
                    <b-icon icon="chevron-right" />
                </template>
            </b-pagination>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        columns: {
            type: Array,
            required: true
        },

        config: {
            type: Object,
            required: true
        },

        responsive: {
            type: Boolean,
            default: false
        },

        hover: {
            type: Boolean,
            default: false
        },

        selectable: {
            type: Boolean,
            default: false
        },

        searchable: {
            type: Boolean,
            default: false
        },

        showColumns: {
            type: Boolean,
            default: true
        },

        tableData: {
            type: Array,
            default: () => ([])
        },
    },

    data: () => ({
        tableLoading: false,
        hasPagination: true,
        tableConfig: {},
        tableColumns: [],
        selected: [],
        items: [],
        totalItems: 0,
        queryParams: {
            page: 1,
            per_page: 10,
            search: ''
        }
    }),

    computed: {
        headActionsClass() {
            return 'justify-content-between'
        },

        getHeadColSpan() {
            const total_columns = this.tableColumns.length
            if (total_columns <= 0) {
                return 1
            }

            return this.selectable ? total_columns + 1 : total_columns
        }
    },

    watch: {
        async 'queryParams.page'(newval) {
            if (newval) {
                await this.fetchItems()
            }
        },

        async 'queryParams.search'(newval) {
            if (newval) {
                await this.fetchItems()
            }
        }
    },

    methods: {
        async refresh(sync = false) {
            if (sync) {
                this.selected = []
                await this.fetchItems()
            }
        },

        toggleSelect(anno_id) {
            if (this.selected.includes(anno_id)) {
                this.$delete(this.selected, this.selected.findIndex(x => x == anno_id))
            } else {
                this.selected.push(anno_id)
            }
        },

        toggleSelectAll() {
            if (this.selected.length > 0) {
                this.selected = []
            } else {
                this.selected = this.items.map((x) => x.id)
            }
        },

        async fetchItems() {
            if (!this.tableConfig.url && this.tableData.length > 0) {
                const { data } = this.getPaginatedItems(this.tableData, this.queryParams.page, this.queryParams.per_page)

                this.items = data
                this.totalItems = this.tableData.length

                return
            }

            try {
                // this.tableLoading = true
                const { method = 'GET', params = {}, url } = this.tableConfig

                const { data } = await this.$http({
                    method,
                    url,
                    params: Object.assign(this.queryParams, params)
                })

                if (!data.error) {
                    this.items = data.data.data
                    this.totalItems = data.data.total
                }
            } catch (err) {
                console.log(err)
            } finally {
                // this.tableLoading = false
            }
        },

        async initData() {
            this.tableConfig = this.config
            this.tableColumns = this.columns

            if (this.tableConfig.url) {
                if (this.tableConfig.per_page && typeof this.tableConfig.per_page == 'number') {
                    this.queryParams.per_page = this.tableConfig.per_page
                }

                await this.fetchItems()
            } else {
                if (this.tableData.length > 0) {
                    const { data } = this.getPaginatedItems(this.tableData, this.queryParams.page, this.queryParams.per_page)

                    this.items = data
                    this.totalItems = this.tableData.length
                }
            }
        },

        getPaginatedItems(items, page, pageSize) {
            var pg = page || 1,
                pgSize = pageSize || 100,
                offset = (pg - 1) * pgSize,
                pagedItems = this.$lodash.drop(items, offset).slice(0, pgSize);
            return {
                page: pg,
                pageSize: pgSize,
                total: items.length,
                total_pages: Math.ceil(items.length / pgSize),
                data: pagedItems
            };
        },

        onRowClick(col, row) {
            if (typeof col.rowClicked === 'function') {
                col.rowClicked(row)
            }
        }
    },

    async mounted() {
        await this.initData()
    }
}
</script>

<style lang="scss" scoped>
.search-form {
    .form-control {
        border: 1px solid #ced4da
    }
}
</style>