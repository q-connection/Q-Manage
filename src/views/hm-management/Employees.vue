<template>
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <page-breadcrumb class="mb-3" :items="breadcrumb_items"/>
            </b-col>
            <b-col cols=12>
                <q-table 
                    id="q-table" 
                    :rows="rows" 
                    :columns="columns" 
                    :config="config" 
                    @on-change-query="onChangeQuery" 
                    :total-rows="total_rows"
                >

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
                {to: 'hm-employees', title: 'Employees'},
            ],
            rows: [],
            columns: [
                {
                    label: "id",
                    name: "id",
                    filter: {
                        type: "simple",
                        placeholder: "id"
                    },
                    sort: true,
                },
                {
                    label: "First Name",
                    name: "name.first_name",
                    filter: {
                        type: "simple",
                        placeholder: "Enter first name"
                    },
                    sort: true,
                },
                {
                    label: "Email",
                    name: "email",
                    sort: true,
                },
                {
                    label: "Country",
                    name: "address.country",
                    filter: {
                        type: "simple",
                        placeholder: "Enter country"
                    },
                }
            ],
            config: {
                checkbox_rows: true,
                rows_selectable: true,
                card_title: "List Employees",
                server_mode: true
            },
            queryParams: {
                sort: [],
                filters: [],
                global_search: "",
                per_page: 10,
                page: 1,
            },
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