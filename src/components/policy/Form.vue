<template>
    <validation-observer ref="policyForm" v-slot="{handleSubmit}">
        <b-form @submit.prevent="handleSubmit(onSubmit)">
            <b-row>
                <b-col cols=12 :class="{'pt-3': $device.mobile === true}">
                    <b-row>
                        <b-col cols=12 xl=6 lg=6>
                            <validation-provider rules="required|max:255" name="name" ref="name" v-slot="{errors, valid}">
                                <form-group
                                    mode="input"
                                    label="Name"
                                    placeholder="Enter name..."
                                    v-model="formData.name"
                                    :state="$isValid(errors, valid)"
                                    :error="errors[0]"
                                    required
                                />
                            </validation-provider>
                        </b-col>
                        <b-col cols=12 xl=6 lg=6>
                            <validation-provider rules="ext:pdf" name="file" ref="file" v-slot="{errors, valid}">
                                <form-group
                                    mode="file"
                                    label="File (PDF)"
                                    placeholder="Choose a file..."
                                    accept=".pdf"
                                    custom-class="pdf"                                    
                                    v-model="formData.file"
                                    :state="$isValid(errors, valid)"
                                    :error="errors[0]"
                                />
                            </validation-provider>
                        </b-col>
                        <b-col cols=12>
                            <validation-provider rules="required" name="description" ref="description" v-slot="{errors, valid}">
                                <form-group
                                    mode="textarea"
                                    label="Description"
                                    placeholder="Enter description..."
                                    v-model="formData.description"
                                    :state="$isValid(errors, valid)"
                                    :error="errors[0]"
                                    rows="5"
                                    required
                                />
                            </validation-provider>
                        </b-col>       
                        <b-col cols=12>
                            <b-row class="align-items-center">
                                <b-col cols=12 xl=4 lg=4>
                                    <b-form-checkbox v-model="formData.high_priority" :value="true" :unchecked-value="false">
                                        High Priority
                                    </b-form-checkbox>       
                                </b-col>      
                                <b-col cols=12 xl=8 lg=8>        
                                    <div class="float-right">
                                        <form-button 
                                            type="submit" 
                                            variant="primary" 
                                            style="min-width: 250px" 
                                            :loading="isSubmitting" 
                                            :disabled="isSubmitting"
                                            loading-without-hidden-text
                                        >
                                            SAVE
                                        </form-button>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-col>                 
                    </b-row>
                </b-col>
            </b-row>
        </b-form>
    </validation-observer>
</template>

<script>
    export default {
        name: 'PolicyForm',

        props: {
            isSubmitting: {
                type: Boolean,
                default: false
            },

            data: {
                type: [Array, Object],
                default: null
            }
        },

        data: () => ({
            formData: {
                id: null,
                upload_type: 'policies',
                name: '',
                description: '',
                file: null,
                high_priority: false
            }
        }),

        watch: {
            data(newval) {
                if(newval) {
                    this.initFormData()
                }
            }
        },

        mounted() {
            if(this.data) {
                this.initFormData()
            }
        },

        methods: {
            initFormData() {
                Object.keys(this.formData).forEach(key => {
                    this.formData[key] = this.data[key]
                })

                this.formData.file = null
            },

            async onSubmit() {
                const formData = Object.assign({}, this.formData)
                this.$emit('submit', {formData: this.$objToFormData(formData), refs: this.$refs})
            }
        }
    }
</script>

<style lang="scss" scoped>
.thumbnail {
    min-width: 185px;
    height: 238px;
    border-radius: 10px;
    overflow: hidden;
}
</style>