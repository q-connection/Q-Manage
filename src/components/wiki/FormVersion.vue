<template>
    <div class="p-3">
        <validation-observer v-slot="{handleSubmit}">
            <form @submit.prevent="handleSubmit(onSubmit)">
                <validation-provider
                    v-slot="{errors, valid}"
                    name="name"
                    ref="name"
                    rules="required"
                >
                    <form-group
                        mode="input"
                        label="Name"
                        v-model="formData.name"
                        :state="$isValid(errors, valid)"
                        :error="errors[0]"
                        required
                    />
                </validation-provider>
                <div class="d-flex justify-content-end mt-3">
                    <form-button
                        type="submit"
                        variant="success"
                        size="sm"
                        class="p-2"
                        :loading="isSubmitting"
                        :disabled="isSubmitting"
                        loading-without-hidden-text
                    >
                        Save
                    </form-button>
                </div>                                
            </form>
        </validation-observer>
    </div>
</template>

<script>
    export default {
        props: ['reset', 'name'],

        data: () => ({
            isSubmitting: false,
            formData: {
                name: ''
            }            
        }),

        watch: {
            name(newval) {
                this.formData.name = newval || 'Label Name'
            }
        },        

        mounted() {
            this.formData.name = this.name || 'Label Name'
        },

        methods: {
            async onSubmit() {
                try {
                    this.isSubmitting = true
                    const { data } = await this.$http.post('versions', this.formData)

                    if(!data.error) {
                        if(typeof this.reset == 'function') {
                            this.reset()
                        }
                    }
                } catch (err) {
                    console.log(err)

                    this.$showAlert({
                        type: 'danger',
                        title: 'Oops!',
                        message: 'Something went wrong.'
                    })                    
                } finally {
                    this.isSubmitting = false
                }
            },            
        }
    }
</script>

<style lang="scss" scoped>

</style>