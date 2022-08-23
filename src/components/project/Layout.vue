<template>
<div>
    <project-tabs style="margin-top: 2rem"/>
    <div class="mt-4 mb-5">
        <div class="h5 px-3 pb-1" v-if="selectedProject.name">Project: <span class="text-primary">{{ selectedProject.name || '' }}</span></div>
        <b-container fluid>
            <slot/>
        </b-container>
    </div>
</div>
</template>

<script>
    import ProjectTabs from '@/components/project/Tabs.vue'

    export default {
        name: 'ProjectLayout',
        components: {ProjectTabs},
        computed: {
            selectedProject() {
                return this.$store.state.selected_project || {}
            }
        },
        async mounted() {
            await this.$store.dispatch('fetchProject', this.$route.params.id)
        }
    }
</script>

<style lang="scss" scoped>

</style>