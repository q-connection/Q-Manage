<template>
    <validation-observer ref="leaveDayForm" v-slot="{handleSubmit}">
        <b-form @submit.prevent="handleSubmit(onSubmit)">
            <b-row>
                <b-col cols=12 :class="{'pt-3': $device.mobile === true}">
                    <b-row>
                        <b-col cols=12>
                            <b-row>
                                <b-col cols=12 xl=6 lg=6>
                                    <validation-provider rules="required|max:255" name="start_date" ref="start_date" v-slot="{errors, valid}">
                                        <form-group
                                            mode="datepicker"
                                            label="From"
                                            placeholder="dd/mm/yyyy"
                                            v-model="formData.start_date"
                                            :state="$isValid(errors, valid)"
                                            :error="errors[0]"
                                            required
                                        />
                                    </validation-provider>
                                </b-col>
                                <b-col cols=12 xl=6 lg=6>
                                    <validation-provider name="time_1" ref="time_1" v-slot="{errors, valid}">
                                        <b-form-group 
                                            :invalid-feedback="errors[0]" 
                                            :state="$isValid(errors, valid)"         
                                            v-slot="{ ariaDescribedby }"   
                                            :style="`padding-top: ${$device.mobile ? 0 : '2.25rem'}`"                 
                                        >
                                            <b-form-radio-group
                                                v-model="formData.time_1"
                                                :aria-describedby="ariaDescribedby"
                                                size="lg"
                                                name="time_1"
                                            >
                                                <b-form-radio value="08:30" :disabled="!formData.start_date">08:30</b-form-radio>
                                                <b-form-radio value="13:00" :disabled="!formData.start_date">13:00</b-form-radio>
                                            </b-form-radio-group>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>
                            </b-row>
                        </b-col>
                        <b-col cols=12>
                            <b-row>
                                <b-col cols=12 xl=6 lg=6>
                                    <validation-provider rules="required" name="end_date" ref="end_date" v-slot="{errors, valid}">
                                        <form-group
                                            mode="datepicker"
                                            label="To"
                                            placeholder="dd/mm/yyyy"
                                            v-model="formData.end_date"
                                            :state="$isValid(errors, valid)"
                                            :error="errors[0]"
                                            required
                                        />
                                    </validation-provider>
                                </b-col>
                                <b-col cols=12 xl=6 lg=6>
                                    <validation-provider name="time_2" ref="time_2" v-slot="{errors, valid}">
                                        <b-form-group 
                                            :invalid-feedback="errors[0]" 
                                            :state="$isValid(errors, valid)"         
                                            v-slot="{ ariaDescribedby }"   
                                            :style="`padding-top: ${$device.mobile ? 0 : '2.25rem'}`"               
                                        >
                                            <b-form-radio-group
                                                v-model="formData.time_2"
                                                :aria-describedby="ariaDescribedby"
                                                size="lg"
                                                name="time_2"
                                                :disabled="endTimeDisabled"
                                            >
                                                <b-form-radio value="12:00" :disabled="!formData.end_date">12:00</b-form-radio>
                                                <b-form-radio value="17:30" :disabled="!formData.end_date">17:30</b-form-radio>
                                            </b-form-radio-group>
                                        </b-form-group>
                                    </validation-provider>
                                </b-col>
                            </b-row>
                        </b-col>
                        <b-col cols=12 xl=6 lg=6>
                            <validation-provider rules="required" name="type" ref="type" v-slot="{errors, valid}">
                                <form-group
                                    mode="select"
                                    label="Type of leave"
                                    placeholder="Choose an option..."
                                    v-model="formData.type"
                                    :options="typeOptions"
                                    required
                                    :state="$isValid(errors, valid)"
                                    :error="errors[0]"                                    
                                />
                            </validation-provider>
                        </b-col>
                        <b-col cols=12 xl=6 lg=6>
                            <validation-provider rules="required" name="approver_id" ref="approver_id" v-slot="{errors, valid}">
                                <form-group
                                    mode="select"
                                    label="Approver"
                                    placeholder="Choose an option..."
                                    v-model="formData.approver_id"
                                    :options="approvers"
                                    required
                                    :state="$isValid(errors, valid)"
                                    :error="errors[0]"                                    
                                />
                            </validation-provider>
                        </b-col>
                        <b-col cols=12>
                            <validation-provider rules="required|min:10|max:255" name="reason" ref="reason" v-slot="{errors, valid}">
                                <form-group
                                    mode="textarea"
                                    label="Reason"
                                    placeholder="Enter reason..."
                                    v-model="formData.reason"
                                    :state="$isValid(errors, valid)"
                                    :error="errors[0]"
                                    rows="5"
                                    required
                                />
                            </validation-provider>
                        </b-col>                      
                    </b-row>
                </b-col>
                <b-col cols=12>
                    <div class="d-flex justify-content-end mt-2">
                        <form-button 
                            type="submit"
                            :loading="isSubmitting"
                            :disabled="isSubmitting"
                            loading-without-hidden-text
                            style="min-width: 250px"
                        >
                            SEND
                        </form-button>
                    </div>
                </b-col>
            </b-row>
        </b-form>
    </validation-observer>
</template>

<script>
    export default {
        name: 'FormLeaveDay',

        props: {
            data: {
                type: [Array, Object],
                default: null
            }
        },

        data: () => ({
            isSubmitting: false,
            startTimeOptions: [{text: '08:30', value: '08:30'},{text: '13:00', value: '13:00'}],
            endTimeOptions: [{text: '12:00', value: '12:00'},{text: '17:30', value: '17:30'}],
            typeOptions: [
                {label: 'Paid Leave - Nghỉ có lương', value: 'paid_leave'},
                {label: 'Unpaid Leave - Nghỉ không lương', value: 'unpaid_leave'},
                {label: 'Paternity Leave - Nghỉ thai sản', value: 'paternity_leave'},
                {label: 'Marriage Leave - Nghỉ đám cưới', value: 'marriage_leave'},
                {label: 'Sick Leave - Nghỉ bệnh', value: 'sick_leave'}
            ],
            approvers: [],
            formData: {
                start_date: null,
                end_date: null,
                time_1: '13:00',
                time_2: '17:30',
                reason: '',
                type: null,
                approver_id: null,
                status: 'pending'
            }
        }),

        watch: {
            data(newval) {
                if(newval) {
                    this.initFormData()
                }
            }
        },

        async mounted() {
            if(this.data) {
                this.initFormData()
            }

            await this.fetchApprovers()
        },

        methods: {
            initFormData() {
                Object.keys(this.formData).forEach(key => {
                    this.formData[key] = this.data[key]
                })
            },

            async onSubmit() {
                try {
                    this.isSubmitting = true
                    const { data } = await this.$http.post('annual-leave', this.formData)

                    if(!data.error) {
                        this.$emit('created', true)
                        
                        this.$showAlert({
                            type: 'success',
                            title: 'Congratulations!',
                            message: 'Created new leave day successfully'
                        })
                    }
                } catch (err) {
                    console.log(err)

                    if(err.response.status == 422) {
                        this.$parseResponseErrors(this.$refs, err.response.data.data)
                    }
                } finally {
                    this.isSubmitting = false
                }
            },

            async fetchApprovers() {
                try {
                    const { data } = await this.$http.get('annual-leave/list_approvers')

                    if(!data.error) {
                        this.approvers = data.data.map(u => ({
                            label: u.username + ' - ' + u.fullname,
                            value: u.id
                        }))
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }
</script>