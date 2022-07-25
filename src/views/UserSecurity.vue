<template>
    <b-container fluid>
        <b-row>
            <b-col cols=12 xl=3 lg=2 v-if="!$device.mobile">
                <user-info-block/>
            </b-col>            
            <b-col cols="12" xl=4 lg=6>
                <b-card title="Change Password" :class="{mobile: $device.mobile === true}">
                    <validation-observer ref="changePwForm" v-slot="{handleSubmit}">
                        <b-form @submit.prevent="handleSubmit(onSubmit)">
                            <b-row>
                                <validation-provider class="col-12" rules="required" v-slot="{errors}" name="current_password">
                                    <b-form-group label="Current password" :invalid-feedback="errors[0]" :state="errors[0] && errors[0].length <= 0">
                                        <b-form-input type="password" name="current_password" placeholder="Enter your current password" v-model="changePwData.current_password" :state="errors[0] && errors[0].length <= 0"/>
                                    </b-form-group>
                                </validation-provider>
                            </b-row>
                            <b-row>
                                <validation-provider class="col-12"  rules="required|min:6|max:30" v-slot="{errors}" vid="confirmation" name="new_password">
                                    <b-form-group label="New password" :invalid-feedback="errors[0]" :state="errors[0] && errors[0].length <= 0" description="Min: 6 characters, Max: 30 characters">
                                        <b-form-input type="password" name="new_password" placeholder="Enter your new password" v-model="changePwData.new_password" :state="errors[0] && errors[0].length <= 0"/>
                                    </b-form-group>
                                </validation-provider>
                            </b-row>
                            <b-row>
                                <validation-provider class="col-12"  rules="required|min:6|max:30|confirmed:confirmation" v-slot="{errors}" name="new_password_confirmation">
                                    <b-form-group label="New password confirm" :invalid-feedback="errors[0]" :state="errors[0] && errors[0].length <= 0">
                                        <b-form-input type="password" name="new_password_confirmation" placeholder="Re-enter your new password" v-model="changePwData.new_password_confirmation" :state="errors[0] && errors[0].length <= 0"/>
                                    </b-form-group>
                                </validation-provider>
                            </b-row>
                            <div class="d-flex justify-content-end">
                                <form-button type="submit" variant="primary" :disabled="isSubmitting" :loading="isSubmitting" loading-without-hidden-text>
                                    SUBMIT
                                </form-button>
                            </div>
                        </b-form>
                    </validation-observer>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        data: () => ({
            isSubmitting: false,
            changePwData: {
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
            }
        }),

        methods: {
            async onSubmit() {
                try {
                    this.isSubmitting = true
                    const { data } = await this.$http.post('employee/change-password', this.changePwData)

                    if(!data.error) {
                        this.$showAlert({type: 'success', message: "Change password successfully!"})

                        this.changePwData.current_password = ''
                        this.changePwData.new_password = ''
                        this.changePwData.new_password_confirmation = ''
                        this.$refs.changePwForm.reset()
                    } else {
                        this.$showAlert({type: 'danger', message: data.message})
                    }
                } catch (err) {
                    console.log(err)
                    
                    if(err.response.data) {
                        this.$showAlert({type: 'danger', message: err.response.data.message})
                    }
                } finally {
                    this.isSubmitting = false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>