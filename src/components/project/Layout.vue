<template>
<div>
    <project-tabs style="margin-top: 2rem"/>
    <div class="mt-4 mb-5">
        <div class="h5 px-3 pb-1" v-if="project">Project: <span class="text-primary">{{ project.name || '' }}</span></div>
        <b-container fluid v-if="project">
            <transition-group name="fade" appear>
                <div key="project-content">
                    <slot/>
                </div>
            </transition-group>
        </b-container>
    </div>
</div>
</template>

<script>
    import ProjectTabs from '@/components/project/Tabs.vue'
    import { mapState, mapActions } from 'vuex'

    export default {
        name: 'ProjectLayout',
        components: {ProjectTabs},
        computed: {
            ...mapState({
                project: state => state.project.detail
            })
        },
        methods: {
            ...mapActions({
                fetchProject: 'project/fetchProject'
            })
        },
        async mounted() {
            await this.fetchProject({id: this.$route.params.id})
        }
    }
</script>