<template>
    <div id="auth-wrapper" :class="{mobile: $device.mobile === true}">
        <div class="auth-form">
            <div class="logo">
                <img src="/images/logo.png" alt="Q-Connection Logo" class="logo">
            </div>
            <b-form @submit.prevent="onSubmit">
                <b-form-input v-model="formData.password" type="password" placeholder="New password ..." required></b-form-input>
                <b-form-input v-model="formData.password_confirmation" type="password" placeholder="Confirm new password ..." required></b-form-input>
                <div class="d-flex justify-content-between">
                    <router-link :to="{name: 'forgot'}">
                        <b-icon icon="chevron-left"/>
                        Back to login
                    </router-link>
                </div>
                <div class="d-flex justify-content-center">
                    <form-button type="submit" variant="primary" :disabled="isSubmitting" :loading="isSubmitting">
                        RESET PASSWORD
                    </form-button>
                </div>
            </b-form>
        </div>
        <sticky-footer/>
    </div>
</template>

<script>
    import {validate} from 'uuid'
    
    export default {
        data: () => ({
            isSubmitting: false,
            formData: {
                code: '',
                password: '',
                password_confirmation: ''
            }
        }),

        methods: {
            async onSubmit() {
                this.isSubmitting = true
                const resp = await this.$store.dispatch('resetPassword', this.formData)

                if(!resp.error) {
                    this.$showAlert({type: 'success', message: "Reset password successfully. From now you can login with your new password"})
                    setTimeout(() => {
                        this.$router.push({name: 'login'})
                    }, 1000)
                } else {
                    if(resp.message) {
                        this.$showAlert({type: 'danger', message: resp.message})
                    } else {
                        this.$showAlert({type: 'danger', message: "Your reset password request is invalid or expired."})
                    }
                }

                this.isSubmitting = false
            }
        },

        mounted() {
            if(!this.$route.params.uuid || !validate(this.$route.params.uuid)) {
                this.$router.push({name: 'login'})

                return
            }

            this.formData.code = this.$route.params.uuid
        }
    }
</script>