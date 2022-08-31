<template>
    <project-layout>
        <b-row>
            <b-col cols=12 xl=3 lg=3>
                <wiki-sidebar/>
            </b-col>
            <b-col cols=12 xl=9 lg=9>
                <document-form :document="document" editing/>
            </b-col>
        </b-row>
    </project-layout>
</template>

<script>
    import ProjectLayout from '@/components/project/Layout.vue'
    import WikiSidebar from '@/components/wiki/Sidebar.vue'
    import DocumentForm from '@/components/wiki/DocumentForm.vue'

    export default {
        components: {ProjectLayout, WikiSidebar, DocumentForm},
        
        computed: {
            document() {
                return this.$store.state.project.document
            }
        },
        
        async mounted() {
            await this.fetchDocument()
        },
        
        methods: {
            async fetchDocument() {
                const { doc_id = null } = this.$route.params

                if(!doc_id) {
                    this.$router.push({name: 'project-wiki-documents'})
                    return
                }

                try {
                    const { data } = await this.$http.get('project_documents/' + doc_id)

                    if(!data.error) {
                        this.$store.commit('project/SET_DOCUMENT', data.data)
                    }
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>