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
                                <Labels
                                    v-model="formData.labels" 
                                    :error="errors[0]"
                                />
                            </validation-provider>
                            <validation-provider 
                                v-slot="{errors}"
                                name="teams"
                                ref="teams"
                                rules="required"
                            >                            
                                <Teams
                                    v-model="formData.teams" 
                                    :error="errors[0]"
                                />
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
    import Labels from '@/components/issue/SelectLabels.vue'
    import Teams from '@/components/issue/SelectTeams.vue'

    export default {
        name: 'IssueForm',

        components: {Assignees, Labels, Teams},
        
        props: {
            editing: {
                type: Boolean,
                default: false
            },
            
            loading: {
                type: Boolean,
                default: false
            },
            
        },

        data: () => ({
            statuses: [
                {label: 'To Do', value: 'to_do'},
                {label: 'In Progress', value: 'inprogess'},
                {label: 'Pending', value: 'pending'},
                {label: 'Done', value: 'done'},
            ],

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

        methods: {
            onSubmit() {
                const formData = Object.assign({}, this.formData)
                if(!this.editing) {
                    formData.project_id = this.$route.params.id
                }

                this.$emit('submit', {formData: this.$objToFormData(formData), refs: this.$refs})
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>