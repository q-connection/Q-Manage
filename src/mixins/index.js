import $http from '@/axios'
import moment from 'moment'
import currencyFormatter from 'currency-formatter'
import lodash from 'lodash'

export default {
    components: {},
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
        },
        $layout() {
            let device = this.$device.mobile ? "mobile" : "desktop";
            let innerWidth = window.innerWidth;
            
            if (device == 'desktop' && innerWidth < 1200) {
                device = 'mobile'
            }

            if (device == 'mobile' && innerWidth >= 1200) {
                device = 'desktop'
            }

            return device;
        },
        inHrmRoutes() {
            return this.$route.name.indexOf('hrm') !== -1
        }        
    },

    methods: {
        $showAlert({type = 'success', message = '', title = '', timeout = 3000, callback = null, require_password = false, icon = null, alert_width = '360px'}) {
            const default_title = type == 'success' ? 'Successfully!' : 'Oops!'
            this.$root.$emit('SHOW_ALERT', type, message, title ? title : default_title, timeout, callback, require_password, icon, alert_width)
        },

        $formatCurrency(amount, code = 'VND') {
            return currencyFormatter.format(amount, {code})
        },

        $hasPermission(name) {
            if(this.$user.super_user === 1 || this.$user.super_user === true) {
                return true
            }

            const permissions = this.$userPermissions || {}

            return permissions[name] || false
        },
        
        // eslint-disable-next-line
        $isValid(errors, valid) {
            return errors[0] ? false : null
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
                    if(Array.isArray(obj[keys[i]])) {
                        obj[keys[i]].forEach((item, index) => {
                            if(item instanceof File) {
                                formData.append(`${keys[i]}[${index}]`, item)
                            } else if(this.$lodash.isObject(item)) {
                                Object.keys(item).forEach(objKey => {
                                    formData.append(`${keys[i]}[${index}][${objKey}]`, item[objKey])
                                })
                            } else {
                                formData.append(`${keys[i]}[${index}]`, item)
                            }
                        })
                    } else {
                        formData.append(keys[i], obj[keys[i]])
                    }
                }
            }

            return formData
        },

        $parseFileName(file) {
            if(file instanceof File) {
                return file.name
            } else {
                const arr = file.toString().split('/')

                return arr[arr.length - 1]
            }
        },

        $redirectTo(name, params, resolveBeforeRedirect = null) {
            if(typeof resolveReforeRedirect == 'function') {
                resolveBeforeRedirect({name, params})
            }

            this.$router.push({name, params})
        }        
    }
}


