import $http from '@/axios'
import moment from 'moment'
import currencyFormatter from 'currency-formatter'

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
        }
    },

    methods: {
        $showAlert({type = 'success', message = '', title = '', timeout = 3000}) {
            const default_title = type == 'success' ? 'Successfully!' : 'Oops!'
            this.$root.$emit('SHOW_ALERT', type, message, title ? title : default_title, timeout)
        },

        $formatCurrency(amount, code = 'VND') {
            return currencyFormatter.format(amount, {code})
        }
    }
}


