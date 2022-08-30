<template>
    <div class="contract-wrapper">
        <validation-observer v-slot="{handleSubmit}">
            <form @submit.prevent="handleSubmit(onSubmit)">
                <b-row>
                    <b-col cols=12 xl=4 lg=4>
                        <validation-provider
                            rules="required|oneOf:freelancer,probation,official"
                            name="contract_type"
                            ref="contract_type"
                            v-slot="{errors, valid}"
                        >
                            <form-group
                                mode="select"
                                label="Type"
                                :state="$isValid(errors, valid)"
                                :error="errors[0]"
                                v-model="formData.contract_type"
                                :options="contract_types"
                                required
                            />
                        </validation-provider>
                    </b-col>
                    <b-col cols=12 xl=4 lg=4>
                        <validation-provider
                            rules="required"
                            name="contract_start_date"
                            ref="contract_start_date"
                            v-slot="{errors, valid}"
                        >
                            <form-group
                                mode="datepicker"
                                label="Start Date"
                                :state="$isValid(errors, valid)"
                                :error="errors[0]"
                                v-model="formData.contract_start_date"
                                :max="formData.contract_end_date"
                                required
                            />
                        </validation-provider>
                    </b-col>
                    <b-col cols=12 xl=4 lg=4>
                        <validation-provider
                            rules="required"
                            name="contract_end_date"
                            ref="contract_end_date"
                            v-slot="{errors, valid}"
                        >
                            <form-group
                                mode="datepicker"
                                label="End Date"
                                :state="$isValid(errors, valid)"
                                :error="errors[0]"
                                v-model="formData.contract_end_date"
                                :min="formData.contract_start_date"
                                required
                            />
                        </validation-provider>
                    </b-col>
                    <b-col cols=12 xl=4 lg=4>
                        <validation-provider
                            rules="required|numeric|min_value:0"
                            name="contract_salary"
                            ref="contract_salary"
                            v-slot="{errors, valid}"
                        >
                            <form-group
                                mode="input"
                                type="number"
                                label="Salary"
                                :state="$isValid(errors, valid)"
                                :error="errors[0]"
                                v-model.number="formData.contract_salary"
                                required
                            />
                        </validation-provider>
                    </b-col>
                    <b-col cols=12 xl=4 lg=4>
                        <validation-provider
                            rules=""
                            name="document"
                            ref="document"
                            v-slot="{errors, valid}"
                        >
                            <form-group
                                mode="file"
                                label="Contract Scan File (PDF)"
                                placeholder="Choose a file..."
                                accept=".pdf"
                                custom-class="pdf"
                                :state="$isValid(errors, valid)"
                                :error="errors[0]"
                                v-model.number="formData.document"
                                required
                            />                            
                        </validation-provider>
                    </b-col>
                    <b-col cols=12 xl=4 lg=4>
                        <div class="h-100 d-flex justify-content-end align-items-end pb-3">
                            <form-button 
                                type="submit"
                                variant="success"
                                :loading="isSubmitting"
                                :disabled="isSubmitting"
                                style="width: 190px; max-width: 100%"
                            >
                                Add
                            </form-button>
                        </div>
                    </b-col>
                </b-row>
            </form>
        </validation-observer>
    </div>
</template>

<script>
    import moment from 'moment'

    export default {
        props: {
            user_id: Number
        },

        data: () => ({
            isSubmitting: false,
            formData: {
                contract_type: 'probation',
                contract_start_date: moment().format('YYYY-MM-DD'),
                contract_end_date: moment().format('YYYY-MM-DD'),
                contract_salary: 0,
                document: null
            },
            contract_types: [
                {label: 'Official', value: 'official'},
                {label: 'Probation', value: 'probation'},
                {label: 'Freelancer', value: 'freelancer'},
            ]
        }),

        methods: {
            async onSubmit() {
                try {
                    this.isSubmitting = true
                    const formData = Object.assign({user_id: this.user_id}, this.formData)
                    const { data } = await this.$http.post('employee/add-contract', this.$objToFormData(formData))

                    if(!data.error) {
                        this.$showAlert({type: 'success', message: 'Added new contract successfully'})
                        this.$emit('added', true)
                        this.formData.document = null
                        this.formData.contract_salary = 0
                    } else {
                        this.$showAlert({type: 'danger', message: data.message})
                    }
                } catch (err) {
                    console.log(err)
                    this.$showAlert({type: 'danger', message: "Something went wrong"})
                } finally {
                    this.isSubmitting = false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>