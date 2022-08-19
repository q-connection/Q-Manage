<template>
    <div class="options-wrapper" v-click-outside="hide">
        <div class="toolbar" @click="show">
            <div class="title" :class="{'label-required': required}">{{ label }}</div>
            <div class="icon">
                <q-icon icon="ep:setting"></q-icon>
            </div>
        </div>
        <div class="options-users no-padding no-cursor no-hover d-flex flex-wrap">
            <div 
                class="options-users--item"
                v-for="(opt, index) in optionSelected" 
                :key="index" 
            >
                <slot name="option-selected" v-bind="opt">
                    <div :class="opt.class || 'left'" :style="opt.style">
                        {{ opt.label }}
                    </div>
                </slot>
            </div>
            <div class="text-danger small my-1">{{error}}</div>
        </div>
        <div class="options-dropdown" v-show="isDropdown">
            <div class="options-dropdown--content">
                <div class="loading" v-show="loading">
                    <b-spinner variant="secondary"/>
                </div>
                <div v-show="!isCreating">
                    <div class="px-3 pt-3 pb-2 mb-1">
                        <b-form-input v-model="search" :placeholder="searchPlaceholder"/>
                    </div>                
                    <div class="options-users pb-4">
                        <div v-show="optionSelected.length > 0">
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
                            class="options-users--item"
                            v-for="(opt, index) in optionFiltered" 
                            :key="index" 
                            :class="{active: value.includes(opt.value)}" 
                        >
                            <div class="d-flex" @click="onClick(opt.value)">
                                <div class="pr-2">
                                    <div style="width: 16px">
                                        <span class="text-success h5 m-0 p-0" style="line-height: 0" v-show="value.includes(opt.value)">
                                            <q-icon icon="ant-design:check-outlined"/>
                                        </span>
                                    </div>
                                </div>
                                <slot name="option" v-bind="opt">
                                    <div :class="opt.class || 'left'" :style="opt.style">
                                        {{ opt.label }}
                                    </div>
                                </slot>
                            </div>
                            <div class="right" v-show="$hasPermission('issues.label.destroy') && config.server_side">
                                <span class="danger" @click="onDelete(opt.value)">
                                    <q-icon icon="bi:trash-fill"/>
                                </span>
                            </div>
                        </div>
                        <div class="text-center text-muted p-1" v-show="optionFiltered.length <= 0 && !search && !$hasPermission('issues.label.create')">
                            No option to show.
                        </div>                    
                        <div class="text-center text-muted p-1" v-show="optionFiltered.length <= 0 && !search && $hasPermission('issues.label.create')">
                            No option to show. Enter to create a new one!
                        </div>                    
                        <div class="text-center text-cursor text-muted p-1" v-show="optionFiltered.length <= 0 && search && $hasPermission('issues.label.create')" @click="isCreating = true">
                            <u>Create new option "<b>{{ search }}</b>" ?</u>
                        </div>         
                    </div>
                </div>
                <div class="pb-2" v-show="isCreating">
                    <slot name="creation" v-bind="{reset, search}"/>
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

            config: {
                type: Object,
                default: () => ({
                    server_side: false,
                    endpoint: null,
                    params: {},
                    resolveData: null,
                    allow_creation: false
                })
            },

            items: {
                type: Array,
                default: () => ([])
            },

            error: String,
            searchPlaceholder: {
                default: 'Type of choose an option'
            },
            label: {
                default: 'Options'
            },
            required: {
                type: Boolean,
                default: false
            },
        },
        data: () => ({
            isDropdown: false,
            isCreating: false,
            loading: false,
            search: '',
            options: [],
        }),
        watch: {
            isDropdown(val) {
                if(!val) {
                    this.isCreating = false
                    this.search = ''
                }
            }
        },
        computed: {
            optionFiltered() {
                if(!this.search) {
                    return this.options
                }

                return this.options.filter(x => {
                    if(x.label.indexOf(this.search) !== -1) {
                        return true
                    }
                    
                    return false
                })
            },

            optionSelected() {
                return this.options.filter(x => this.value.includes(x.value))
            }
        },
        async mounted() {
            await this.init()
        },
        methods: {
            async init() {
                const {server_side, endpoint, params, resolveData} = this.config

                if(server_side && endpoint) {
                    await this.fetchData(endpoint, params, resolveData)
                } else {
                    let options = this.items

                    if(typeof resolveData == 'function') {
                        options = options.map(opt => resolveData(opt))
                    }

                    this.options = options
                }
            },

            async fetchData(endpoint, params, resolveData = null) {
                try {
                    this.loading = true
                    const { data } = await this.$http.get(endpoint, {params})

                    if(!data.error && data.data) {
                        let options = data.data

                        if(typeof resolveData == 'function') {
                            options = options.map(opt => resolveData(opt))
                        }

                        this.options = options
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    this.loading = false
                }
            },

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
            },

            async reset() {
                this.isCreating = false
                this.search = ''
                await this.init()
            },

            async onDelete(val) {
                const {endpoint, server_side} = this.config

                if(!this.$hasPermission('issues.label.destroy')) {
                    return
                }

                if(!endpoint || !server_side) {
                    return
                }

                try {
                    this.loading = true
                    const { data } = await this.$http.delete(endpoint + `/${val}`)
                    
                    if(!data.error) {
                        await this.init()
                    }
                } catch (err) {
                    console.log(err)

                    this.$showAlert({
                        type: 'danger',
                        title: 'Oops!',
                        message: 'Something went wrong.'
                    })
                } finally {
                    this.loading = false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.options-wrapper {
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

    .options-dropdown {
        top: 2rem;
        left: 0;
        width: 100%;
        height: auto;
        position: absolute;
        border: 1px solid #f5f5f5;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 8%);
        overflow: hidden;
        z-index: 2;

        .options-dropdown--content {
            position: relative;

            .loading {
                position: absolute;
                top: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                background-color: rgba(225, 225, 225, .2);
            }
        }
    }

    .options-users {
        max-height: 250px;
        overflow-y: auto;

        .options-users--item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 36px;
            padding: 1rem;
            cursor: pointer;

            .left {
                padding: .15rem .75rem;
                border-radius: 10px;
                font-weight: 700;
                font-size: 10px;
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

                .loading-icon {
                    display: none
                }

                &.delete-loading {
                    .loading-icon {
                        display: inline-block
                    }

                    .danger {
                        display: none
                    }
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
            .options-users--item {
                padding: 0 .5rem;

                &:first-child {
                    padding-left: 0
                }

                &:last-child {
                    padding-right: 0
                }
            }
        }

        &.no-cursor {
            .options-users--item {
                cursor: auto;
            }
        }

        &.no-hover {
            .options-users--item:hover {
                background-color: transparent;
            }
        }
    }    
}
</style>