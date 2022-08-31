import $http from '@/axios'

export default {
    namespaced: true,
    
    state: () => ({
        detail: null,
        issue: null,
        document: null,
        spec: null
    }),

    mutations: {
        SET_DETAIL(state, data) {
            state.detail = data
        },

        SET_ISSUE(state, data) {
            state.issue = data
        },

        SET_DOCUMENT(state, data) {
            state.document = data
        },

        SET_SPEC(state, data) {
            state.spec = data
        },
    },

    actions: {
        async fetchProject({commit, state}, id, force = false) {
            if(!force && state.detail && state.detail.id == id) {
                return true
            }

            try {
                const { data } = await $http.get(`projects/${id}`)

                if(!data.error) {
                    commit('SET_DETAIL', data.data)

                    return true
                } else {
                    return false
                }
            } catch (err) {
                console.log(err)

                return false
            }
        },
        
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
        },
    }
}