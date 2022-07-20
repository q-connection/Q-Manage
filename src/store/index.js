import Vue from 'vue'
import Vuex from 'vuex'
import $http from '@/axios'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null,
        idleLoading: false
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
        }
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
    },
    modules: {
    }
})
