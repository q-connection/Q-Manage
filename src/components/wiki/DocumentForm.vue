<template>
    <b-card>
        <div class="mb-4">
            <router-link :to="{name: 'project-wiki-documents'}">
                <q-icon icon="eva:arrow-ios-back-outline"/>
                Back
            </router-link>
        </div>
        <div class="mb-2 h5 font-weight-bold">{{ !document ? 'Create New Document' : 'Edit Document' }}</div>        
        <validation-observer v-slot="{handleSubmit}">
            <form @submit.prevent="handleSubmit(onSubmit)">
                <b-row>
                    <b-col cols=12 xl=6 lg=6>
                        <validation-provider
                            v-slot="{errors, valid}"
                            name="title"
                            ref="title"
                            rules="required"
                        >
                            <form-group
                                mode="input"
                                label="Title"
                                placeholder="Enter title..."
                                v-model="formData.title"
                                :error="errors[0]"
                                :state="$isValid(errors, valid)"
                                rows="5"
                                required
                            />
                        </validation-provider>                        
                    </b-col>
                    <b-col cols=12>
                        <b-row>
                            <b-col cols=12 xl=6 lg=6>
                                <validation-provider
                                    v-slot="{errors, valid}"
                                    name="file"
                                    ref="file"
                                    :rules="{
                                        required: editing ? false : true, 
                                        ext: ['bmp', 'jpg','jpeg','png','gif','doc','docx','xlsx','xls','pdf','zip','rar','tar', 'tar.gz'], 
                                        size: 26000
                                    }"
                                >
                                    <form-group
                                        mode="file"
                                        label="Upload File"
                                        customClass="icon-document"
                                        v-model="formData.file"
                                        :error="errors[0]"
                                        :state="$isValid(errors, valid)"
                                        icon=""
                                        :required="editing ? false : true"
                                    />
                                </validation-provider>   
                            </b-col>
                        </b-row>                     
                    </b-col>
                    <b-col cols=12>
                        <validation-provider
                            v-slot="{errors, valid}"
                            name="description"
                            ref="description"
                            rules="required"
                        >
                            <form-group
                                mode="textarea"
                                label="Description"
                                placeholder="Enter description..."
                                v-model="formData.description"
                                :error="errors[0]"
                                :state="$isValid(errors, valid)"
                                rows="5"
                                required
                            />
                        </validation-provider>                        
                    </b-col>
                    <b-col cols=12>
                        <div class="d-flex justify-content-end">
                            <form-button
                                type="submit"
                                variant="primary"
                                class="w-md-100"
                                style="min-width: 250px"
                                :loading="isSubmitting"
                                :disabled="isSubmitting"
                            >
                                SAVE
                            </form-button>
                        </div>
                    </b-col>
                </b-row>
            </form>
        </validation-observer>
    </b-card>
</template>

<script>
    export default {
        props: {
            document: {
                default: null
            },
            editing: {
                type: Boolean,
                default: false
            }                
        },

        data: () => ({
            isSubmitting: false,
            formData: {
                project_id: null,
                title: '',
                file: null,
                description: ''
            }
        }),

        watch: {
            document: {
                immediate: true,
                deep: true,
                handler(newval) {
                    if(newval) {
                        Object.keys(this.formData).forEach(key => {
                            if(key != 'file') {
                                this.formData[key] = newval[key]
                            }
                        })
                    }
                }
            }
        },

        methods: {
            async onSubmit() {
                try {
                    this.isSubmitting = true
                    this.formData.project_id = this.$route.params.id
                    const { data } = await this.$http({
                        method: 'POST',
                        url: `project_documents${this.editing ? `/${this.$route.params.doc_id}` : ''}`,
                        data: this.$objToFormData(this.formData)
                    })

                    if(!data.error) {
                        this.$showAlert({
                            type: 'success',
                            title: 'Congratulations!',
                            message: this.editing ? 'Saved changes successfully!' : 'Created new spec file successfully.'
                        })

                        this.$router.push({name: 'project-wiki-documents', params: {id: this.$route.params.id}})
                    }
                } catch (err) {
                    console.log(err)

                    if(err.response && err.response.status == 422) {
                        this.$parseResponseErrors(this.$refs, err.response.data.data)
                    }

                    if(err.response && err.response.status != 422) {
                        this.$showAlert({
                            type: 'danger',
                            title: 'Oops!',
                            message: err.response.data.message
                        })
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