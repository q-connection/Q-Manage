<template>
    <div class="daily-report">
        <b-modal id="modal-daily-report" hide-header hide-footer size="xl">
            <div class="p-2">
                <modal-custom-header title="DAILY REPORT" modal-id="modal-daily-report" />
                <validation-observer ref="profileForm" v-slot="{ handleSubmit }">
                    <b-form @submit.prevent="handleSubmit(onSubmitIssue)">
                        <!-- <validation-provider tag="div" class="col-12" rules="required" name="report list"
                            ref="report_list" v-slot="{ errors, valid }"> -->
                        <div class="mb-3">
                            <div for="preview" class="h5 pb-1">Report List</div>

                        </div>
                        <b-select2 v-model="issue_id" placeholder="Search Options" :options="select_issues"
                            :filter-by="issueFilter" :closeOnSelect="false">
                            <template v-slot:option="option">
                                <slot name="option-data" class="option-data" v-bind="option">
                                    <ListIssue :issue="option" @addIssue="addIssue" />
                                </slot>
                            </template>
                        </b-select2>
                        <!-- <input type="hidden" v-model="report_list" :state="$isValid(errors, valid)"/>
                            <div class="text-danger text-center mt-1 small">
                                {{ errors[0] }}
                            </div> -->
                        <!-- </validation-provider> -->
                        <div v-for="(item) in report_list" :key="item.status-item.id">
                            <FormIssue :issue="item" @removeIssue="removeIssue" @changeIssue="changeIssue"
                                v-on:load="refreshIssue" @refreshIssue="refreshIssue" :isRefresh="isRefresh" />
                        </div>

                        <div class="d-flex justify-content-end mt-3">
                            <form-button :block="$device.mobile" type="submit" variant="primary"
                                :disabled="isSubmitting || user.today_check_out_at" :loading="isSubmitting"
                                loading-without-hidden-text>
                                SUBMIT
                            </form-button>
                        </div>
                    </b-form>
                </validation-observer>
            </div>
        </b-modal>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import ListIssue from './ListIssue.vue';

export default {
    name: "DailReport",
    async mounted() {
        await this.fetchIssues();
        if (this.user.today_check_out_at) {
            this.fetchReportList()
        }
    },
    watch: {
        item: {
            reportList(val) {
                // do stuff
                console.log(val)
            },
            deep: true
        }
    },
    methods: {
        async fetchIssues() {
            try {
                const { data } = await this.$http.get("issues?process=true");
                if (!data.error) {
                    this.issues = this.$lodash.cloneDeep(data.data.data.filter((el) => {
                        return el !== null && typeof el !== 'undefined';
                    }));
                    this.select_issues = this.$lodash.cloneDeep(data.data.data.filter((el) => {
                        return el !== null && typeof el !== 'undefined';
                    }))
                }
            }
            catch (err) {
                console.log(err);
            }
        },
        async fetchReportList() {
            try {
                const { data } = await this.$http.get("daily_reports?order=now", {
                    'order': 'now'
                });
                if (!data.error) {
                    this.report_list = this.$lodash.cloneDeep(data.data.data);
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
            let issueIndex = this.report_list.findIndex((c) => issue.id == c.id)
            this.report_list[issueIndex][issue.type] = issue.value
            // this.report_list = issueC
        },
        refreshIssue(id) {
            let issueIndex = this.report_list.findIndex((c) => id == c.id)
            let issueOriginIndex = this.issues.findIndex((c) => id == c.id)
            this.report_list[issueIndex] = this.$lodash.clone(this.issues[issueOriginIndex])
            this.report_list = this.$lodash.cloneDeep(this.report_list)
        },
        async onSubmitIssue() {
            if (this.report_list.length == 0) {
                this.onCheckOut()
                return
            }

            try {
                this.isSubmitting = true
                let projects = this.report_list.map(function (obj) {
                    return obj.projects.id;
                });
                let issues = this.report_list.map(function (obj) {
                    return obj.id;
                });
                let process = this.report_list.map(function (obj) {
                    return obj.process;
                });
                let status = this.report_list.map(function (obj) {
                    return obj.status;
                });
                let payload = {
                    'projects': projects,
                    'issues': issues,
                    'processes': process,
                    'status': status
                }
                const { data } = await this.$http.post('daily_reports', payload)

                if (!data.error) {
                    this.issue_id = ''

                } else {
                    this.$showAlert({ type: 'danger', message: data.message })
                }
            } catch (err) {
                console.log(err)

                if (err.response.data) {
                    this.$showAlert({ type: 'danger', message: err.response.data.message })
                }
            } finally {
                await this.onCheckOut()
            }
        },
        async onCheckOut() {
            this.isSubmitting = false
            try {
                this.$bvModal.show('modal-daily-report');
                this.isLoggingTime = true
                const { data } = await this.$http.post('log-time/checkout/' + this.user.last_checkin_id)

                if (!data.error) {
                    this.$showAlert({ type: 'success', message: 'Checkout successfully' })
                    await this.$store.dispatch('fetchUser')
                } else {
                    this.$showAlert({ type: 'danger', message: data.message })
                }
            } catch (err) {
                console.log(err)
                this.$showAlert({ type: 'danger', message: err.response.data.message })
            } finally {
                this.isLoggingTime = false
            }
        }
    },
    data: () => ({
        issues: [],
        select_issues: [],
        report_list: [],
        issue_id: '',
        isSubmitting: false,
        isRefresh: false,
        issueFilter: (option, label, search) => {
            let temp = search.toLowerCase();

            return option.name.toLowerCase().indexOf(temp) > -1 ||
                option.status.toLowerCase().indexOf(temp) > -1 ||
                option?.projects.name.toLowerCase().indexOf(temp) > -1;
        },
        queryParams: {
            "process": true
        }
    }),
    computed: {
        ...mapState({
            user: state => state.user || {}
        }),
    },
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
