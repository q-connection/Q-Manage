<template>
<div class="p-3">
    <validation-observer v-slot="{handleSubmit}">
        <form @submit.prevent="handleSubmit(onSubmit)">
            <div class="mb-3">
                <div for="preview">Preview</div>
                <div class="badge text-white px-2 py-1" :style="{backgroundColor: formData.color}">{{ formData.name }}</div>
            </div>
            <validation-provider v-slot="{errors, valid}" rules="required" name="name" ref="name">
                <form-group
                    mode="input"
                    label="Name"
                    placeholder="Enter label name..."
                    v-model="formData.name"
                    :error="errors[0]"
                    :state="$isValid(errors, valid)"
                    required
                />
            </validation-provider>
            <validation-provider v-slot="{errors, valid}" name="description" ref="description">
                <form-group
                    mode="input"
                    label="Description"
                    placeholder="Enter label description..."
                    v-model="formData.description"
                    :error="errors[0]"
                    :state="$isValid(errors, valid)"
                />
            </validation-provider>
            <validation-provider v-slot="{errors, valid}" rules="required" name="color" ref="color">
                <form-group
                    mode="color"
                    label="Color"
                    v-model="formData.color"
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
                color: '#A72218',
                name: 'Label Name',
                description: ''
            }
        }),

        watch: {
            name(newval) {
                this.formData.name = newval || 'Label Name'
            }
        },

        methods: {
            async onSubmit() {
                try {
                    this.isSubmitting = true
                    const { data } = await this.$http.post('issues_labels', this.formData)

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