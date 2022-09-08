<template>
    <div class="hrm-tabs" style="margin-top: 0; padding: 0 0 0 0">
        <b-tabs>
            <template #tabs-end>
                <b-nav-item :to="{name: 'hrm-employees'}" role="presentation" :active="isRouteActivated('employee')">Employees</b-nav-item>
                <b-nav-item :to="{name: 'hrm-announcements'}" role="presentation" :active="isRouteActivated('announcement')">Announcements</b-nav-item>
                <b-nav-item :to="{name: 'hrm-policies'}" role="presentation" :active="isRouteActivated('policies')">Policies</b-nav-item>
                <b-nav-item :to="{name: 'hrm-leave-days'}" role="presentation" :active="isRouteActivated('leave-days')">Leave Days</b-nav-item>
                <b-nav-item :to="{name: 'hrm-timekeeping'}" role="presentation" :active="isRouteActivated('timekeeping')">Timekeeping</b-nav-item>
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