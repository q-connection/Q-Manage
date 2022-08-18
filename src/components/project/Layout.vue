<template>
<div>
    <project-tabs style="margin-top: 2rem"/>
    <div class="mt-4 mb-5">
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
        components: {ProjectTabs}

    }
</script>

<style lang="scss" scoped>

</style>