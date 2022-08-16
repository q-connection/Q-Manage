<template>
    <div>
        <table-default
            ref="table"
            :columns="columns"
            :config="tableConfig"
            :show-columns="false"
            searchable
            hover            
            boxed
        >
            <template slot="tableHeadActions">
                <b-button 
                    @click="$bvModal.show('modal-leave-days')"
                    variant="outline-primary" 
                    size="sm" 
                    class="p-2"
                    v-if="$hasPermission('annual-leave.create')"
                >
                    Create
                </b-button>
            </template>
            <template slot="row-type" slot-scope="{row}">
                {{ getTypeLabel(row.type) }}
            </template>
            <template slot="row-status" slot-scope="{row}">
                <div class="w-100 d-flex justify-content-between">
                    <div class="text-info" v-if="row.status == 'pending' || row.status == 'draft'">
                        Waiting for approval
                    </div>
                    <div class="text-success" v-if="row.status == 'published'">
                        Approved
                    </div>
                    <div class="text-secondary" v-if="row.status == 'cancel'">
                        Canceled
                    </div>
                    <div class="text-cursor text-danger" v-if="row.status == 'pending' || row.status == 'draft'" @click="cancelLeaveDay(row.id)">
                        <u>Cancel</u>
                    </div>
                </div>
            </template>
        </table-default>
        <b-modal id="modal-leave-days" size="xl" hide-header hide-footer @hide="modalData = null">
            <div class="p-3">
                <modal-custom-header modal-id="modal-leave-days" title="CREATE"/>
                <FormLeaveDay @created="refreshTable"/>
            </div>
        </b-modal>            
    </div>
</template>

<script>
    import FormLeaveDay from './Form.vue'

    export default {
        name: 'TableLeaveDays',

        components: {FormLeaveDay},

        data: () => ({
            modalData: null,
            typeOptions: [
                {label: 'Paid Leave - Nghỉ có lương', value: 'paid_leave'},
                {label: 'Unpaid Leave - Nghỉ không lương', value: 'unpaid_leave'},
                {label: 'Paternity Leave - Nghỉ thai sản', value: 'paternity_leave'},
                {label: 'Marriage Leave - Nghỉ đám cưới', value: 'marriage_leave'},
                {label: 'Sick Leave - Nghỉ bệnh', value: 'sick_leave'}
            ]            
        }),

        computed: {
            tableConfig() {
                return {
                    url: 'annual-leave/list',
                    per_page: 8
                }
            },

            columns() {
                return [
                    {label: "From", name: "start_date", rowClicked: this.handleEditClicked},
                    {label: "To", name: "end_date", rowClicked: this.handleEditClicked},
                    {label: "Total day", name: "total_day", rowClicked: this.handleEditClicked},
                    {label: "Type", name: "type", rowClicked: this.handleEditClicked},
                    {label: "Reason", name: "reason", rowClicked: this.handleEditClicked},
                    {label: "Status", name: "status", display: 'none', rowWidth: '100%', rowClicked: this.handleEditClicked},         
                ]
            }
        },

        methods: {
            handleEditClicked() {

            },

            getTypeLabel(val) {
                const type = this.typeOptions.find(x => x.value == val)

                return type ? type.label : 'N/A'
            },

            cancelLeaveDay(id) {
                this.$showAlert({
                    type: 'confirm',
                    title: "Warning!",
                    message: 'Do you really want to cancel this request?<br/>This process cannot be undone.',
                    callback: async ({dismiss}) => {
                        try {
                            const { data } = await this.$http.patch('annual-leave/cancel/' + id)

                            if(!data.error) {
                                dismiss(true)
                                this.$refs.table.refresh(true)

                                this.$showAlert({
                                    type: 'success',
                                    message: 'Canceled leave day successfully'
                                })
                            }
                        } catch (err) {
                            console.log(err)
                            this.$showAlert({
                                type: 'danger',
                                message: 'Something went wrong, please try again later'
                            })                    
                        }
                    }
                })
            },

            refreshTable() {
                this.$refs.table.refresh(true)    
                this.$bvModal.hide('modal-leave-days')
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>