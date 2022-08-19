<template>
<div class="p-3">
    <validation-observer v-slot="{handleSubmit}">
        <form @submit.prevent="handleSubmit(onSubmit)">
            <validation-provider v-slot="{errors, valid}" rules="required" name="name" ref="name">
                <form-group
                    mode="input"
                    label="Name"
                    placeholder="Enter team name..."
                    v-model="formData.name"
                    :error="errors[0]"
                    :state="$isValid(errors, valid)"
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
                name: 'Team Name',
            }
        }),

        watch: {
            name(newval) {
                this.formData.name = newval || 'Team Name'
            }
        },

        methods: {
            async onSubmit() {
                try {
                    this.isSubmitting = true
                    const { data } = await this.$http.post('issues_teams', this.formData)

                    if(!data.error) {
                        if(typeof this.reset == 'function') {
                            this.reset()
                        }
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    this.isSubmitting = false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>