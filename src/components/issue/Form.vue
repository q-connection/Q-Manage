<template>
    <validation-observer v-slot="{handleSubmit}">
        <form @submit.prevent="handleSubmit(onSubmit)">
            <b-row>
                <b-col cols=12 xl=9 lg=9>
                    <b-card class="mb-3">
                        <b-card-body class="p-1">
                            <validation-provider 
                                v-slot="{errors, valid}"
                                name="name"
                                ref="name"
                                rules="required|min:3|max:250"
                            >
                                <form-group
                                    mode="input"
                                    label="Name"
                                    placeholder="Enter issue name..."
                                    :error="errors[0]"
                                    :state="$isValid(errors, valid)"
                                    v-model="formData.name"
                                    required
                                />
                            </validation-provider>
                            <validation-provider 
                                v-slot="{errors, valid}"
                                name="content"
                                ref="content"
                                rules="required"
                            >
                                <form-content-editor
                                    label="Content"
                                    placeholder="Enter content..."
                                    :error="errors[0]"
                                    :state="$isValid(errors, valid)"
                                    v-model="formData.content"
                                    required
                                    reviewable
                                />
                            </validation-provider>
                            <validation-provider 
                                v-slot="{errors, valid}"
                                name="files"
                                ref="files"
                            >
                                <form-group
                                    mode="file"
                                    label="Files"
                                    placeholder="Choose files..."
                                    description="Only support files: jpg, jpeg, png, gif, pdf, doc, docx, xlsx, xls, zip, rar, tar, tar.gz"
                                    :error="errors[0]"
                                    :state="$isValid(errors, valid)"
                                    v-model="formData.files"
                                    multiple
                                />    
                            </validation-provider>    
                            <div class="mb-3" v-if="formData.files || file_urls.length > 0">
                                <ul class="list-group">
                                    <li 
                                        class="list-group-item"
                                        v-for="(file, fileIdx) in formData.files" 
                                        :key="`file_${fileIdx}`"                                
                                    >
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="text-primary">
                                                <span class="h5 mb-0">
                                                    <q-icon icon="ant-design:cloud-upload-outlined"/>
                                                </span>
                                                {{ $parseFileName(file) }}
                                            </div>
                                            <div>
                                                <form-button-icon
                                                    icon="bi:trash-fill"
                                                    variant="danger"
                                                    @click="removeFile(fileIdx)"
                                                /> 
                                            </div>
                                        </div>                                        
                                    </li>
                                    <li 
                                        class="list-group-item"
                                        v-for="(file, fileIdx) in file_urls" 
                                        :key="`file_url_${fileIdx}`"                                
                                    >
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                <a :href="file">
                                                    {{ $parseFileName(file) }}
                                                </a>
                                            </div>
                                            <div>
                                                <form-button-icon
                                                    icon="bi:trash-fill"
                                                    variant="danger"
                                                    @click="removeFileUrl(fileIdx)"
                                                /> 
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>                             
                            <div class="d-flex justify-content-end">
                                <form-button
                                    type="submit"
                                    variant="primary"
                                    class="w-md-100"
                                    style="min-width: 250px"
                                    :loading="loading"
                                    :disabled="loading"
                                    loading-without-hidden-text
                                >
                                    {{ editing ? 'UPDATE ISSUE' : 'SUBMIT NEW ISSUE' }}
                                </form-button>    
                            </div>                       
                        </b-card-body>                        
                    </b-card>
                </b-col>
                <b-col cols=12 xl=3 lg=3>
                    <b-card>
                        <b-card-body class="p-1">
                            <validation-provider 
                                v-slot="{errors}"
                                name="assigned_customers"
                                ref="assigned_customers"
                            >                            
                                <Assignees 
                                    v-model="formData.assigned_customers" 
                                    :error="errors[0]"
                                />
                            </validation-provider>
                            <validation-provider 
                                v-slot="{errors}"
                                name="labels"
                                ref="labels"
                                rules="required"
                            >                            
                                <CustomSelect
                                    label="Labels"
                                    v-model="formData.labels"
                                    :error="errors[0]"
                                    :config="labelConfig"
                                    required
                                    multiple
                                >
                                    <template slot="creation" slot-scope="{reset, search, isCreating}">
                                        <FormLabel :reset="reset" :name="search" v-if="isCreating"/>
                                    </template>
                                    <template slot="option" slot-scope="opt">
                                        <div 
                                            class="font-weight-bold" 
                                            style="padding: 0.15rem 0.75rem; font-size: 10px; border-radius: 10px" 
                                            :class="opt.class" 
                                            :style="opt.style"
                                        >
                                            {{ opt.label }}
                                        </div>                                        
                                    </template>
                                </CustomSelect>
                            </validation-provider>
                            <validation-provider 
                                v-slot="{errors}"
                                name="teams"
                                ref="teams"
                                rules="required"
                            >                            
                                <CustomSelect
                                    label="Team"
                                    v-model="formData.teams"
                                    :error="errors[0]"
                                    :config="teamConfig"
                                    required
                                    multiple
                                >
                                    <template slot="creation" slot-scope="{reset, search, isCreating}">
                                        <FormTeam :reset="reset" :name="search" v-if="isCreating"/>
                                    </template>
                                </CustomSelect>
                            </validation-provider>
                            <validation-provider 
                                v-slot="{errors, valid}"
                                name="start_date"
                                ref="start_date"
                                rules="required"
                            >                            
                                <form-group
                                    mode="datepicker"
                                    label="Start Date"
                                    placeholder="dd/mm/yyyyy"
                                    :error="errors[0]"
                                    :state="$isValid(errors, valid)"
                                    v-model="formData.start_date"
                                    :max="formData.end_date"
                                    required
                                />
                            </validation-provider>
                            <validation-provider 
                                v-slot="{errors, valid}"
                                name="end_date"
                                ref="end_date"
                                rules="required"
                            >                            
                                <form-group
                                    mode="datepicker"
                                    label="End Date"
                                    placeholder="dd/mm/yyyyy"
                                    :error="errors[0]"
                                    :state="$isValid(errors, valid)"
                                    v-model="formData.end_date"
                                    :min="formData.start_date"
                                    required
                                />
                            </validation-provider>
                            <validation-provider 
                                v-slot="{errors, valid}"
                                name="point"
                                ref="point"
                                rules="required|numeric|min:1|max:999999"
                            >                            
                                <form-group
                                    mode="input"
                                    type="number"
                                    label="Point"
                                    placeholder="Point (min: 1)"
                                    description="Minimum: 1 point"
                                    :error="errors[0]"
                                    :state="$isValid(errors, valid)"
                                    v-model.number="formData.point"
                                    required
                                />
                            </validation-provider>
                            <validation-provider 
                                v-slot="{errors, valid}"
                                name="status"
                                ref="status"
                                rules="required"
                            >                            
                                <form-group
                                    mode="select"
                                    label="Status"
                                    placeholder="Select status"
                                    :error="errors[0]"
                                    :state="$isValid(errors, valid)"
                                    v-model="formData.status"
                                    :options="statuses"
                                    required
                                />
                            </validation-provider>
                        </b-card-body>
                    </b-card>
                </b-col>
            </b-row>
        </form>
    </validation-observer>
</template>

<script>
    import Assignees from '@/components/issue/SelectAssignees.vue'
    import CustomSelect from '@/components/CustomSelect.vue'
    import FormLabel from '@/components/issue/FormLabel.vue'
    import FormTeam from '@/components/issue/FormTeam.vue'

    export default {
        name: 'IssueForm',

        components: {Assignees, CustomSelect, FormLabel, FormTeam},
        
        props: {
            editing: {
                type: Boolean,
                default: false
            },
            
            loading: {
                type: Boolean,
                default: false
            },
            
            issue: {
                type: Object,
                default: null
            }
        },

        data: () => ({
            statuses: [
                {label: 'To Do', value: 'to_do'},
                {label: 'In Progress', value: 'inprogess'},
                {label: 'Pending', value: 'pending'},
                {label: 'Done', value: 'done'},
            ],
            file_urls: [],
            formData: {
                project_id: null,
                name: '',
                content: '',
                files: null,
                assigned_customers: [],
                labels: [],
                start_date: null,
                end_date: null,
                point: 1,
                teams: [],
                status: 'to_do'
            }
        }),

        watch: {
            issue(newval){
                if(newval) {
                    this.initIssue()
                }
            }
        },

        computed: {
            labelConfig() {
                return {
                    server_side: true,
                    permission: 'issues.label',
                    endpoint: 'issues_labels',
                    storeKey: 'labels',
                    storeDispatch: 'fetchLabels',  
                    params: {
                        project_id: this.$route.params.id
                    },
                    filter: item => item.project_id == this.$route.params.id,                  
                    resolveData: data => ({
                        label: data.name,
                        value: data.id,
                        style: `background-color: ${data.color}; color: #fff`
                    })
                }
            },
            teamConfig() {
                return {
                    server_side: true,
                    permission: 'issues.team',
                    endpoint: 'issues_teams',
                    storeKey: 'teams',
                    storeDispatch: 'fetchTeams',                    
                    resolveData: data => ({
                        label: data.name,
                        value: data.id,
                        class: `text-primary m-0`,
                        style: 'font-size: 14px; font-weight: 600'
                    })
                }
            },
        },

        mounted() {
            if(this.issue) {
                this.initIssue()
            }
        },

        methods: {
            onSubmit() {
                const formData = Object.assign({}, this.formData)
                if(!this.editing) {
                    formData.project_id = this.$route.params.id
                }

                if(this.editing) {
                    const files = formData.files || []
                    formData.files = files.concat(this.file_urls)
                }

                const converted = this.$objToFormData(formData)
                console.log(converted.values())

                this.$emit('submit', {formData: converted, refs: this.$refs})
            },

            initIssue() {
                const keys = [
                    'project_id',
                    'name',
                    'content',
                    'assigned_customers',
                    'labels',
                    'start_date',
                    'end_date',
                    'point',
                    'teams',
                    'status',
                    'files'
                ]

                keys.forEach(key => {
                    if(this.issue[key]) {
                        switch(key) {
                            case 'labels':
                                this.formData[key] = this.issue[key].map(item => item.label_id)
                            break;
                            case 'teams':
                                this.formData[key] = this.issue[key].map(item => item.team_id)
                            break;
                            case 'files':
                                this.file_urls = this.issue.files
                                this.formData.files = null
                            break;
                            default:
                                this.formData[key] = this.issue[key]
                        }
                    }
                })
            },

            removeFile(idx) {
                this.$delete(this.formData.files, idx)
            },

            removeFileUrl(idx) {
                this.$delete(this.file_urls, idx)
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>