<template>
    <b-card>
        <div class="mb-4">
            <router-link :to="{name: 'project-wiki-spec-files'}">
                <q-icon icon="eva:arrow-ios-back-outline"/>
                Back
            </router-link>
        </div>
        <div class="mb-2 h5 font-weight-bold">Create New Spec File</div>        
        <validation-observer v-slot="{handleSubmit}">
            <form @submit.prevent="handleSubmit(onSubmit)">
                <b-row>
                    <b-col cols=12 xl=3 lg=3>
                        <validation-provider
                            v-slot="{errors, valid}"
                            name="version_id"
                            ref="version_id"
                            rules="required"
                        >
                            <custom-select
                                mode="select"
                                label="Version"
                                v-model="formData.version_id"
                                :error="errors[0]"
                                :state="$isValid(errors, valid)"
                                :config="versionConfig"
                                required
                            >
                                <template slot="creation" slot-scope="{reset, search, isCreating}">
                                    <FormVersion :reset="reset" :name="search" v-if="isCreating"/>
                                </template>
                            </custom-select>
                        </validation-provider>
                    </b-col>
                    <b-col cols=12 xl=3 lg=3>
                        <validation-provider
                            v-slot="{errors, valid}"
                            name="tag_id"
                            ref="tag_id"
                            rules="required"
                        >
                            <custom-select
                                mode="select"
                                label="Label"
                                v-model="formData.tag_id"
                                :error="errors[0]"
                                :state="$isValid(errors, valid)"
                                :config="labelConfig"
                                required
                            >
                                <template slot="creation" slot-scope="{reset, search, isCreating}">
                                    <FormLabel :reset="reset" :name="search" v-if="isCreating"/>
                                </template>
                            </custom-select>
                        </validation-provider>
                    </b-col>
                    <b-col cols=12>
                        <b-row>
                            <b-col cols=12 xl=6 lg=6>
                                <validation-provider
                                    v-slot="{errors, valid}"
                                    name="file"
                                    ref="file"
                                    rules="required|ext:bmp,jpg,jpeg,png,gif,doc,docx,xlsx,xls,pdf,zip,rar,tar,tar.gz|size:26000"
                                >
                                    <form-group
                                        mode="file"
                                        label="Upload File"
                                        customClass="icon-document"
                                        v-model="formData.file"
                                        :error="errors[0]"
                                        :state="$isValid(errors, valid)"
                                        icon=""
                                        required
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
    import FormLabel from '@/components/wiki/FormLabel.vue'
    import FormVersion from '@/components/wiki/FormVersion.vue'

    export default {
        components: {FormLabel, FormVersion},

        data: () => ({
            isSubmitting: false,
            formData: {
                project_id: null,
                version_id: null,
                tag_id: null,
                url: '',
                description: ''
            }
        }),

        computed: {
            versionConfig() {
                return {
                    server_side: true,
                    permission: 'project.version',
                    endpoint: 'versions',
                    params: {
                        project_id: this.$route.params.id
                    },
                    resolveData: data => ({
                        label: data.name,
                        value: data.id,
                        style: 'font-size: 14px; color: var(--primary); font-weight: bold'
                    })
                }
            },
            
            labelConfig() {
                return {
                    server_side: true,
                    permission: 'project.tag',
                    endpoint: 'design_tags',  
                    params: {
                        project_id: this.$route.params.id
                    },                                    
                    resolveData: data => ({
                        label: data.name,
                        value: data.id,
                        class: 'badge',
                        style: {
                            backgroundColor: data.color,
                            color: '#fff',
                        }
                    })
                }
            },
        },

        methods: {
            async onSubmit() {
                try {
                    this.isSubmitting = true
                    this.formData.project_id = this.$route.params.id
                    const { data } = await this.$http.post('project_specs', this.$objToFormData(this.formData))

                    if(!data.error) {
                        this.$showAlert({
                            type: 'success',
                            title: 'Congratulations!',
                            message: "Created new spec file successfully."
                        })

                        this.$router.push({name: 'project-wiki-spec-files', params: {id: this.$route.params.id}})
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