<template>
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <hrm-tabs/>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import HrmTabs from '@/components/mobile/HrmTabs.vue'
    export default {
        components: { HrmTabs },
        name: 'HrmAnnouncements'
    }
</script>

<style lang="scss" scoped>

</style>