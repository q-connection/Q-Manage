import $http from '@/axios'

export default {
    state: () => ({
        projects: [],
        issue: null
    }),

    getters: {
        getProjectById: (state) => (id) => {
            return state.projects.find(x => x.id == id)
        },

        getIssueInProject: (state) => (project_id, issue_id) => {
            const project = state.projects.find(x => x.id == project_id)

            if(!project) {
                return null
            }

            return project.issues.find(x => x.id == issue_id)
        },
    },

    mutations: {
        SET_ISSUE(state, data) {
            state.issue = data
        }
    },

    actions: {
        async fetchIssue({commit}, id) {
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