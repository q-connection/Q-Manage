import $http from '@/axios'
import moment from 'moment'
import currencyFormatter from 'currency-formatter'
import lodash from 'lodash'

export default {
    computed: {
        $http() {
            return $http
        },

        $mm() {
            moment.locale('en')
            return moment
        },

        $user() {
            return this.$store.state.user || {}
        },

        $userPermissions() {
            return this.$user.permissions
        },

        $lodash() {
            return lodash
        }
    },

    methods: {
        $showAlert({type = 'success', message = '', title = '', timeout = 3000, callback = null}) {
            const default_title = type == 'success' ? 'Successfully!' : 'Oops!'
            this.$root.$emit('SHOW_ALERT', type, message, title ? title : default_title, timeout, callback)
        },

        $formatCurrency(amount, code = 'VND') {
            return currencyFormatter.format(amount, {code})
        },

        $hasPermission(name) {
            const permissions = this.$userPermissions || {}

            return permissions[name] || false
        },

        $isValid(errors, valid) {
            return errors[0] ? false : (valid ? true : null)
        },

        $parseResponseErrors(refs, errors) {
            Object.keys(errors).forEach(key => {
                if(refs[key] && typeof refs[key].setErrors === "function") {
                    refs[key].setErrors([errors[key]])
                }
            })
        },

        $objToFormData(obj) {
            let formData = new FormData()
            const keys = Object.keys(obj)

            for(let i = 0; i < keys.length; i++) {
                if(obj[keys[i]]) {
                    formData.append(keys[i], obj[keys[i]])
                }
            }

            return formData
        }
    }
}


