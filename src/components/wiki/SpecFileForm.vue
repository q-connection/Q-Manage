<template>
    <b-card>
        <div class="mb-4">
            <router-link :to="{name: 'project-wiki-spec-files'}">
                <q-icon icon="eva:arrow-ios-back-outline"/>
                Back
            </router-link>
        </div>
        <div class="mb-2 h5 font-weight-bold">{{ editing ? 'Edit Specification' : 'Create New Specification' }}</div>        
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
                                :disabled="editing ? true : false"
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
                            name="screen_id"
                            ref="screen_id"
                            rules="required"
                        >
                            <custom-select
                                mode="select"
                                label="Feature/Screen"
                                v-model="formData.screen_id"
                                :error="errors[0]"
                                :state="$isValid(errors, valid)"
                                :config="screenConfig"
                                required
                                :disabled="editing ? true : false"
                            >
                                <template slot="creation" slot-scope="{reset, search, isCreating}">
                                    <FormLocalization :reset="reset" :name="search" v-if="isCreating"/>
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
                                :disabled="editing ? true : false"
                            >
                                <template slot="creation" slot-scope="{reset, search, isCreating}">
                                    <FormLabel :reset="reset" :name="search" v-if="isCreating"/>
                                </template>
                            </custom-select>
                        </validation-provider>
                    </b-col>
                    <b-col cols=12>
                        <div class="design-section">
                            <div class="design-title">Design</div>
                            <b-row class="align-items-center" v-for="(item, index) in formData.design_urls" :key="index">
                                <b-col cols=12 xl=6 lg=6>
                                    <validation-provider
                                        v-slot="{errors, valid}"
                                        :name="`design.${index}.title`"
                                        :ref="`design.${index}.title`"
                                        rules="required"
                                    >
                                        <form-group
                                            mode="input"
                                            label="Title"
                                            placeholder="Enter title..."
                                            v-model="item.title"
                                            :error="errors[0]"
                                            :state="$isValid(errors, valid)"
                                            required
                                        />
                                    </validation-provider>   
                                </b-col>
                                <b-col cols=12 xl=6 lg=6>
                                    <div class="d-flex">
                                        <validation-provider
                                            v-slot="{errors, valid}"
                                            :name="`design.${index}.url`"
                                            :ref="`design.${index}.url`"
                                            :rules="{
                                                required: true,
                                                regex: /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
                                            }"
                                            class="w-100"
                                        >
                                            <form-group
                                                mode="input"
                                                label="URL"
                                                placeholder="Enter url..."
                                                v-model="item.url"
                                                :error="errors[0]"
                                                :state="$isValid(errors, valid)"
                                                required
                                            />
                                        </validation-provider> 
                                        <div class="pl-2" style="width: 40px; padding-top: 1.75rem">
                                            <b-button variant="danger" style="min-width: auto" @click="deleteDesignItem(index)" :disabled="index == 0">
                                                <q-icon icon="fa6-solid:trash-can"/>
                                            </b-button>                                            
                                        </div>
                                    </div>  
                                </b-col>
                            </b-row> 
                            <b-button
                                variant="success"
                                size="sm"
                                class="px-3 py-2"
                                @click="addDesignItem"
                            >
                                Add More
                            </b-button>
                        </div>                    
                    </b-col>
                    <b-col cols=12 xl=3 lg=3>
                        <validation-provider
                            v-slot="{errors, valid}"
                            name="file"
                            ref="file"
                            rules="ext:xlsx,xls"
                        >
                            <form-group
                                mode="file"
                                label="Localization String"
                                v-model="formData.file"
                                :error="errors[0]"
                                :state="$isValid(errors, valid)"
                                icon=""
                                customClass="icon-document"
                            />                            
                        </validation-provider>                        
                    </b-col>
                    <b-col cols=12>
                        <validation-provider
                            v-slot="{errors, valid}"
                            name="description"
                            ref="description"
                            rules="required"
                        >
                            <form-content-editor
                                label="Description"
                                placeholder="Enter description..."
                                v-model="formData.description"
                                :error="errors[0]"
                                :state="$isValid(errors, valid)"
                                reviewable
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
    import FormLocalization from '@/components/wiki/FormLocalization.vue'

    export default {
        props: {
            editing: {
                type: Boolean,
                default: false
            },

            spec: {
                default: null
            }
        },

        components: {FormLabel, FormVersion, FormLocalization},

        data: () => ({
            isSubmitting: false,
            formData: {
                project_id: null,
                version_id: null,
                screen_id: null,
                tag_id: null,
                file: null,
                design_urls: [
                    {title: '', url: ''}
                ],
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

            screenConfig() {
                return {
                    server_side: true,
                    permission: 'localization-string',
                    endpoint: 'localization_features',
                    params: {
                        project_id: this.$route.params.id,
                    },
                    resolveData: data => ({
                        label: data.name,
                        value: data.id,
                        style: 'font-size: 14px; font-weight: bold'
                    })
                }
            },            
        },

        mounted() {
            if(this.spec) {
                Object.keys(this.formData).forEach(key => {
                    this.formData[key] = this.spec[key] || null
                })
            }
        },

        methods: {
            async onSubmit() {
                try {
                    this.isSubmitting = true
                    this.formData.project_id = this.$route.params.id
                    const url_path = `project_specs/${this.editing ? this.$route.params.spec_id : '' }`
                    const { data } = await this.$http.post(url_path, this.$objToFormData(this.formData))

                    if(!data.error) {
                        this.$showAlert({
                            type: 'success',
                            title: 'Congratulations!',
                            message: this.editing ? "Saved changes successfully." : "Created new spec file successfully."
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
            },

            addDesignItem() {
                this.formData.design_urls.push({
                    title: '',
                    url: ''
                })
            },

            deleteDesignItem(idx) {
                if(idx == 0) return

                this.$delete(this.formData.design_urls, idx)
            }
        }
    }
</script>

<style lang="scss" scoped>
.design-section {
    padding: 1rem;
    position: relative;
    border: 1px solid #E0E0E0;
    border-radius: 20px;
    margin: .75rem 0 1rem 0;

    .design-title {
        position: absolute;
        top: -10px;
        left: 1.75rem;
        background-color: #fff;
        font-weight: bold;
    }
}
</style>