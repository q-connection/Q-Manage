<template>
    <project-layout>
        <b-row>
            <b-col cols=12 xl=3 lg=3>
                <wiki-sidebar/>
            </b-col>
            <b-col cols=12 xl=9 lg=9>
                <spec-file-form :spec="spec" editing v-if="spec"/>
            </b-col>
        </b-row>
    </project-layout>
</template>

<script>
    import ProjectLayout from '@/components/project/Layout.vue'
    import WikiSidebar from '@/components/wiki/Sidebar.vue'
    import SpecFileForm from '@/components/wiki/SpecFileForm.vue'

    export default {
        components: {ProjectLayout, WikiSidebar, SpecFileForm},
        computed: {
            spec() {
                return this.$store.state.project.spec
            }
        },
        async mounted() {
            await this.fetchSpec()
        },
        methods: {
            async fetchSpec() {
                const { spec_id = null } = this.$route.params
                
                if(!spec_id) {
                    this.$router.push({name: 'projetc-wiki-spec-files', params: {id: this.$route.params.id}})
                    return
                }

                if(this.spec) {
                    return
                }

                try {
                    const { data } = await this.$http.get('project_specs/' + spec_id)

                    if(!data.error) {
                        if(data.data.disabled) {
                            this.$toast.error('Selected spec is disabled for edit.')
                            this.$router.push({name: 'project-wiki-spec-files'})

                            return
                        }

                        this.$store.commit('project/SET_SPEC', data.data)
                    }
                } catch (err) {
                    console.log(err)
                }
            },

            submitComment() {

            }
        }        
    }
</script>

<style lang="scss" scoped>

</style>