<template>
    <div class="options-wrapper" :class="mode" v-click-outside="hide">
        <legend class="bv-no-focus-ring col-form-label pt-0 font-weight-medium" :class="{'label-required': required}" v-show="mode == 'select'">
            {{ label }}
        </legend>
        <div class="toolbar" @click="show" :class="[mode, {show: isDropdown}]" :state="stateToString">
            <div class="title" :class="{'label-required': required}" v-show="mode == 'label'">{{ label }}</div>
            <div class="placeholder" v-show="mode == 'select' && !value">{{ placeholder }}</div>
            <div class="values" v-show="mode == 'select' && value">
                <div 
                    class="values-item"
                    v-for="(opt, index) in optionSelected" 
                    :key="index" 
                >
                    <slot name="option-selected" v-bind="opt">
                        <div :class="opt.class || 'left'" :style="opt.style">
                            {{ opt.label }}
                        </div>
                    </slot>
                </div>
            </div>
            <div class="icon">
                <q-icon icon="ep:setting" v-show="mode == 'label'"></q-icon>
                <svg xmlns="http://www.w3.org/2000/svg" role="presentation" v-show="mode == 'select'">
                    <path d="M9.211364 7.59931l4.48338-4.867229c.407008-.441854.407008-1.158247 0-1.60046l-.73712-.80023c-.407008-.441854-1.066904-.441854-1.474243 0L7 5.198617 2.51662.33139c-.407008-.441853-1.066904-.441853-1.474243 0l-.737121.80023c-.407008.441854-.407008 1.158248 0 1.600461l4.48338 4.867228L7 10l2.211364-2.40069z"></path>
                </svg>
            </div>
        </div>
        <div class="options-users no-padding no-cursor no-hover d-flex flex-wrap">
            <div 
                class="options-users--item"
                v-for="(opt, index) in optionSelected" 
                :key="index"
                v-show="mode == 'label'"
            >
                <slot name="option-selected" v-bind="opt">
                    <div :class="opt.class || 'left'" :style="opt.style">
                        {{ opt.label }}
                    </div>
                </slot>
            </div>
            <div class="text-danger small my-1">{{error}}</div>
        </div>
        <div class="options-dropdown" :class="mode" v-show="isDropdown">
            <div class="options-dropdown--content">
                <div class="loading" v-show="loading">
                    <b-spinner variant="secondary"/>
                </div>
                <div v-show="!isCreating">
                    <div class="px-3 pt-3 pb-2 mb-1">
                        <b-form-input v-model="search" :placeholder="searchPlaceholder" />
                    </div>                
                    <div class="options-users pb-4">
                        <div v-show="optionSelected.length > 0 && multiple">
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
                            :class="{active: hasValue(opt.value)}" 
                            @click.self="onClick(opt.value)"
                        >
                            <div class="d-flex" @click="onClick(opt.value)">
                                <div class="pr-2">
                                    <div style="width: 16px">
                                        <span class="text-success h5 m-0 p-0" style="line-height: 0" v-show="hasValue(opt.value)">
                                            <q-icon icon="ant-design:check-outlined"/>
                                        </span>
                                    </div>
                                </div>
                                <slot name="option" v-bind="opt">
                                    <div>
                                        <div :class="opt.class || 'left'" :style="opt.style">
                                            {{ opt.label }}
                                        </div>
                                    </div>
                                </slot>
                            </div>
                            <div class="right" v-show="userHasPermission('destroy') && config.server_side">
                                <span class="danger" @click="onDelete(opt.value)">
                                    <q-icon icon="bi:trash-fill"/>
                                </span>
                            </div>
                        </div>
                        <div class="text-center text-muted p-1" v-show="optionFiltered.length <= 0 && !search && !userHasPermission('create')">
                            No option to show
                        </div>                    
                        <div class="text-center text-muted p-1" v-show="optionFiltered.length <= 0 && search && !userHasPermission('create')">
                            No options were found
                        </div>                    
                        <div class="text-center text-muted p-1" v-show="optionFiltered.length <= 0 && !search && userHasPermission('create')">
                            No option to show. Enter to create a new one!
                        </div>                    
                        <div class="text-center text-cursor text-muted p-1" v-show="optionFiltered.length <= 0 && search && userHasPermission('create')" @click="isCreating = true">
                            <u>Create new option "<b>{{ search }}</b>" ?</u>
                        </div>         
                    </div>
                </div>
                <div class="pb-2" v-show="isCreating">
                    <slot name="creation" v-bind="{reset, search, isCreating}"/>
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
                type: [Array, String, Number],
                default: null
            },

            state: {
                default: null
            },

            config: {
                type: Object,
                default: () => ({
                    server_side: false,
                    endpoint: null,
                    params: {},
                    resolveData: null,
                    allow_creation: false,
                    storeKey: null
                })
            },

            items: {
                type: Array,
                default: () => ([])
            },

            error: String,
            placeholder: {
                default: 'Select an option'
            },
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
            multiple: {
                type: Boolean,
                default: false
            },
            mode: {
                default: 'label',
                validator(value) {
                    return ['label', 'select'].includes(value)
                }
            }
        },
        data: () => ({
            isDropdown: false,
            isCreating: false,
            loading: false,
            isSubmitting: false,
            search: '',
            options: []
        }),
        watch: {
            isDropdown(val) {
                if(!val) {
                    this.isCreating = false
                    this.search = ''
                }
            },
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
                return this.options.filter(x => this.hasValue(x.value))
            },

            stateToString() {
                return this.state === null ? false : (new Boolean(this.state)).toString()
            }            
        },
        async mounted() {
            await this.init()
        },
        methods: {
            async init() {
                const {server_side, endpoint, params, resolveData, storeKey = null} = this.config

                if(server_side && endpoint) {
                    if(storeKey && this.$store.state[storeKey]) {
                        this.parseOptions(this.$store.state[storeKey], resolveData) 
                        this.$watch(`$store.state.${storeKey}`, async () => {
                            await this.init()
                        })
                    } else {
                        await this.fetchData(endpoint, params, resolveData)
                    }
                } else {
                    this.parseOptions(this.items, resolveData)
                }
            },

            parseOptions(items, resolveData) {
                let options = items

                if(typeof resolveData == 'function') {
                    options = options.map(opt => resolveData(opt))
                }

                this.options = options
            },

            async fetchData(endpoint, params, resolveData = null) {
                try {
                    this.loading = true
                    const { data } = await this.$http.get(endpoint, {params})

                    if(!data.error && data.data) {
                        this.parseOptions(data.data, resolveData)
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    this.loading = false
                }
            },

            onClick(id) {
                if(this.multiple) {
                    let users = this.value || [];
                    const idx = users.findIndex(x => x == id)

                    if(idx !== -1) {
                        this.$delete(users, idx)
                    } else {
                        users.push(id)
                    }

                    this.$emit('input', users)
                } else {
                    this.$emit('input', id)
                }
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
                const {storeDispatch} = this.config
                this.isCreating = false
                this.search = ''

                if(storeDispatch) {
                    this.loading = true
                    await this.$store.dispatch(storeDispatch)
                    this.loading = false
                }

                await this.init()
            },

            async onDelete(val) {
                const {endpoint, server_side, storeDispatch = null} = this.config

                if(!endpoint || !server_side) {
                    return
                }

                try {
                    this.loading = true
                    const { data } = await this.$http.delete(endpoint + `/${val}`)
                    
                    if(!data.error) {
                        if(storeDispatch) {
                            await this.$store.dispatch(storeDispatch)
                        }

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
            },

            hasValue(val) {
                if(this.multiple) {
                    const value = this.value || []

                    return value.includes(val)
                } else {
                    return this.value == val
                }
            },

            userHasPermission(key = 'create') {
                const { permission = null, allow_creation = false } = this.config

                if(!permission || allow_creation) {
                    return true
                }

                return this.$hasPermission(`${permission}.${key}`)
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

    &.select {
        border-bottom: none;
        padding-bottom: 0;
    }

    .toolbar {
        &.label {
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

        &.select {
            background: #FFFFFF;
            border: 1px solid var(--primary);
            border-radius: 10px;
            min-height: 45px;
            padding: 0.375rem 0.75rem;
            display: flex;
            justify-content: space-between;
            cursor: pointer;

            .placeholder {
                font-weight: 400;
                line-height: 2;
                color: #495057;
            }

            .values {
                display: flex;
                flex-wrap: wrap;
                overflow-x: auto;
                max-width: 80%;

                .values-item {
                    line-height: 2.25;
                }
            }

            .icon {
                padding-top: 5px;
                svg {
                    fill: rgba(60,60,60,0.5);
                    transform: scale(1);
                    transition: transform 0.15s cubic-bezier(1,0.5,0.8,1);
                    transition-timing-function: cubic-bezier(1,0.5,0.8,1);
                    width: 14px;
                    height: 10px;
                }
            }

            &[state=false] {
                border: 1px solid var(--danger);
            }

            &[state=true] {
                border: 1px solid var(--success);
            }

            &.show {
                .icon {
                    svg {
                        transform: rotate(180deg) scale(1);
                    }
                }
            }
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

        &.select {
            top: 5rem
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