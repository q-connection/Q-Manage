<template>
    <div id="auth-wrapper" :class="{mobile: $device.mobile === true}">
        <div class="auth-form">
            <div class="logo">
                <img src="/images/logo.png" alt="Q-Connection Logo" class="logo">
            </div>
            <b-form @submit.prevent="onLoginSubmit">
                <b-form-input v-model="formData.username" placeholder="User name ..."></b-form-input>
                <b-form-input v-model="formData.password" type="password" placeholder="Password ..."></b-form-input>
                <div class="d-flex justify-content-between">
                    <b-form-checkbox v-model="formData.remember" value="1" unchecked-value="0">Remember me?</b-form-checkbox>
                    <router-link class="text-right" :to="{name: 'forgot'}">Forgot password?</router-link>
                </div>
                <div class="d-flex justify-content-center">
                    <form-button type="submit" variant="primary" :disabled="isSubmitting" :loading="isSubmitting">
                        LOGIN
                    </form-button>
                </div>
            </b-form>
        </div>
        <sticky-footer/>
    </div>
</template>

<script>
import StickyFooter from '@/components/StickyFooter.vue'
    export default {
    components: { StickyFooter },
        data: () => ({
            isSubmitting: false,
            formData: {
                username: '',
                password: '',
                remember: 0
            }
        }),

        methods: {
            async onLoginSubmit() {
                this.isSubmitting = true
                const login = await this.$store.dispatch('login', this.formData)

                if(login) {
                    this.$showAlert({type: 'success', message: 'Đăng nhập thành công', timeout: 2000})
                    setTimeout(() => {
                        this.$router.push({name: 'dashboard'})
                    }, 1500)
                } else {
                    this.$showAlert({type: 'danger', message: 'Username or password is not correct'})
                }

                this.isSubmitting = false
            }
        }
    }
</script>