<template>
<div>
    <b-row>
        <b-col cols=12 xl=9 lg=9>
            <div class="position-relative overflow-hidden">
                <TransitionGroup name="list" tag="div">            
                <b-card class="card-issue" key="issue">
                    <div class="mb-3 pb-1 border-bottom">
                        <h6 class="font-weight-bold mb-0">[{{formData.cod}}] {{ formData.name }}</h6>
                        <small class="text-muted">
                            {{ $mm(formData.created_at).format('LLLL') }} by {{ formData.created_by.fullname }}
                        </small>
                    </div>
                    <div class="ql-snow">
                        <div class="issue-content ql-editor p-0" v-html="formData.content"></div>
                    </div>
                    <div class="mt-2" v-if="formData.files.length > 0">
                        <ul class="list-group">
                            <li 
                                class="list-group-item"
                                v-for="(file, fileIdx) in formData.files" 
                                :key="fileIdx"                                
                            >
                                <a :href="file">
                                    {{ $parseFileName(file) }}
                                </a>
                            </li>
                        </ul>
                    </div>                    
                </b-card>
                <b-card class="card-issue" v-for="(comment, index) in listComments" :key="index">
                    <div class="mb-3 pb-1 border-bottom d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img-lazy-load
                                class="avatar"
                                :src="comment.created_by.avatar_url"
                                error="/images/default-avatar.png"
                            />
                            <div class="ml-2">
                                <h6 class="mb-0">{{ comment.created_by.fullname }}</h6>
                                <small class="text-muted">
                                    {{ $mm(comment.created_at).format('LLLL') }}
                                </small>                            
                            </div>
                        </div>
                        <div>
                            <span 
                                class="h3 text-cursor mb-0" 
                                @click="toggleConfirmComment(comment.id)"
                                :class="{'text-secondary': comment.is_solved == 0, 'text-success': comment.is_solved == 1}"
                            >
                                <q-icon icon="akar-icons:circle-check"/>
                            </span>
                        </div>                    
                    </div>                    
                    <div class="ql-snow">
                        <div 
                            class="issue-content ql-editor p-0" 
                            style="min-height: auto" 
                            v-html="comment.content"
                            :data-comment-id="comment.id"
                        >
                        </div>
                    </div> 
                </b-card>     
                <b-card class="card-issue" key="footer">
                    <div class="d-flex justify-content-end" v-if="listCommentsSolved.length > 0">
                        <div 
                            class="bg-primary text-white px-2 py-1 text-cursor font-weight-bold" 
                            style="border-radius: 15px"
                            @click="show_all = !show_all"
                        >
                            <span v-if="!show_all">Show All ({{ listCommentsSolved.length }})</span>
                            <span v-else>Hide</span>
                        </div>
                    </div>
                    <validation-observer v-slot="{handleSubmit, reset}">
                        <form @submit.prevent="handleSubmit(handleCreateComment(reset))">
                            <validation-provider
                                v-slot="{errors, valid}"
                                name="content"
                                ref="content"
                                rules="requiredHtml"
                            >
                                <form-content-editor
                                    label="Content"
                                    v-model="commentData.content"
                                    :state="$isValid(errors, valid)"
                                    :error="errors[0]"
                                    reviewable
                                    required
                                />
                            </validation-provider>
                            <div class="d-flex justify-content-end align-items-center">
                                <form-button
                                    class="w-md-100"
                                    style="min-width: 200px"
                                    type="submit"
                                    variant="primary"
                                    :loading="isSubmitting"
                                    :disabled="isSubmitting"
                                    loading-without-hidden-text
                                >
                                    COMMENT
                                </form-button>
                            </div>
                        </form>
                    </validation-observer>
                </b-card>
                </TransitionGroup>    
            </div>   
        </b-col>
        <b-col cols=12 xl=3 lg=3>
            <b-card>
                <b-card-body class="p-1">
                    <validation-observer>
                        <validation-provider 
                            v-slot="{errors, valid}"
                            name="assigned_customers"
                            ref="assigned_customers"
                        >                            
                            <Assignees 
                                v-model="formData.assigned_customers" 
                                :error="errors[0]"
                                @input="onChange(valid, 'assigned_customers', $event)"
                            />
                        </validation-provider>
                        <validation-provider 
                            v-slot="{errors, valid}"
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
                                @input="onChange(valid, 'labels', $event)"
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
                            v-slot="{errors, valid}"
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
                                @input="onChange(valid, 'teams', $event)"
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
                                @input="onChange(valid, 'start_date', $event)"
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
                                @input="onChange(valid, 'end_date', $event)"
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
                                @input="onChange(valid,'point', $event)"
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
                                @input="onChange(valid, 'status', $event)"
                            />
                        </validation-provider>
                    </validation-observer>
                    <div class="d-flex justify-content-end">
                        <span class="text-cursor text-primary" @click="showLogsModal">
                            View logs
                        </span>
                    </div>
                </b-card-body>
            </b-card>
        </b-col>
    </b-row>
    <b-modal id="history-modal" title="Acitivy Logs" hide-footer>
        <b-list-group>
            <b-list-group-item v-for="(item, index) in histories" :key="index">
                <div class="d-flex">
                    <div class="h3 mb-0" style="width: 40px; height: 40px">
                        <q-icon icon="bx:history"/>
                    </div>
                    <div class="w-100">
                        <div><b>{{ item.updated_by.fullname }}</b> change <b>{{ parseHistoryActionName(item.action) }}</b> to {{ parseHistoryActionValues(item.action, item.action_values) }}</div>
                        <div class="text-muted small">{{ getTimeDuration(item.created_at) }}</div>
                    </div>
                </div>
            </b-list-group-item>
            <b-list-group-item href="javascript:;" active v-if="historyPage < historyLastPage" @click="fetchHistories(historyPage + 1)" :disabled="historyLoading">
                <div class="text-center" v-if="!historyLoading">
                    View More
                </div>
                <div class="text-center" v-else>
                    Loading...
                </div>
            </b-list-group-item>
        </b-list-group>
    </b-modal>
</div>
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
            historyLoading: false,
            isSubmitting: false,
            show_all: false,
            statuses: [
                {label: 'To Do', value: 'to_do'},
                {label: 'In Progress', value: 'inprogess'},
                {label: 'Pending', value: 'pending'},
                {label: 'Done', value: 'done'},
            ],
            comments: [],
            commentData: {
                content: '',
                issue_id: null
            },
            formData: {
                cod: 1,
                created_at: null,
                created_by: {},
                project_id: null,
                name: '',
                content: '',
                files: [],
                assigned_customers: [],
                labels: [],
                start_date: null,
                end_date: null,
                point: 1,
                teams: [],
                status: 'to_do'
            },
            histories: [],
            historyPage: 1,
            historyLastPage: 1,
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
            listComments() {
                if(this.show_all) {
                    return this.comments
                }

                return this.comments.filter(x => x.is_solved == 0)
            },
            listCommentsSolved() {
                return this.comments.filter(x => x.is_solved == 1)
            }
        },

        async mounted() {
            if(this.issue) {
                this.initIssue()            
            }

            await this.fetchComments()
            this.fetchHistories(1)
        },

        methods: {
            initCommentJs() {
                document.querySelectorAll('.issue-content').forEach(elem => {
                    if(elem.getAttribute('data-issue-initialized') != true) {
                        elem.addEventListener('click', async (e) => {
                            if (e.target.matches('ul.task-list > li')) {
                                e.target.classList.toggle('checked');

                                const comment_id = elem.getAttribute('data-comment-id')
                                await this.updateComment(comment_id, elem.innerHTML)
                            }
                        });   
                        elem.setAttribute('data-issue-initialized', 'true')
                    }
                })
            },
            
            async fetchComments() {
                try {
                    const { data } = await this.$http.get('issues_comments', {params: {
                        issue_id: this.$route.params.issue_id
                    }})

                    if(!data.error) {
                        this.comments = data.data
                        this.$nextTick(() => {
                            this.initCommentJs()
                        })
                    }
                } catch (err) {
                    console.log(err)
                }
            },
            
            async fetchHistories(page = 1) {
                try {
                    this.historyLoading = true
                    const { data } = await this.$http.get('issues_histories', {params: {
                        page,
                        per_page: 5
                    }})

                    if(!data.error) {
                        if(page == 1) {
                            this.histories = []
                        }

                        this.histories = this.histories.concat(data.data.data)
                        this.historyPage = page
                        this.historyLastPage = data.data.last_page 
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    this.historyLoading = false
                }
            },

            async updateComment(id, content) {
                try {
                    await this.$http.put('issues_comments/' + id, {content})
                } catch (err) {
                    console.log(err)
                }
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
                    'files',
                    'created_at',
                    'created_by',
                    'cod'
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
                            default:
                                this.formData[key] = this.issue[key]
                        }
                    }
                })         
                
                this.commentData.issue_id = this.$route.params.issue_id
            },

            async quickUpdate(key, data) {
                try {
                    const formData = {},
                          id = this.$route.params.issue_id

                    formData[key] = data
                    await this.$http.post('issues/update_data/' + id, formData)
                } catch (err) {
                    console.log(err)
                } finally {
                    await this.fetchHistories(1)
                }
            },            

            async onChange(valid, key, val) {
                if(valid) {
                    if(['labels', 'teams'].includes(key) && val.length > 0) {
                        await this.quickUpdate(key, val)
                    } else if(key == 'assigned_customers') {
                        await this.quickUpdate(key, val)
                    } else {
                        await this.quickUpdate(key, val)
                    }
                }
            },

            async handleCreateComment(reset) {
                try {
                    this.isSubmitting = true
                    const { data } = await this.$http.post('issues_comments', this.commentData)

                    if(!data.error) {
                        this.commentData.content = ''
                        reset()

                        this.$showAlert({
                            type: 'success',
                            title: 'Congratulations!',
                            message: "Sent new comment successfully."
                        })
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    this.isSubmitting = false
                    await this.fetchComments()
                }
            },

            async toggleConfirmComment(id) {
                try {
                    const cmt = this.comments.find(x => x.id == id)

                    if(cmt) {
                        const idx = this.comments.findIndex(x => x.id == id)
                        cmt.is_solved = 1
                        this.$set(this.comments, idx, cmt)
                        await this.$http.post('issues_comments/confirm/' + id)
                    }
                } catch (err) {
                    console.log(err)
                }
            },

            showLogsModal() {
                this.$bvModal.show('history-modal')
            },

            getTimeDuration(created_at) {
                return this.$mm(created_at).fromNow()
            },

            parseHistoryActionName(action) {
                return action.replace('_', ' ').toUpperCase()
            },

            parseHistoryActionValues(key, values) {
                if(['labels', 'teams'].includes(key) && Array.isArray(values)) {
                    return values.map(x => x.name).join(', ')
                }

                if(key == 'assigned_customers' && Array.isArray(values)) {
                    return values.map(x => x.username).join(', ')
                }

                if(Array.isArray(values)) {
                    return values.join(',')
                }

                return values
            }
        }
    }
</script>

<style lang="scss" scoped>
.avatar {
    width: 36px;
    height: 36px;
    overflow: hidden;
    position: relative;
    border-radius: 50%;
    border: 1px solid var(--light)
}

.card-issue {
    border-radius: 0;

    &:first-child {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    &:last-child {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        margin-bottom: 1rem;
        padding-top: 1.5rem;
        border-top: 0;
    }

    &:nth-child(n+2) {
        &:not(:last-child) {
            border-top: none;
            border-bottom: none;
        }
    }
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>