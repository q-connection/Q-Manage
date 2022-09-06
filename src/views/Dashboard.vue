<template>
<div class="page-content" :class="{hrm: inHrmRoutes === true}">
    <div class="container-fluid mb-5">
        <div class="row">
            <div class="col-12 col-xl-3 col-lg-2">
                <user-info-block  v-if="!$device.mobile"/>
                <user-notworking v-if="!$device.mobile"/>
                <notification-main class="mb-3" v-if="$device.mobile" />
            </div>
            <div class="col-12 col-xl-9 col-lg-10">
                <div class="project-wrapper">
                    <b-select2
                        :options="all_projects"
                        :reduce="pj => pj.id"
                        v-model="project_id"
                        label="name"
                        placeholder="Select project"
                        @input="onProjectChange"
                    >
                        <template #option="project">
                            <div class="project-item">
                                <img-lazy-load
                                    class="project-item--thumbnail shadow-sm"
                                    :src="project.thumbnail"
                                    error="/images/default-avatar.png"
                                />
                                <div class="project-item--body">
                                    <div class="project-item--body_title">{{ project.name }}</div>
                                    <div class="project-item--body_description">
                                        <div class="mr-2">Tasks: <span class="text-success font-weight-bold">{{ project.total_tasks || 0 }}</span></div>
                                        <div>Bugs: <span class="text-danger font-weight-bold">{{ project.total_bugs || 0 }}</span></div>
                                    </div>
                                    <div class="project-item--body_datetime" v-if="project.created_at">Created at {{ $mm(project.created_at).format('DD/MM/YYYY HH:mm:ss') }}</div>
                                </div>
                            </div>
                        </template>
                        <template #selected-option="project">
                            <div class="project-item selected">
                                <img-lazy-load
                                    class="project-item--thumbnail shadow-sm"
                                    :src="project.thumbnail"
                                    error="/images/default-avatar.png"
                                />
                                <div class="project-item--body">
                                    <div class="project-item--body_title">{{ project.name }}</div>
                                    <div class="project-item--body_description">
                                        <div class="mr-2">Tasks: <span class="text-success font-weight-bold">{{ project.total_tasks || 0 }}</span></div>
                                        <div>Bugs: <span class="text-danger font-weight-bold">{{ project.total_bugs || 0 }}</span></div>
                                    </div>
                                    <div class="project-item--body_datetime" v-if="project.created_at">Created at {{ $mm(project.created_at).format('DD/MM/YYYY HH:mm:ss') }}</div>
                                </div>
                            </div>
                        </template>
                    </b-select2>
                </div>
                <div class="row">
                    <div class="col-12">
                        <issues-table/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import IssuesTable from '@/components/issue/Table.vue'

export default {
    name: "DashboardPage",
    components: {IssuesTable},
    data: () => ({
        project_id: null,
        all_projects: [{
            id: '',
            name: 'All Project',
            thumbnail: '/images/default-avatar.png',
            total_tasks: 0,
            total_bugs: 0,            
        }]
    }),

    watch: {
        projects: {
            deep: true,
            handler(newval) {
                if(newval.length > 0) {
                    this.all_projects[0].total_tasks = newval.map(x => x.total_tasks || 0).reduce((prev, cur) => prev + cur, 0)
                    this.all_projects[0].total_bugs = newval.map(x => x.total_bugs || 0).reduce((prev, cur) => prev + cur, 0)
                    this.all_projects = this.all_projects.concat(newval)
                }
            }
        }
    },

    computed: {
        ...mapState({
            user: state => state.user || {},
            projects: state => state.project.all || []
        })
    },

    mounted() {
        this.project_id = ''
    },

    methods: {
        onProjectChange(val) {
            this.$emit('projectChanged', val)
        }
    }
}
</script>

<style lang="scss">
.project-wrapper {
    .vs__dropdown-option {
        padding: 0
    }
}

</style>
<style lang="scss" scoped>
.project-wrapper {
    .project-item {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        width: 100%;
        padding: .5rem;
        border-bottom: 1px solid #d5d5d5;
        cursor: pointer;

        &.selected {
            border: 0;
            padding: 0
        }

        .project-item--thumbnail {
            width: 55px;
            height: 55px;
            position: relative;
            overflow: hidden;
            border-radius: 50%;
            background-color: #fff;
        }

        .project-item--body {
            margin-left: 1rem;

            .project-item--body_title {
                font-weight: 600;
            }

            .project-item--body_description {
                display: flex;
            }

            .project-item--body_datetime {
                font-size: 12px;
            }
        }
    }
}
</style>