<template>
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <user-profile-form 
                    :user="user" 
                    :is-submitting="isSubmitting" 
                    @submit="onSubmit"
                />
            </b-col>
        </b-row>
    </b-container>
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
            async onSubmit({formData, refs}) {

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