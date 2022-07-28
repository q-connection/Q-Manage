<template>
    <div id="auth-wrapper" :class="{mobile: $device.mobile === true}">
        <div class="auth-form">
            <div class="logo">
                <img src="/images/logo.png" alt="Q-Connection Logo" class="logo">
            </div>
            <b-form @submit.prevent="onSubmit">
                <p class="text-center">
                    Have you forgotten your password?<br/>
                    Please enter your email account. System will send a email with active link to reset your password.                    
                </p>
                <b-form-input type="email" v-model="formData.email" placeholder="Email ..." required></b-form-input>
                <div class="d-flex justify-content-between">
                    <router-link :to="{name: 'login'}">
                        <b-icon icon="chevron-left"/>
                        Back to login
                    </router-link>
                </div>
                <div class="d-flex justify-content-center">
                    <form-button type="submit" variant="primary" :disabled="isSubmitting" :loading="isSubmitting">
                        RESET MY PASSWORD
                    </form-button>
                </div>
            </b-form>
        </div>
        <sticky-footer position="fixed"/>
    </div>
</template>

<script>
import StickyFooter from '@/components/StickyFooter.vue'
    export default {
    components: { StickyFooter },
        data: () => ({
            isSubmitting: false,
            formData: {
                email: '',
                isRegister: 0
            }
        }),

        methods: {
            async onSubmit() {
                this.isSubmitting = true
                const resp = await this.$store.dispatch('forgot', this.formData)

                if(!resp.error) {
                    this.$showAlert({type: 'success', message: 'We have sent an mail with Reset Password link to your Email.'})
                } else {
                    this.$showAlert({type: 'danger', message: "Your email is not valid, please try again."})
                }

                this.isSubmitting = false
            }
        }
    }
</script>