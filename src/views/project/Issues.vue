<template>
    <project-layout>
        <div class="issues-header">
            <div class="issues-header--actions">
                <b-button class="p-2" :to="{name: 'project-issues-create'}" variant="outline-primary" size="sm">
                    Create
                </b-button>
                <b-form-checkbox class="ml-3" v-model="queryParams.show_all">
                    Show all
                </b-form-checkbox>
            </div>
            <div class="issues-header--search">
                <form-input-group class="d-none d-xl-block d-lg-block search-form">
                    <b-form-input style="min-width: 285px; min-height: 40px" placeholder="Search..." v-model.lazy="queryParams.search"></b-form-input>
                    <template #append>
                        <span class="h3">
                            <q-icon icon="bx:search-alt"/>
                        </span>
                    </template>
                </form-input-group>                
            </div>
        </div>
    </project-layout>
</template>

<script>
    import ProjectLayout from '@/components/project/Layout.vue'

    export default {
        name: 'ProjectIssues',
        components: {ProjectLayout},
        data: () => ({
            queryParams: {
                show_all: false,
                search: ''
            }
        })
    }
</script>

<style lang="scss" scoped>
$header: issues-header;

.#{$header} {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .75rem;

    .#{$header}--actions {
        display: flex;
        align-items: end;
    }
}
</style>