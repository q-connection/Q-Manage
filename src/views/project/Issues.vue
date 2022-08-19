<template>
    <project-layout>
        <div class="issues-header">
            <div class="issues-header--actions">
                <form-button class="p-2" :to="{name: 'project-issues-create'}" variant="outline-primary" size="sm">
                    Create
                </form-button>
                <form-button 
                    class="p-2 ml-3" @click="fetchIssues()" 
                    variant="outline-danger" 
                    size="sm" 
                    :loading="isLoading" 
                    :disabled="isLoading"
                    loading-without-hidden-text
                >
                    <span slot="icon" class="h5 mb-0" style="line-height: 1">
                        <q-icon icon="bx:refresh"/>
                    </span>
                    Refresh
                </form-button>
                <b-form-checkbox class="ml-3" value="show_all" unchecked-value="assigne" v-model="queryParams.order">
                    Show all
                </b-form-checkbox>
            </div>
            <div class="issues-header--search">
                <form-input-group class="d-none d-xl-block d-lg-block search-form">
                    <b-form-input style="min-width: 285px; min-height: 40px" placeholder="Search..." v-model.lazy="queryParams.search"></b-form-input>
                    <template #append>
                        <span class="h3">
                            <q-icon icon="bx:search-alt"/>
                        </span>
                    </template>
                </form-input-group>                
            </div>
        </div>
        <div class="issues-filter">
            <div class="d-flex mb-1" v-if="filtering.team">
                <div class="mr-2">Team:</div>
                <div class="text-primary font-weight-bold mr-2">{{ filtering.team.name }}</div>
                <div class="text-danger text-cursor h5 mb-0" style="line-height: 1" @click="removeFilter('team')">
                    <q-icon icon="codicon:close"/>
                </div>
            </div>
            <div class="d-flex mb-1" v-if="filtering.label">
                <div class="mr-2">Label:</div>
                <div class="font-weight-bold mr-2">
                    <span class="px-3 py-1 text-white" :style="{backgroundColor: filtering.label.color, borderRadius: '10px', fontSize: '10px'}">
                        {{ filtering.label.name }}
                    </span>
                </div>
                <div class="text-danger text-cursor h5 mb-0" style="line-height: 1" @click="removeFilter('label')">
                    <q-icon icon="codicon:close"/>
                </div>
            </div>
            <div class="d-flex mb-1" v-if="filtering.assigned">
                <div class="mr-2">Assigned:</div>
                <div class="text-primary font-weight-bold mr-2">{{ filtering.assigned.fullname }}</div>
                <div class="text-danger text-cursor h5 mb-0" style="line-height: 1" @click="removeFilter('assigned')">
                    <q-icon icon="codicon:close"/>
                </div>
            </div>
        </div>
        <div class="issues-content">
            <b-row>
                <b-col cols=12 xl=3 lg=3 v-for="(status, index) in statuses" :key="index">
                    <div class="issues-content--table">
                        <div class="issues-content--table__content shadow-sm">
                            <div class="head">
                                <div class="head-title">{{ status.label }} ({{ getIssuesByStatus(status.name).length }})</div>
                                <div class="head-toolbar">
                                    <span class="icon">
                                        <q-icon icon="fluent:more-circle-20-regular"/>
                                    </span>
                                </div>
                            </div>
                            <draggable 
                                class="body"
                                :value="getIssuesByStatus(status.name)" 
                                @change="onPositionChange($event, status.name)"
                                v-bind="dragOptions"
                            >
                                <div class="issue-item" v-for="(issue, issue_idx) in getIssuesByStatus(status.name)" :key="issue_idx">
                                    <div class="issue-content-left">
                                        <div class="issue-title">[{{ issue.id }}] {{ issue.name }}</div>
                                        <div class="issue-team">
                                            <span  v-for="(team, index) in issue.teams" :key="index">
                                                <a href="javascript:;" class="text-primary" @click="onFilter(team, 'team')">
                                                    {{ team.name }}
                                                </a>
                                                <span v-if="index < issue.teams.length -1">, </span>
                                            </span>
                                        </div>
                                        <div class="issue-date">
                                            {{ $mm(issue.created_at).format('LLL') }} by <a href="javascript:;" @click="onFilter(issue.user, 'assigned')">{{ issue.user.fullname || 'N/A' }}</a>
                                        </div>
                                    </div>
                                    <div class="issue-content-right">
                                        <div 
                                            class="issue-badge text-cursor" 
                                            :style="{backgroundColor: firstLabel(issue.labels).color, color: '#fff'}"
                                            @click="onFilter(firstLabel(issue.labels), 'label')"
                                        >
                                            {{ firstLabel(issue.labels).name }}
                                        </div>
                                        <div class="issue-members">
                                            <img-lazy-load 
                                                class="member-avatar"
                                                :src="member.avatar_url"
                                                error="/images/avatar-placeholder.png"
                                                v-for="(member, member_idx) in splitAssginees(issue.assignes)" 
                                                :key="member_idx"
                                            />
                                            <div class="member-avatar" v-if="issue.assignes.length > 2">
                                                <div class="text-center text-primary mt-1 small">
                                                    +{{ issue.assignes.length - 2 }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </draggable>
                        </div>
                    </div>
                </b-col>
            </b-row>
        </div>
    </project-layout>
</template>

<script>
    import draggable from 'vuedraggable'
    import ProjectLayout from '@/components/project/Layout.vue'

    export default {
        name: 'ProjectIssues',
        components: {ProjectLayout, draggable},
        data: () => ({
            timer: null,
            isLoading: false,
            issues: [],
            filtering: {
                label: null,
                team: null,
                assigned: null,
            },
            statuses: [
                {label: 'To do', name: 'to_do', total_issues: 0},
                {label: 'In progress', name: 'inprogess', total_issues: 0},
                {label: 'Pending', name: 'pending', total_issues: 0},
                {label: 'Done', name: 'done', total_issues: 0}
            ],
            queryParams: {
                order: 'assigne',
                search: '',
                label_id: '',
                team_id: '',
                assigned_id: ''
            }
        }),

        watch: {
            async 'queryParams.order'() {
                await this.fetchIssues()
            },
            async 'queryParams.label_id'() {
                await this.fetchIssues()
            },
            async 'queryParams.team_id'() {
                await this.fetchIssues()
            },
            async 'queryParams.assigned_id'() {
                await this.fetchIssues()
            },

            'queryParams.search'() {
                clearTimeout(this.timer)
                this.timer = setTimeout(async () => {
                    await this.fetchIssues()
                }, 750)
            }
        },

        computed: {
            toDoIssues() {
                const issues = this.issues.length > 0 ? this.issues.filter(x => x.status == 'to_do') : []

                return this.$lodash.sortBy(issues, x => x.order)
            },
            inProgressIssues() {
                const issues = this.issues.length > 0 ? this.issues.filter(x => x.status == 'inprogess') : []

                return this.$lodash.sortBy(issues, x => x.order)
            },
            pendingIssues() {
                const issues = this.issues.length > 0 ? this.issues.filter(x => x.status == 'pending') : []

                return this.$lodash.sortBy(issues, x => x.order)
            },
            doneIssues() {
                const issues = this.issues.length > 0 ? this.issues.filter(x => x.status == 'done') : []

                return this.$lodash.sortBy(issues, x => x.order)
            },
            dragOptions() {
                return {
                    animation: 200,
                    group: "issue",
                    disabled: false,
                    ghostClass: "ghost"
                };
            }            
        },

        async mounted() {
            await this.fetchIssues()
        },

        methods: {
            async fetchIssues() {
                try {
                    this.isLoading = true
                    const project_id = this.$route.params.id
                    const params     = this.queryParams
                    const { data } = await this.$http.get(`projects/issue/${project_id}`, {params})

                    if(!data.error) {
                        this.issues = data.data.issues
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    this.isLoading = false
                }
            },
    
            getIssuesByStatus(status) {
                let issues = []

                switch(status) {
                    case 'to_do':
                        issues = this.toDoIssues
                    break;
                    case 'inprogess':
                        issues = this.inProgressIssues
                    break;
                    case 'pending':
                        issues = this.pendingIssues
                    break;
                    case 'done':
                        issues = this.doneIssues
                    break;
                }

                return issues
            },

            async updateOrder(id, order) {
                try {
                    await this.$http.put('issues/update_order/' + id, {order})
                } catch (err) {
                    console.log(err)
                }
            },

            async updateStatus(id, status) {
                try {
                    await this.$http.put('issues/update_status/' + id, {status})
                } catch (err) {
                    console.log(err)
                }
            },

            async onPositionChange(event, status) {
                if(event.added) {
                    const obj = event.added.element
                    const idx  = this.issues.findIndex(x => x.id == obj.id)

                    if(idx !== -1) {
                        obj.status = status
                        this.$set(this.issues, idx, obj)
                        await this.updateStatus(obj.id, status)
                    }
                }

                if(event.moved) {
                    const obj = event.moved.element
                    const oldObj = this.getIssuesByStatus(status)[event.moved.newIndex]
                    
                    const objIdx = this.issues.findIndex(x => x.id == obj.id)
                    const objOldIdx = this.issues.findIndex(x => x.id == oldObj.id)
                    console.log(obj, oldObj)
                    if(objIdx !== -1 && objOldIdx !== -1) {
                        obj.order = event.moved.newIndex
                        oldObj.order = event.moved.oldIndex

                        this.$set(this.issues, objIdx, obj)
                        this.$set(this.issues, objOldIdx, oldObj)

                        await this.updateOrder(obj.id, event.moved.newIndex)
                        await this.updateOrder(oldObj.id, event.moved.oldIndex)                        
                    }
                }
            },

            firstLabel(labels) {
                const first = labels[0] || {
                    name: 'N/A',
                    color: '#333333'
                }

                return first
            },

            parseTeams(teams) {
                return teams.length > 0 ? teams.map(x => x.name).join(', ') : 'All'
            },

            splitAssginees(list) {
                if(list.length <= 2) {
                    return list
                }

                return this.$lodash.chunk(list, 2)[0]
            },

            onFilter(item, type) {
                this.filtering[type] = item
                this.queryParams[`${type}_id`] = item.id
            },

            removeFilter(type) {
                this.filtering[type] = null
                this.queryParams[`${type}_id`] = ''
            }
        }
    }
</script>

<style lang="scss" scoped>
$header: issues-header;
$content: issues-content;

.#{$header} {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .75rem;

    .#{$header}--actions {
        display: flex;
        align-items: end;
    }
}

.#{issues-content} {
    .#{issues-content}--table {
        padding: 8px;
        background-color: #fff;

        &:first-child {
            padding-left: 0;
        }

        &:last-child {
            padding-right: 0;
        }

        .#{issues-content}--table__content {
            .head {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border: 1px solid #E0E0E0;
                padding: .5rem;

                .head-title {
                    font-weight: 600;
                    color: #373737;
                }

                .head-toolbar {
                    .icon {
                        font-size: 22px;
                        line-height: 0;
                        cursor: pointer;
                    }
                }
            }

            .body {
                padding: .75rem;
                border: 1px solid #F5F5F5;
                border-top: 0;
                min-height: 110px;

                .issue-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    border-radius: 10px;
                    background-color: #F5F5F5;
                    padding: .5rem;
                    // box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 8%);
                    border: 1px solid #E0E0E0;
                    margin-bottom: .5rem;

                    &:hover {
                        background-color: #F1F1F1;
                    }

                    &:last-child {
                        margin-bottom: 0;
                    }

                    .issue-content-left {
                        .issue-title {
                            font-weight: 600;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2                           
                            // margin-bottom: .25rem;
                        }

                        .issue-team {
                            font-size: 10px;
                            font-weight: 600;
                            color: var(--primary)
                        }

                        .issue-date {
                            font-size: 10px;
                            font-weight: 600;
                            color: var(--gray)
                        }
                    }

                    .issue-content-right {
                        display: flex;
                        flex-direction: column;
                        -ms-flex-direction: column;
                        align-items: flex-end;
                        padding-left: .35rem;

                        .issue-badge {
                            min-width: 48px;
                            border-radius: 10px;
                            background-color: var(--gray);
                            text-align: center;
                            font-size: 10px;
                            font-weight: 600;
                            padding: 2px 6px;

                            &.task {
                                background-color: var(--success);
                                color: #fff
                            }

                            &.bug, &.hot_fix {
                                background-color: var(--danger);
                                color: #fff                                
                            }
                        }   

                        .issue-members {
                            display: flex;
                            align-items: center;
                            margin-top: .25rem;
                            position: relative;

                            .member-avatar {
                                width: 28px;
                                height: 28px;
                                border: 1px solid #F0B01D;
                                position: relative;
                                overflow: hidden;
                                border-radius: 100%;
                                margin-right: 2px;
                                
                                img {
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>