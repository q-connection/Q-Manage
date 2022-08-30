<template>
    <b-navbar type="dark" variant="primary" sticky>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="navbar-left">
                <b-nav-item :to="{name: 'dashboard'}">Dashboard</b-nav-item>
                <b-nav-item-dropdown 
                    ref="projectDropdown" 
                    class="project-dropdown" 
                    no-caret
                >
                    <template #button-content>
                        <div @mouseenter="projectDropdownHovered">
                            <router-link 
                                :to="{name: 'projects'}" 
                                class="text-white text-decoration-none"
                            >
                                Projects
                            </router-link>
                        </div>
                    </template>
                    <b-dropdown-form class="project-names" href="javascript:;" active>
                        <div 
                            class="project-title" 
                            :class="{active: selectedProject == project.id}" 
                            v-for="(project, index) in projects" 
                            :key="index"
                            @click="selectedProject = project.id"
                        >
                            {{ project.name }}
                        </div>
                    </b-dropdown-form>
                    <b-dropdown-form>
                        <b-icon class="mr-1" icon="search" variant="dark"/>
                        <b-input placeholder="Search issue name..." v-model="issueParams.search"/>
                    </b-dropdown-form>
                    <b-dropdown-item :to="{name: 'project-issues', params: {id: issue.project_id}, query: {issue_id: issue.id}}" v-for="(issue, index) in projectIssues" :key="index">
                        <b-icon class="mr-1" icon="record-circle" variant="primary"/>
                        <span class="task-title">[{{ issue.labels[0] ? issue.labels[0].name : 'N/A' }}] {{ issue.name }}</span>
                    </b-dropdown-item>
                    <b-dropdown-item href="#" v-if="issues.length <= 0">
                        <span class="task-title">No issue found.</span>
                    </b-dropdown-item>
                </b-nav-item-dropdown>
                <!-- <b-nav-item-dropdown 
                    ref="recentlyDropdown" 
                    class="project-dropdown" 
                    no-caret
                >
                    <template #button-content>
                        <div @mouseenter="recentlyDropdownHovered">
                            Recently Viewed
                        </div>
                    </template>
                    <b-dropdown-form class="project-names" active>
                        <div 
                            class="project-title" 
                            :class="{active: selectedRecentlyProject == project.id}" 
                            v-for="(project, index) in projects" 
                            :key="index"
                            @click="selectedRecentlyProject = project.id"
                        >
                            {{ project.name }}
                        </div>
                    </b-dropdown-form>
                    <b-dropdown-form>
                        <b-icon class="mr-1" icon="search" variant="dark"/>
                        <b-input placeholder="Search recently issue name..." v-model="issueRecentlyParams.search"/>
                    </b-dropdown-form>
                    <b-dropdown-item :to="{name: 'project-issues', params: {id: issue.project_id}, query: {issue_id: issue.id}}" v-for="(issue, index) in recentlyIssues" :key="index">
                        <b-icon class="mr-1" icon="record-circle" variant="primary"/>
                        <span class="task-title">[{{ issue.labels[0] ? issue.labels[0].name : 'N/A' }}] {{ issue.name }}</span>
                    </b-dropdown-item>
                    <b-dropdown-item href="#" v-if="issues.length <= 0">
                        <span class="task-title">No issue found.</span>
                    </b-dropdown-item>
                </b-nav-item-dropdown> -->
                <b-nav-item 
                    v-if="$hasPermission('hrm.index') && $hasPermission('employee.index')" 
                    :to="{name: 'hrm-employees'}"
                    :class="{'router-link-exact-active': inHrmRoutes === true}"
                >
                    HRM
                </b-nav-item>
                <b-nav-item href="#">
                    <span class="h2">
                        <q-icon icon="bxs:message-square-add"/>
                    </span>
                </b-nav-item>
                <b-nav-form>
                    <div class="attendance-wrapper">
                        <b-form-input :value="currentTime" readonly></b-form-input>
                        <form-button variant="primary" v-if="user.today_check_in_at && !user.today_check_out_at" @click="onCheckout" :disabled="isLoggingTime" :loading="isLoggingTime" size="sm">Check Out</form-button>
                        <form-button variant="primary" v-else @click="onCheckin" :disabled="isLoggingTime" :loading="isLoggingTime" size="sm">Check In</form-button>
                    </div>
                </b-nav-form>                
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown 
                    ref="notificationDropdown" 
                    class="notification-dropdown" 
                    no-caret
                >
                    <template #button-content>
                        <span class="h3">
                            <q-icon icon="clarity:bell-solid"/>
                        </span>   
                    </template>
                    <b-dropdown-form class="noti-names" href="javascript:;" active>
                        <div 
                            class="noti-title" 
                            :class="{active: notification.selected == type.value}" 
                            v-for="(type, index) in notification.types" 
                            :key="index"
                            @click="notification.selected = type.value"
                        >
                            {{ type.name }}
                        </div>
                    </b-dropdown-form>                    
                    <b-dropdown-item href="#" v-for="(noti, index) in notification.items" :key="index">
                        <b-icon class="mr-1" icon="record-circle" variant="primary"/>
                        <span class="task-title">
                            <span class="text-primary">[{{ noti.project?.name }}]</span> 
                            {{ noti.title }}
                        </span>
                    </b-dropdown-item>
                    <b-dropdown-item href="#" v-if="issues.length <= 0">
                        <span class="task-title">No notifications found.</span>
                    </b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item href="#">
                    <span class="h3">
                        <q-icon icon="ant-design:question-circle-filled"/>
                    </span>                    
                </b-nav-item>

                <b-nav-item-dropdown class="account-dropdown" right>
                    <template #button-content>
                        <span class="h3 text-white">
                            <q-icon icon="carbon:user-avatar-filled"/>
                        </span>
                    </template>
                    <b-dropdown-item class="account-name" href="javascript:;" active>
                        {{ user.fullname }}
                    </b-dropdown-item>
                    <b-dropdown-item :to="{name: 'profile'}">
                        <span><q-icon icon="bxs:user-rectangle"/>Profile</span>
                    </b-dropdown-item>
                    <!-- <b-dropdown-item :to="{name: 'secutiry'}">
                        <span><q-icon icon="teenyicons:password-solid"/>Security</span>
                    </b-dropdown-item> -->
                    <b-dropdown-item :to="{name: 'announcements'}">
                        <span><q-icon icon="zondicons:announcement"/>Announcements</span>
                    </b-dropdown-item>
                    <b-dropdown-item :to="{name: 'policies'}">
                        <span><q-icon icon="ic:baseline-policy"/>Policies</span>
                    </b-dropdown-item>
                    <b-dropdown-item :to="{name: 'leave-days'}">
                        <span><q-icon icon="ic:baseline-work-history"/>Leave Days</span>
                    </b-dropdown-item>
                    <b-dropdown-item @click="onLogout">
                        <span><q-icon icon="ri:logout-circle-r-fill"/>Sign Out</span>
                    </b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "DesktopNavbar",
    data: () => ({
        issueTimer: null,
        clock: null,
        isLoggingTime: false,
        selectedProject: '',
        selectedRecentlyProject: '',
        issues: [],
        projects: [],
        currentTime: '',
        issueParams: {
            search: ''
        },
        issueRecentlyParams: {
            search: ''
        },
        notification: {
            items: [],
            types: [
                {name: 'Projects', value: 'projects'},
                {name: 'Others', value: 'others'},
            ],
            selected: 'projects'
        }
    }),

    computed: {
        ...mapState({
            user: state => state.user || {}
        }),

        inHrmRoutes() {
            return this.$route.name.indexOf('hrm') !== -1
        },

        projectIssues() {
            const project = this.projects.find(x => x.id == this.selectedProject)
            const issues  = project ? project.issues : []

            if(!this.issueParams.search) {
                return issues
            }

            return issues.filter(x => x.name.indexOf(this.issueParams.search) !== -1)
        },

        recentlyIssues() {
            const project = this.projects.find(x => x.id == this.selectedRecentlyProject)
            const issues  = project ? project.issues : []

            if(!this.issueRecentlyParams.search) {
                return issues
            }

            return issues.filter(x => x.name.indexOf(this.issueRecentlyParams.search) !== -1)
        }
    },

    watch: {
        'issueParams.search'() {
            clearTimeout(this.issueTimer)
            this.issueTimer = setTimeout(async () => {
                this.fetchIssues()
            }, 750)
        }
    },

    async mounted() {
        this.currentTime = this.$mm().format('LLL')
        this.clock = setInterval(() => {
            this.currentTime = this.$mm().format('LLL')            
        }, 1000)

        await this.fetchProjects()
    },

    methods: {
        async onLogout() {
            this.$store.commit('SET_IDLE_LOADING', true)
            await this.$store.dispatch('logout')
        },

        async onCheckin() {
            try {
                this.isLoggingTime = true
                const { data } = await this.$http.post('log-time/checkin')

                if(!data.error) {
                    this.$showAlert({type: 'success', message: 'Checkin successfully'})
                    await this.$store.dispatch('fetchUser', true)
                } else {
                    this.$showAlert({type: 'danger', message: data.message})
                }
            } catch (err) {
                console.log(err)
                this.$showAlert({type: 'danger', message: err.response.data.message})
            } finally {
                this.isLoggingTime = false
            }
        },

        async onCheckout() {
            this.$bvModal.show('modal-daily-report'); 
        },

        async fetchProjects()
        {
            try {
                const { data } = await this.$http.get('projects/all-for-select')

                if(!data.error) {
                    this.projects = data.data

                    if(this.projects.length > 0) {
                        this.selectedProject = this.projects[0].id
                        this.selectedRecentlyProject = this.projects[0].id
                    }
                }
            } catch (err) {
                console.log(err)
            }
        },

        projectDropdownHovered() {
            if(this.projects.length > 0) {
                this.$refs.projectDropdown.show()
            }
        },

        projectDropdownBlur() {
            this.$refs.projectDropdown.hide(true)
        },

        recentlyDropdownHovered() {
            if(this.projects.length > 0) {
                this.$refs.recentlyDropdown.show()
            }
        },

        recentlyDropdownBlur() {
            this.$refs.recentlyDropdown.hide(true)
        },
    },

    beforeDestroy() {
        clearInterval(this.clock)
    }
};
</script>

<style lang="scss" scoped>
.attendance-wrapper {
    position: relative;
    
    .form-control {
        width: 370px;
        border: 0;
        min-height: 36px;

        &:disabled, &[readonly] {        
            background-color: #fff;
        }
    }

    .btn {
        position: absolute;
        top: 50%;
        right: 4px;
        transform: translateY(-50%);
        border-radius: 8px;
        color: #fff;
        padding: .20rem .5rem;
        min-width: auto;
        font-size: 16px;
        height: auto;

        &:hover {
            outline: none;
        }
    }
}

.router-link-exact-active {
    font-weight: bold;
}
</style>
