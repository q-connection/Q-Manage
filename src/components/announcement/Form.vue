<template>
    <validation-observer ref="announcementForm" v-slot="{handleSubmit}">
        <b-form @submit.prevent="handleSubmit(onSubmit)">
            <b-row>
                <b-col cols=12 xl=3 lg=3>
                    <div class="thumbnail">
                        <validation-provider 
                            rules="ext:jpg,jpeg,png|size:3072" 
                            name="thumbnail" 
                            ref="thumbnail" 
                            v-slot="{errors, valid}"
                        >
                            <form-image-upload v-model="formData.thumbnail" :previewUrl="formData.thumbnail_url" :state="$isValid(errors, valid)"/>
                            <div class="small text-danger text-center text-break">{{ errors[0] }}</div>
                        </validation-provider>
                    </div>
                </b-col>
                <b-col cols=12 xl=9 lg=9 :class="{'pt-3': $device.mobile === true}">
                    <b-row>
                        <b-col cols=12>
                            <validation-provider rules="required|max:255" name="title" ref="title" v-slot="{errors, valid}">
                                <b-form-group label="Title" :invalid-feedback="errors[0]" label-class="label-required">
                                    <b-form-input placeholder="Enter title..." v-model="formData.title" :state="$isValid(errors, valid)"/>
                                </b-form-group>
                            </validation-provider>
                        </b-col>
                        <b-col cols=12 xl=6 lg=6>
                            <validation-provider rules="required" name="expired_at" ref="expired_at" v-slot="{errors, valid}">
                                <form-group
                                    mode="datepicker"
                                    label="Expired at"
                                    v-model="formData.expired_at"
                                    :error="errors[0]"
                                    :state="$isValid(errors, valid)"
                                    required
                                />
                            </validation-provider>
                        </b-col>
                        <b-col cols=12 xl=6 lg=6>
                            <validation-provider rules="ext:pdf" name="files" ref="files" v-slot="{errors, valid}">
                                <b-form-group label="File (PDF)" :invalid-feedback="errors[0]">
                                    <b-form-file class="pdf" placeholder="Choose a file..." v-model="formData.files" :state="$isValid(errors, valid)"/>
                                </b-form-group>
                            </validation-provider>
                        </b-col>                        
                        <b-col cols=12>
                            <validation-provider rules="required" name="description" ref="description" v-slot="{errors, valid}">
                                <b-form-group label="Description" :invalid-feedback="errors[0]" label-class="label-required">
                                    <b-form-textarea rows="5" placeholder="Enter description..." v-model="formData.description" :state="$isValid(errors, valid)"/>
                                </b-form-group>
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
        name: 'FormAnnouncement',

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
                thumbnail: null,
                thumbnail_url: null,
                upload_type: 'announcements',
                title: '',
                description: '',
                files: null,
                high_priority: false,
                expired_at: ''
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
            if(!this.formData.expired_at) {
                this.formData.expired_at = this.$mm().format('YYYY-MM-DD')
            }

            if(this.data) {
                this.initFormData()
            }
        },

        methods: {
            initFormData() {
                Object.keys(this.formData).forEach(key => {
                    this.formData[key] = this.data[key]
                })

                this.formData.thumbnail = null
                this.formData.files = null
            },

            async onSubmit() {
                const formData = Object.assign({}, this.formData)
                this.$delete(formData, 'thumbnail_url')
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