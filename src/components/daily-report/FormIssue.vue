<template>
    <div>
        <div class="issue-item">
            <div class="issue-item--name font-weight-bold">
                {{ issue?.name }}
            </div>
            <div class="issue-item--project-name">
                {{ issue?.project?.name }}
            </div>
            <div class="issue-item--status">
                <b-select2 
                    v-model="issue_status" :options="issue_statuses" :reduce="pj => pj.value" 
                    :clearable="false"
                    style="min-width: 160px;min-height: 45px;" placeholder="Issue status" />
            </div>

            <div class="mr-2 issue-item--number">
                <b-input-group style="border-right: 0px;max-width: 160px;" required>
                    <template #append>
                        <b-input-group-text>%</b-input-group-text>
                    </template>
                    <input
                        min="1" 
                        max="100" 
                        type="tel" 
                        class="form-control"
                        v-model.number="process" 
                        @input="checkProcess"
                        @keyup="checkProcess"
                    >
                </b-input-group>
            </div>
            <div class="issue-item--refresh" @click="rotation" :class="{ spin: clicked }">
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
        process: 1,
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
                { label: 'In Progress', value: 'inprogess' },
                { label: 'Pending', value: 'pending' },
                { label: 'Done', value: 'done' },
            ]
        }
    },
    watch: {
        issue_status(val) {
            if (val == 'done') this.process = 100
            this.$emit('changeIssue', { 'id': this.issue.id, 'type': 'process', 'value': this.process })
        }
    },
    methods: {
        stopSpin() {
            this.clicked = false
        },

        rotation() {
            if(this.clicked) {
                return
            }

            this.$emit('refreshIssue',this.issue.id, this.stopSpin)
            this.clicked = true
        },
        

        checkProcess(e) {    
            if(e.keyCode) {
                const key = e.keyCode

                if(![8, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(key)) {
                    this.process = 1
                    this.$emit('changeIssue', { 'id': this.issue.id, 'type': 'process', 'value': 1 })

                    return
                }
            }

            const val = e.target.value

            if(val && parseInt(val) > 0 && parseInt(val) <= 100) {
                this.$emit('changeIssue', { 'id': this.issue.id, 'type': 'process', 'value': parseInt(val) })

                return
            }

            if(val && parseInt(val) > 100) {
                this.process = 100
                this.$emit('changeIssue', { 'id': this.issue.id, 'type': 'process', 'value': 100 })
            }
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
        font-weight: 700;
        font-size: 1rem;
        line-height: 2;
        min-height: 45px;
        border-radius: 10px;
        color: #fff;
        background-color: var(--primary);
        padding: 0.375rem 0.75rem
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

        &.spin {
            cursor: not-allowed;
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