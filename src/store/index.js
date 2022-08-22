import Vue from 'vue'
import Vuex from 'vuex'
import $http from '@/axios'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null,
        idleLoading: false,
        employees: [],
        labels: [],
        teams: []
    },
    getters: {
        userInfo: state => state.user
    },
    mutations: {
        SET_USER(state, data) {
            state.user = data
        },

        SET_IDLE_LOADING(state, data) {
            state.idleLoading = data
        },

        SET_EMPLOYEES(state, data) {
            state.employees = data
        },

        SET_LABELS(state, data) {
            state.labels = data
        },

        SET_TEAMS(state, data) {
            state.teams = data
        },
    },
    actions: {
        async login({commit}, {username, password, remember}) {
            let is_success = false

            try {
                const { data } = await $http.post('employee/login', {username, password, remember})

                if(!data.error) {
                    commit('SET_USER', data.data.user)
                    localStorage.setItem('access_token', data.data.token)
                    is_success = true
                }
            } catch (err) {
                console.log(err)
            }

            return is_success
        },

        async fetchUser({commit}) {
            let is_loggedin = false

            try {
                const { data } = await $http.get('employee/info')

                if(!data.error) {
                    commit('SET_USER', data.data)
                    is_loggedin = true
                } else {
                    commit('SET_USER', null)
                    localStorage.removeItem("access_token")
                }
            } catch (err) {
                console.log(err)
                commit('SET_USER', null)
                localStorage.removeItem("access_token")
            }

            return is_loggedin
        },

        async logout({commit}) {
            try {
                await $http.get('employee/logout')
            } catch (err) {
                console.log(err)
            } finally {
                commit('SET_USER', null)
                localStorage.removeItem("access_token")
                router.push({name: 'login'})           
            }
        },
        
        // eslint-disable-next-line
        async forgot({commit}, formData) {
            let data = {}

            try {
                const resp = await $http.post('otp/send', formData)
                data = resp.data
            } catch (err) {
                if(err.response.data) {
                    data = err.response.data
                }

                console.log(err)
            }

            return data
        },

        // eslint-disable-next-line
        async resetPassword({commit}, formData) {
            let data = {}

            try {
                const resp = await $http.post('otp/reset-password', formData)
                data = resp.data
            } catch (err) {
                if(err.response.data) {
                    data = err.response.data
                }

                console.log(err)
            }

            return data
        },

        checkPermission({state}, permission) {
            let has_permission = false
            const permissions = state.user ? state.user.permissions : {}
            if(permissions[permission]) {
                has_permission = true
            }

            return has_permission
        },

        async fetchBasicData({commit}) {
            try {
                const customerResp = await $http.get('employee/list-customer')

                $http.get('issues_labels')
                .then((resp) => {
                    if(!resp.data.error) {
                        commit('SET_LABELS', resp.data.data)
                    }
                })

                $http.get('issues_teams')
                .then((resp) => {
                    if(!resp.data.error) {
                        commit('SET_TEAMS', resp.data.data)
                    }                    
                })

                if(!customerResp.data.error) {
                    commit('SET_EMPLOYEES', customerResp.data.data)
                }
            } catch (err) {
                console.log(err)
            }
        },
        
        async fetchLabels({commit}) {
            try {
                const { data } = await $http.get('issues_labels')

                if(!data.error) {
                    commit('SET_LABELS', data.data)
                }
            } catch (err) {
                console.log(err)
            }
        },
        
        async fetchTeams({commit}) {
            try {
                const { data } = await $http.get('issues_teams')

                if(!data.error) {
                    commit('SET_TEAMS', data.data)
                }
            } catch (err) {
                console.log(err)
            }
        },
    },
    modules: {
    }
})
