<template>
    <div>
        <table-default
            ref="table"
            :columns="columns"
            :config="tableConfig"
            :show-columns="false"
            searchType="date"
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
                    v-if="!forHrm"
                >
                    Create
                </b-button>
            </template>
            <template slot="row-user_id" slot-scope="{row}">
                <div v-if="forHrm">
                    <div>{{ row.user ? row.user.username : 'N/A' }}</div>
                    <div>{{ row.user ? row.user.fullname : 'N/A' }}</div>
                </div>
            </template>
            <template slot="row-type" slot-scope="{row}">
                {{ getTypeLabel(row.type) }}
            </template>
            <template slot="row-status" slot-scope="{row}">
                <div class="w-100 d-flex justify-content-between">
                    <div class="text-info" v-if="row.status == 'pending' || row.status == 'draft'">
                        Waiting for approval
                    </div>
                    <div class="text-success" v-if="row.status == 'approved'">
                        Approved by 
                        <u class="text-cursor" v-b-tooltip.html="showApproverDetail(row.approver)">
                            {{ row.approver ? (row.approver.fullname || 'N/A') : 'N/A' }}
                        </u>
                    </div>
                    <div class="text-danger" v-if="row.status == 'cancel'">
                        Canceled
                    </div>
                    <div 
                        class="text-cursor text-danger" 
                        v-if="row.status == 'pending' || row.status == 'draft'" 
                        @click="cancelLeaveDay(row.id)"
                        v-show="!forHrm"
                    >
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
        props: {
            forHrm: {
                type: Boolean,
                default: false
            }
        },

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
                    url: `annual-leave${this.forHrm ? '/list' : ''}`,
                    per_page: 12
                }
            },

            columns() {
                const addition = []
                const cols = [
                    {label: "From", name: "start_date"},
                    {label: "To", name: "end_date"},
                    {label: "Total day", name: "total_day"},
                    {label: "Type", name: "type"},
                    {label: "Reason", name: "reason"},
                    {label: "Status", name: "status", display: 'none', rowWidth: '100%'},         
                ]

                if(this.forHrm) {
                    addition.push({label: "User", name: "user_id"})                    
                }

                return [].concat(addition, cols)
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
            },

            showApproverDetail(approver) {
                const user = approver || {}

                return `<ul class="p-0 h5 mb-0">
                    <li>Code: ${user.username || 'N/A'}</li>
                    <li>Name: ${user.fullname || 'N/A'}</li>
                    <li>Phone: ${user.phone || 'N/A'}</li>
                </ul>`
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>