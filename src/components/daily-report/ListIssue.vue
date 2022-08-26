<template>
    <div>
        <div class="issue-item" @click="$emit('addIssue', issue.id)">
            <div class="issue-item--title mb-1">
                <span class="font-weight-bold d-flex align-items-center">{{ issue.name }}</span>
            </div>
            <div class="issue-item--description mb-2">
                <span class="text-muted font-weight-500 mr-2">
                    Project Name:
                </span>
                <span class="text-dark-yellow font-weight-bold">
                    {{ issue?.projects?.name }}
                </span>
            </div>
            <div class="issue-item--description mb-2">
                <span class="text-muted font-weight-500">
                    Status:
                </span>
                <span class="text-dark-yellow font-weight-bold" :style={color:this.getStatus(issue?.status)?.color}>
                    {{ this.getStatus(issue?.status)?.label }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TableIssues',
    data: () => ({
        issue_types: [],
        list_status: [
            { label: 'To Do', value: 'to_do', color: '#FC0000' },
            { label: 'In Progress', value: 'inprogress', color: '#3A74D4' },
            { label: 'Pending', value: 'pending', color: '#F0B01D' },
            { label: 'Done', value: 'done', color: '#197130' },
        ],
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
        addIssue: {
            default: () => { }
        }
    },
    methods: {
        getStatus(value) {
            return this.list_status.find(p => p.value == value)
        }
    },
}
</script>

<style lang="scss" scoped>
.issue-item {
    border-bottom: 1px solid #E0E0E0;
    position: relative;
    padding: .7rem;

    .text-dark-yellow {
        color: #D08900;
    }
}

.description {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
}
</style>