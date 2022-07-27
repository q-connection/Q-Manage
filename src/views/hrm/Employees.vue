<template>
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <q-table 
                    id="q-table" 
                    :rows="rows" 
                    :columns="columns" 
                    :config="config" 
                    :actions="actions" 
                    @on-change-query="onChangeQuery" 
                    @on-create="() => $router.push({name: 'hrm-employees-create'})"
                    :total-rows="total_rows"
                >
                    <template slot="actions" slot-scope="props">
                        <b-button size="sm" variant="info" :to="{name: 'hrm-employees-detail', params: {id: props.row.id}}">
                            <b-icon icon="pencil-square"/>
                        </b-button>
                    </template>
                    <template slot="pagination-per-page" slot-scope="{perPageHandler, per_page_options, per_page}">
                        <b-dropdown class="ml-3" :text="per_page.toString()">
                            <b-dropdown-item v-for="(option, index) in per_page_options" :key="index" @click="perPageHandler(option)" :active="option == per_page">
                                {{ option }}
                            </b-dropdown-item>
                        </b-dropdown>
                    </template>
                    <template slot="sort-asc-icon">
                        <b-icon icon="sort-down-alt"></b-icon>
                    </template>
                    <template slot="sort-desc-icon">
                        <b-icon icon="sort-down"></b-icon>
                    </template>
                    <template slot="no-sort-icon">
                        <b-icon icon="sort-down-alt"></b-icon>
                    </template>
                </q-table>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        name: 'HmEmployees',
        data: () => ({
            breadcrumb_items: [
                {to: 'dashboard', title: 'Dashboard'},
                {to: 'hrm-employees', title: 'Employees'},
            ],
            rows: [],
            columns: [
                {
                    label: "ID",
                    name: "id",
                    sort: true,
                    uniqueId: true 
                },
                {
                    label: "Name",
                    name: "fullname",
                    sort: true,
                },
                {
                    label: "Email",
                    name: "email",                
                    sort: true,
                },
                {
                    label: "Phone",
                    name: "phone",                    
                    sort: true,
                },
                {
                    label: "ID Number",
                    name: "id_number",                  
                    sort: true,
                },
                {
                    label: "Contract Type",
                    name: "contract_type",                  
                    sort: true,
                },
                {
                    label: "Contract End Date",
                    name: "contract_end_date",                  
                    sort: true,
                },
                {
                    label: "Department",
                    name: "departments.0.name",
                },
                {
                    label: "Position",
                    name: "roles.0.name",
                },
                {
                    label: 'Actions',
                    name: "actions"
                }
            ],
            config: {
                checkbox_rows: true,
                rows_selectable: true,
                card_title: "List Employees",
                server_mode: true,
                per_page: 10,
                per_page_options: [5, 10, 20, 30, 50, 100],
            },
            queryParams: {
                sort: [],
                filters: [],
                global_search: "",
                per_page: 10,
                page: 1,
            },
            actions: [
                {
                    btn_text: "Create",
                    event_name: "on-create",
                    class: "btn btn-primary"              
                }
            ],            
            total_rows: 0,                        
        }),

        methods: {
            async onChangeQuery(queryParams) {
                this.queryParams = queryParams;
                await this.fetchEmployees();
            },

            async fetchEmployees() {
                try {
                    const { data } = await this.$http.get('employee/list', {params: this.queryParams})

                    if(!data.error) {
                        this.rows = data.data.data
                        this.total_rows = data.data.total
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>