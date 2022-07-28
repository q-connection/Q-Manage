<template>
    <div class="hrm-tabs">
        <b-tabs>
            <template #tabs-end>
                <b-nav-item :to="{name: 'hrm-employees'}" role="presentation" :active="isRouteActivated('employee')">Employee</b-nav-item>
                <b-nav-item :to="{name: 'hrm-announcements'}" role="presentation" :active="isRouteActivated('announcement')">Announcements</b-nav-item>
                <b-nav-item :to="{name: 'hrm-departments'}" role="presentation" :active="isRouteActivated('department')">Departments</b-nav-item>
                <b-nav-item :to="{name: 'hrm-positions'}" role="presentation" :active="isRouteActivated('position')">Positions</b-nav-item>
            </template>
        </b-tabs>
    </div>
</template>

<script>
    export default {
        methods: {
            isRouteActivated(name) {
                return this.$route.name.indexOf(`hrm-${name}`) !== -1
            }
        }
    }
</script>