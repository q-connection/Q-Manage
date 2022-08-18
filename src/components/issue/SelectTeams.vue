<template>
    <div class="labels-wrapper" v-click-outside="hide">
        <div class="toolbar" @click="show">
            <div class="title label-required">Teams</div>
            <div class="icon">
                <q-icon icon="ep:setting"></q-icon>
            </div>
        </div>
        <div class="labels-users no-padding no-cursor no-hover d-flex flex-wrap">
            <div 
                class="labels-users--item"
                v-for="(label, index) in labelsSelected" 
                :key="index" 
            >
                <div class="left" :class="label.class">
                    {{ label.label }}
                </div>
            </div>
            <div class="text-danger small my-1">{{error}}</div>
        </div>
        <div class="labels-dropdown" v-show="isDropdown">
            <div>
                <div class="px-3 pt-3 pb-2 mb-1">
                    <b-form-input v-model="search" placeholder="Type or chooose a label"/>
                </div>                
                <div class="labels-users pb-4">
                    <div v-show="labelsSelected.length > 0">
                        <div class="d-flex justify-content-end py-1 px-3">
                            <div class="text-cursor" @click="$emit('input', [])">
                                <span>Clear All</span>
                                <span class="text-danger h5 m-0 p-0">
                                    <q-icon icon="codicon:close"/>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div 
                        class="labels-users--item"
                        v-for="(label, index) in labelsFiltered" 
                        :key="index" 
                        @click="onClick(label.name)"
                        :class="{active: value.includes(label.name)}" 
                    >
                        <div class="left" :class="label.class">
                            {{ label.label }}
                        </div>
                        <div class="right">
                            <span class="success" v-if="!value.includes(label.name)">
                                <q-icon icon="akar-icons:plus"/>
                            </span>
                            <span class="danger" v-else>
                                <q-icon icon="codicon:close"/>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ClickOutside from 'vue-click-outside'

    export default {
        directives: {ClickOutside},
        props: {
            value: {
                type: Array,
                default: () => ([])
            },

            error: String
        },
        data: () => ({
            isDropdown: false,
            search: '',
            labels: [
                {name: 'frontend', label: "Frontend", class: 'text-primary'},
                {name: 'backend', label: "Backend", class: 'text-primary'},
                {name: 'mobile', label: "Mobile", class: 'text-primary'},
                {name: 'tester', label: "Tester", class: 'text-primary'}
            ],
        }),
        computed: {
            labelsFiltered() {
                if(!this.search) {
                    return this.labels
                }

                return this.labels.filter(x => {
                    if(x.label.indexOf(this.search) !== -1) {
                        return true
                    }
                    
                    return false
                })
            },

            labelsSelected() {
                return this.labels.filter(x => this.value.includes(x.name))
            }
        },
        methods: {
            onClick(id) {
                let users = this.value || [];
                const idx = users.findIndex(x => x == id)

                if(idx !== -1) {
                    this.$delete(users, idx)
                } else {
                    users.push(id)
                }

                this.$emit('input', users)
            },

            hide() {
                if(this.isDropdown) {
                    this.isDropdown = false
                }
            },

            show() {
                this.isDropdown = !this.isDropdown
            }
        }
    }
</script>

<style lang="scss" scoped>
.labels-wrapper {
    margin-bottom: .5rem;
    padding-bottom: .5rem;
    border-bottom: 1px solid #f5f5f5;
    position: relative;

    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        cursor: pointer;

        .title {
            font-weight: 600;
            line-height: 1.5;
        }

        .icon {
            font-size: 18px
        }
    }

    .labels-dropdown {
        top: 2rem;
        left: 0;
        width: 100%;
        height: 300px;
        position: absolute;
        border: 1px solid #f5f5f5;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 8%);
        overflow: hidden;
        z-index: 1
    }

    .labels-users {
        max-height: 250px;
        overflow-y: auto;

        .labels-users--item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 36px;
            padding: 1rem;
            cursor: pointer;

            .left {
                padding: .15rem .25rem;
                border-radius: 10px;
                font-weight: 700;
            }

            .right {
                font-size: 20px;
                line-height: 0;

                .success {
                    color: var(--success)
                }

                .danger {
                    color: var(--danger)
                }
            }

            &:hover {
                background-color: var(--light);
            }

            &.active {
                background-color: #f5f5f5;                  
            }
        }

        &.no-padding {
            .labels-users--item {
                padding: 0 .5rem;

                &:first-child {
                    padding-left: 0;

                    .left {
                        padding-left: 0;
                    }
                }

                &:last-child {
                    padding-right: 0;

                    .left {
                        padding-right: 0;
                    }                    
                }
            }
        }

        &.no-cursor {
            .labels-users--item {
                cursor: auto;
            }
        }

        &.no-hover {
            .labels-users--item:hover {
                background-color: transparent;
            }
        }
    }    
}
</style>