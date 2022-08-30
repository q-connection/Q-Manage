<template>
    <b-list-group class="page-sidebar">
        <b-list-group-item :to="{name: 'project-wiki-spec-files'}" :active="$route.name.indexOf('spec-files') !== -1">
            <div class="d-flex align-items-center">
                <div class="h3 mb-0" style="line-height: 1; width: 36px">
                    <q-icon icon="material-symbols:type-specimen-outline"/>
                </div>
                <div>Spec file</div>
            </div>
        </b-list-group-item>
        <b-list-group-item  :to="{name: 'project-wiki-designs'}" :active="$route.name.indexOf('designs') !== -1">
            <div class="d-flex align-items-center">
                <div class="h3 mb-0" style="line-height: 1; width: 36px">
                    <q-icon icon="ic:outline-design-services"/>
                </div>
                <div>Design</div>
            </div>
        </b-list-group-item>
        <b-list-group-item  :to="{name: 'project-wiki-localization'}" :active="$route.name.indexOf('localization') !== -1">
            <div class="d-flex align-items-center">
                <div class="h3 mb-0" style="line-height: 1; width: 36px">
                    <q-icon icon="cil:language"/>
                </div>
                <div>Localization string</div>
            </div>
        </b-list-group-item>
    </b-list-group>
</template>

<script>
    export default {
        name: 'WikiSidebar',
    }
</script>