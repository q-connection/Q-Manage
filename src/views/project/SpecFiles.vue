<template>
    <project-layout>
        <b-row>
            <b-col cols=12 xl=3 lg=3>
                <wiki-sidebar/>
            </b-col>
            <b-col cols=12 xl=9 lg=9>
                <spec-file-table ref="table" @onCreateIssue="showCreateIssueModal"/>
            </b-col>
        </b-row>
        <b-modal id="create-issue-modal" size="xl" hide-header hide-footer>
            <modal-custom-header modal-id="create-issue-modal" title="Create Issue"/>
            <issue-form @submit="onSubmit" :loading="formLoading" :issue="issue"/>
        </b-modal>
    </project-layout>
</template>

<script>
    import ProjectLayout from '@/components/project/Layout.vue'
    import WikiSidebar from '@/components/wiki/Sidebar.vue'
    import SpecFileTable from '@/components/wiki/SpecFileTable.vue'
    import IssueForm from '@/components/issue/Form.vue'

    export default {
        name: 'SpecFilePage',
        components: {ProjectLayout, WikiSidebar, SpecFileTable, IssueForm},

        data:() => ({
            formLoading: false,
            spec: null,
            issue: null
        }),

        methods: {
            showCreateIssueModal(item) {
                const name    = `[Spec] [${item.version ? item.version.name : 'N/A'}] ${item.screen ? item.screen.name : 'Unknown'}`
                let content   = item.description

                if(item.design_urls && item.design_urls.length > 0) {
                    content += '<br/><ul>';
                    item.design_urls.forEach(design => {
                        content += `<li><span class="mr-2">${design.title}</span><a href="${design.url}">${design.url}</a></li>`
                    })
                    content += '</ul>';
                }

                this.spec = item
                this.issue = {
                    name,
                    content
                } 

                this.$bvModal.show('create-issue-modal')
            },

            async updateSpec(spec_id, issue_id) {
                try {
                    await this.$http.put(`project_specs/assign-issue/${spec_id}/${issue_id}`)
                } catch (err) {
                    console.log(err)
                }
            },            

            async onSubmit({formData, refs}) {
                try {
                    this.formLoading = true
                    const { data } = await this.$http.post('issues', formData)

                    if(!data.error) {
                        await this.updateSpec(this.spec.id, data.data.id)
                        this.$$bvModal.hide('create-issue-modal')
                        this.$showAlert({
                            type: 'success',
                            title: 'Congratulations!',
                            message: 'Created new issue successfully!'
                        })

                        this.$refs.table.fetchSpecs()
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