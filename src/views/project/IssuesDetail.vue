<template>
    <project-layout>
        <transition name="fade">
            <issue-detail 
                @submit="onSubmit" 
                :loading="formLoading"
                :issue="issue"
                editing
                v-if="issue"
            />
        </transition>
    </project-layout>
</template>

<script>
    import ProjectLayout from '@/components/project/Layout.vue'
    import IssueDetail from '@/components/issue/Detail.vue'

    export default {
        components: {ProjectLayout, IssueDetail},
        data:() => ({
            formLoading: false,
            issue: null
        }),

        mounted() {
            if(!this.$route.params.issue_id) {
                this.$router.push({name: 'project-issues'})

                return
            }

            this.fetchIssue()
        },

        methods: {
            async fetchIssue() {
                try {
                    const { data } = await this.$http.get('issues/' + this.$route.params.issue_id)

                    if(!data.error) {
                        this.issue = data.data

                        if(this.$user.super_user != 1 && this.issue.created_by.id != this.$user.id) {
                            this.$showAlert({
                                type: 'danger',
                                title: 'Oops',
                                message: "You are not author of this issue."
                            })

                            this.$router.push({name: 'project-issues'})
                        }
                    }
                } catch (err) {
                    console.log(err)

                    this.$router.push({name: 'project-issues'})
                }
            },

            async onSubmit({formData, refs}) {
                try {
                    this.formLoading = true
                    const { data } = await this.$http.post('issues/' + this.issue.id, formData)

                    if(!data.error) {
                        this.$showAlert({
                            type: 'success',
                            title: 'Congratulations!',
                            message: 'Updated issue successfully!'
                        })

                        this.issue = data.data
                    }
                } catch (err) {
                    console.log(err)

                    if(err.response && err.response.status == 422) {
                        this.$parseResponseErrors(refs, err.response.data.data)
                    }

                    if(err.response && err.response.status != 422) {
                        this.$showAlert({
                            type: 'danger',
                            title: 'Oops!',
                            message: err.response.data.message
                        })
                    }
                } finally {
                    this.formLoading = false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>