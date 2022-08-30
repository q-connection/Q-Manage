<template>
    <project-layout>
        <issue-form 
            @submit="onSubmit" 
            :loading="formLoading"
            :issue="issue"
            editing
        />
    </project-layout>
</template>

<script>
    import ProjectLayout from '@/components/project/Layout.vue'
    import IssueForm from '@/components/issue/Form.vue'

    export default {
        components: {ProjectLayout, IssueForm},
        data:() => ({
            formLoading: false,
            issue: null
        }),

        async mounted() {
            if(!this.$route.params.issue_id) {
                this.$router.push({name: 'project-issues'})

                return
            }

            await this.fetchIssue()
        },

        methods: {
            async fetchIssue() {
                const result = await this.$store.dispatch('project/fetchIssue', this.$route.params.issue_id)

                if(!result) {
                    this.$router.push({name: 'not_found'})

                    return
                }

                this.issue = this.$store.state.project.issue
                if(this.$user.super_user != 1 && this.issue.created_by.id != this.$user.id) {
                    this.$showAlert({
                        type: 'danger',
                        title: 'Oops',
                        message: "You are not author of this issue."
                    })

                    this.$router.push({name: 'project-issues'})

                    return
                }

                if(this.issue.status == 'done') {
                    this.$showAlert({
                        type: 'danger',
                        title: 'Oops',
                        message: "This issue is done"
                    })

                    this.$router.push({name: 'project-issues'})

                    return                            
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
                        this.$store.commit('project/SET_ISSUE', this.issue)

                        this.$router.push({
                            name: 'project-issues-detail', 
                            params: {id: this.issue.project_id, issue_id: this.issue.id}
                        })                        
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

</style>