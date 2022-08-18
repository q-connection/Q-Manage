<template>
    <div class="project-tabs">
        <b-tabs>
            <template #tabs-end>
                <b-nav-item :to="{name: 'project-issues'}" role="presentation" :active="isRouteActivated('issues')">
                    <q-icon icon="codicon:target"/>
                    Issues
                </b-nav-item>
                <b-nav-item :to="{name: 'project-wiki'}" role="presentation" :active="isRouteActivated('wiki')">
                    <q-icon icon="bi:book"/>
                    Wiki
                </b-nav-item>
                <b-nav-item :to="{name: 'project-setting'}" role="presentation" :active="isRouteActivated('setting')">
                    <q-icon icon="ep:setting"/>
                    Settings
                </b-nav-item>
            </template>
        </b-tabs>
    </div>
</template>

<script>
    export default {
        name: 'ProjectTabs',
        methods: {
            isRouteActivated(name) {
                return this.$route.name.indexOf(`project-${name}`) !== -1
            }
        }        
    }
</script>