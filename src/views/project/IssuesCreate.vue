<template>
    <project-layout>
        <issue-form @submit="onSubmit" :loading="formLoading"/>
    </project-layout>
</template>

<script>
    import ProjectLayout from '@/components/project/Layout.vue'
    import IssueForm from '@/components/issue/Form.vue'

    export default {
        components: {ProjectLayout, IssueForm},
        data:() => ({
            formLoading: false
        }),

        methods: {
            async onSubmit({formData, refs}) {
                try {
                    this.formLoading = true
                    const { data } = await this.$http.post('issues', formData)

                    if(!data.error) {
                        this.$showAlert({
                            type: 'success',
                            title: 'Congratulations!',
                            message: 'Created new issue successfully!'
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