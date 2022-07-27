<template>
    <div class="hrm-tabs">
        <b-tabs>
            <template #tabs-end>
                <b-nav-item :to="{name: 'hrm-employees'}" role="presentation">Employee</b-nav-item>
                <b-nav-item :to="{name: 'hrm-announcements'}" role="presentation">Annoucements</b-nav-item>
                <b-nav-item :to="{name: 'hrm-departments'}" role="presentation">Departments</b-nav-item>
                <b-nav-item :to="{name: 'hrm-positions'}" role="presentation">Positions</b-nav-item>
            </template>
        </b-tabs>
    </div>
</template>

<script>
    export default {
        
    }
</script>