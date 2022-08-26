import $http from '@/axios'

export default {
    namespaced: true,
    
    state: () => ({
        projects: [],
        issues: [],
        issue: null
    }),

    getters: {
        getProjectById: (state) => (id) => {
            return state.projects.find(x => x.id == id)
        },

        getIssueById: (state) => (issue_id) => {
            return state.issues.find(x => x.id == issue_id)
        },
    },

    mutations: {
        SET_PROJECTS(state, data) {
            state.projects = data
        },

        SET_ISSUES(state, data) {
            state.issues = data
        },

        SET_ISSUE(state, data) {
            state.issue = data
        }
    },

    actions: {
        async fetchIssue({commit, state}, id, force = false) {
            if(!force && state.issue && state.issue.id == id) {
                return true
            }

            try {
                const { data } = await $http.get(`issues/${id}`)

                if(!data.error) {
                    commit('SET_ISSUE', data.data)

                    return true
                } else {
                    return false
                }
            } catch (err) {
                console.log(err)

                return false
            }
        }
    }
}