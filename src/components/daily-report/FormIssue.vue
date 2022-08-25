<template>
    <div>
        <div class="issue-item">
            <div class="issue-item--name font-weight-bold">
                {{ issue?.name }}
            </div>
            <div class="issue-item--project-name mr-2">
                <b-button variant="primary">
                    {{ issue?.projects.name }}
                </b-button>
            </div>
            <div class="issue-item--status mr-2">
                <b-select2 @change="$emit('changeIssue', { 'id': issue.id, 'type': 'status', 'value': this.status })"
                    v-model="status" :options="issue_statuses" :reduce="pj => pj.value"
                    style="min-width: 150px;min-height: 45px;" placeholder="Issue status" />
            </div>

            <div class="mr-2 issue-item--number">
                <b-input-group type="number" style="border-right: 0px;" value="issue.process" v-model="process"
                    @change="$emit('changeIssue', { 'id': this.issue.id, 'type': 'process', 'value': 100 })" required>
                    <template #append>
                        <b-input-group-text>%</b-input-group-text>
                    </template>
                    <b-form-input></b-form-input>
                </b-input-group>
            </div>
            <div class="issue-item--refresh mr-5">
                <q-icon icon="ri:refresh-fill" color="#197130" width="30" height="30" />
            </div>
            <div class="issue-item--delete" @click="$emit('removeIssue', issue.id)">
                <q-icon icon="mdi:delete-circle" color="#fc0000" width="30" height="30" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TableIssues',
    data: () => ({
        issue_types: [],
        process: 0,
        status: '',
        tableConfig: {
            url: 'issues',
            params: {
                status: ''
            }
        },
    }),
    props: {
        issue: {
            default: {}
        },
    },
    mounted() {
        console.log(this.issue.name)
    },
    computed: {
        issue_statuses() {
            return [
                { label: 'Pending', value: 'to_do' },
                { label: 'In Progress', value: 'inprogress' },
                { label: 'Pending', value: 'pending' },
                { label: 'Done', value: 'done' },
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.issue-item {
    border-bottom: 1px solid #E0E0E0;
    position: relative;
    padding: 0.7rem 0px 0.7rem;
    display: flex;
    align-items: center;

    .issue-item--name {
        min-width: 40%;
    }

    .issue-item--number {
        .form-control {
            border-right: 0px;
        }
    }

    .issue-item--delete {
        margin-left: auto;
        cursor: pointer;
    }

    --vs-dropdown-min-height: 350px;

    .v-select .vs__dropdown-toggle {
        min-height: 451px !important;
    }
}

.description {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
}
</style>