<template>
    <div class="hrm-tabs">
        <b-tabs>
            <template #tabs-end>
                <b-nav-item :to="{name: 'hrm-employees'}" role="presentation" :active="isRouteActivated('employee')">Employees</b-nav-item>
                <b-nav-item :to="{name: 'hrm-announcements'}" role="presentation" :active="isRouteActivated('announcement')">Announcements</b-nav-item>
                <b-nav-item :to="{name: 'hrm-policies'}" role="presentation" :active="isRouteActivated('policies')">Policies</b-nav-item>
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