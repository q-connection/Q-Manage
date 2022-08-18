<template>
<div class="page-content" :class="{hrm: inHrmRoutes === true}">
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <user-profile-form 
                    :user="user" 
                    :is-submitting="isSubmitting" 
                    @submit="onSubmit"
                    creating
                />
            </b-col>
        </b-row>
    </b-container>
</div>
</template>

<script>
    export default {
        data: () => ({
            user: {},
            isSubmitting: false
        }),
        
        computed: {
            breadcrumb_items() {
                return [
                    {to: 'dashboard', title: 'Dashboard'},
                    {to: 'hrm-employees', title: 'Employees'},
                    {to: 'hrm-employees-create', title: "Create"}
                ]
            }
        },

        methods: {
            async onSubmit({formData, refs, switchTab}) {

                if(!this.$hasPermission('employee.create')) {
                    return
                }

                try {
                    this.isSubmitting = true
                    const { data } = await this.$http.post('employee/store', formData)

                    if(!data.error) {
                        this.$showAlert({type: 'success', message: 'Created new employee successfully!'})
                        this.$router.push({name: 'hrm-employees'})
                    }
                } catch (err) {
                    console.log(err)

                    if(err.response && err.response.status == 422) {
                        this.$showAlert({type: 'danger', message: "An error occurred while updating information, please check."})
                        this.$parseResponseErrors(refs, err.response.data.data)

                        const keys = Object.keys(err.response.data.data)
                        const tab_0 = ['first_name', 'last_name', 'username', 'email', 'phone', 'dob', 'gender', 'status']
                        const tab_1 = ['id_number', 'id_issuance_date', 'id_issued_by']
                        const tab_2 = ['permanent_city', 'permanent_district', 'permanent_ward', 'permanent_address', 'residence_city', 'residence_district', 'residence_ward', 'residence_address']
                        const tab_3 = ['bank_account', 'bank_name', 'bank_branch', 'bank_city']

                        keys.forEach(key => {
                            if(tab_0.includes(key)) {
                                switchTab(0)
                            } else if(tab_1.includes(key)) {
                                switchTab(1)
                            } else if(tab_2.includes(key)) {
                                switchTab(2)
                            } else if(tab_3.includes(key)) {
                                switchTab(3)
                            } else {
                                switchTab(4)
                            }
                        })                        
                    }

                    if(err.response && err.response.status != 422) {
                        this.$showAlert({type: 'danger', message: err.response.data.message})
                    }
                } finally {
                    this.isSubmitting = false
                }
            },            
        }
    }
</script>

<style lang="scss" scoped>

</style>