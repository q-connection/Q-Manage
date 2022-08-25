<template>
    <div class="daily-report">
        <b-modal id="modal-daily-report" hide-header hide-footer size="xl">
            <div class="p-2">
                <modal-custom-header title="DAILY REPORT" modal-id="modal-daily-report" />
                <b-form @submit.prevent="handleSubmit(onSubmit)">

                    <b-select2 v-model="issue_id" placeholder="Search Options" :options="select_issues"
                        :filter-by="issueFilter" :closeOnSelect="false">
                        <template v-slot:option="option">
                            <slot name="option-data" class="option-data" v-bind="option">
                                <ListIssue :issue="option" @addIssue="addIssue" />
                            </slot>
                        </template>
                    </b-select2>
                    <div v-for="(item, index) in report_list" :key="index">
                        <FormIssue :issue="item" @removeIssue="removeIssue" @changeIssue="changeIssue" />
                    </div>

                    <div class="d-flex justify-content-end mt-3">
                        <form-button :block="$device.mobile" type="submit" variant="primary" :disabled="isSubmitting"
                            :loading="isSubmitting" loading-without-hidden-text>
                            SUBMIT
                        </form-button>
                    </div>

                </b-form>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import ListIssue from './ListIssue.vue';

export default {
    name: "DailReport",
    computed: {
        ...mapState({
            user: state => state.user || {}
        })
    },
    async mounted() {
        await this.fetchIssues();
    },
    methods: {
        async fetchIssues() {
            const params = Object.assign({}, this.queryParams);
            try {
                this.isSubmitting = true;
                const { data } = await this.$http.get("issues", params);
                if (!data.error) {
                    this.issues = data.data.data;
                    this.select_issues = this.issues
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        addIssue(id) {
            this.report_list.push(this.select_issues.find((c) => id == c.id))
            this.select_issues = this.select_issues.filter(function (c) {
                return id != c.id
            });
        },
        removeIssue(id) {
            this.select_issues.push(this.report_list.find((c) => id == c.id))
            this.report_list = this.report_list.filter(function (c) {
                return id != c.id
            });
        },
        changeIssue(issue) {
            console.log('issue',issue)
            let issueC = this.report_list.find((c) => issue.id == c.id)
            issueC[issue.type] =issue.value
            this.report_list =issueC
            console.log(' this.report_list', this.report_list)
        },
        async onSubmit() {
            try {
                this.isSubmitting = true
                const { data } = await this.$http.post('daily_reports', this.changePwData)

                if (!data.error) {
                    this.$showAlert({ type: 'success', message: "Change password successfully!" })

                    this.issues = []
                    this.select_issues = []
                    this.report_list = []
                    this.issue_id = 0
                    this.$refs.changePwForm.reset()
                } else {
                    this.$showAlert({ type: 'danger', message: data.message })
                }
            } catch (err) {
                console.log(err)

                if (err.response.data) {
                    this.$showAlert({ type: 'danger', message: err.response.data.message })
                }
            } finally {
                this.isSubmitting = false
            }
        },
    },
    data: () => ({
        issues: [],
        select_issues: [],
        report_list: [],
        issue_id: 0,
        issueFilter: (option, label, search) => {
            let temp = search.toLowerCase();
            return option.name.toLowerCase().indexOf(temp) > -1 ||
                option.name.toLowerCase().indexOf(temp) > -1;
        },
        queryParams: {
            "process": true
        }
    }),
    components: { ListIssue }
}
</script>
<style lang="scss" scoped>
.option-data {
    --vs-dropdown-min-width: 100%;
    --vs-dropdown-option-padding: 13px 210px;
    --vs-search-input-placeholder-color: red;
    --vs-dropdown-option--active-bg: red;
    --vs-dropdown-option--active-color: red;
}
</style>
