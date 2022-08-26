<template>
    <div>
        <div class="issue-item">
            <div class="issue-item--name font-weight-bold">
                {{ issue?.name }}
            </div>
            <div class="issue-item--project-name">
                <b-button variant="primary">
                    {{ issue?.projects?.name }}
                </b-button>
            </div>
            <div class="issue-item--status">
                <b-select2 v-model="issue_status" :options="issue_statuses" :reduce="pj => pj.value" :clearable="false"
                    style="min-width: 160px;min-height: 45px;" placeholder="Issue status" />
            </div>

            <div class="mr-2 issue-item--number">
                <b-input-group style="border-right: 0px;max-width: 160px;" required>
                    <template #append>
                        <b-input-group-text>%</b-input-group-text>
                    </template>
                    <b-form-input 
                        min="0" 
                        max="100" 
                        type="number" 
                        v-model.number="process" 
                        @input="checkProcess"
                    >
                    </b-form-input>
                </b-input-group>
            </div>
            <div class="issue-item--refresh" @click="rotation" :class="{ clicked }">
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
        issue_status: '',
        clicked: false,
        tableConfig: {
            url: 'issues',
            params: {
                status: ''
            }
        },
    }),
    props: {
        issue: {
            default: {
                process: 0,
                status: 'to_do'
            }
        },
    },
    mounted() {
        this.issue_status = this.issue.status
    },
    computed: {
        status: {
            get() {
                return this.issue_status
            },

            set(val) {
                this.$emit('changeIssue', { 'id': this.issue.id, 'type': 'status', 'value': val })
                this.issue_status = val
            }
        },
        issue_statuses() {
            return [
                { label: 'To Do', value: 'to_do' },
                { label: 'In Progress', value: 'inprogress' },
                { label: 'Pending', value: 'pending' }
            ]
        }
    },
    watch: {
        issue_status(val) {
            if (val == 'done') this.process = 100
            this.$emit('changeIssue', { 'id': this.issue.id, 'type': 'status', 'value': val })
        }
    },
    methods: {
        rotation() {
            this.$emit('refreshIssue',this.issue.id)
            this.clicked = !this.clicked
        },
        

        checkProcess(val) {            
            if(parseInt(val) >= 0 && parseInt(val) <= 100) {
                this.$emit('changeIssue', { 'id': this.issue.id, 'type': 'process', 'value': parseInt(val) })

                return true
            }

            return false
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
    flex-wrap: wrap;
    margin-bottom: .5rem;

    .issue-item--name {
        min-width: 40%;
    }

    .issue-item--project-name {
        margin-right: .5rem;
    }

    .issue-item--status {
        margin-right: .5rem;
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

    .issue-item--refresh {
        cursor: pointer;
        margin-right: 1.25rem;

        &.clicked {
            transform: rotate(360deg);
            transition: transform 0.5s ease-in-out;
        }
    }
}

.description {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: inherit;
}

@media screen and (max-width: 992px) {
    .issue-item {
        .issue-item--name {
            width: 100%;
            margin-bottom: .75rem
        }

        .issue-item--project-name {
            width: 100%;
            margin-bottom: .75rem;
            margin-right: 0;

            .btn {
                width: 100%;
            }
        }

        .issue-item--refresh {
            margin-right: 0;
        }
    }
}
</style>