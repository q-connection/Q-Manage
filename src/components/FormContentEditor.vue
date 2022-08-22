<template>
    <div 
        class="card-editor form-content-editor mb-3"
        :class="{
            required: required,
            'is-valid': state === true,
            'is-invalid': state === false
        }"
    >
        <b-tabs v-model="tabIndex">
            <b-tab :title="label">
                <VueEditor 
                    @input="onInput"
                    :value="value"
                    :editorOptions="editorSettings"
                />
            </b-tab>
            <b-tab title="Review" v-if="reviewable">
                <div class="ql-snow">
                    <div class="ql-editor w-100 p-3" v-html="value"></div>
                </div>
            </b-tab>
        </b-tabs>      
        <span class="text-danger small mt-1">
            {{ error }}
        </span>  
    </div>
</template>

<script>
    import {VueEditor, Quill} from 'vue2-editor'
    import { ImageDrop } from 'quill-image-drop-module'
    import ImageResize from 'quill-image-resize-module'

    Quill.register('modules/imageDrop', ImageDrop)
    Quill.register('modules/imageResize', ImageResize)

    export default {
        components: {VueEditor},
        props: {
            value: {
                type: [String, Object],
            },

            label: {
                type: String,
                default: ''
            },

            reviewable: {
                type: Boolean,
                default: false
            },

            required: {
                type: Boolean,
                default: false
            },

            error: {
                type: String,
                default: ''
            },

            state: {
                type: Boolean,
                default: null
            }
        },

        data: () => ({
            tabIndex: 0,
            editorSettings: {
                modules: {
                    imageDrop: true,
                    imageResize: {
                        modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                    }
                }
            }
        }),

        methods: {
            onInput(e) {
                this.$emit('input', e)
            }
        }
    }
</script>

<style lang="scss">
.card-editor {
    .tabs {
        > div {
            padding: 0 .5rem
        }

        .tab-content {
            padding: 0 !important;
            overflow: hidden;
            position: relative;
            border-color: var(--primary)
        }

        .nav-tabs {
            .nav-item {
                .nav-link {
                    border: 0;
                    color: #333;
                    padding: .25rem 1rem;
                    line-height: 1.25;

                    &.active {
                        background-color: transparent;
                        color: #333;
                        border: 1px solid var(--primary);
                    }
                }                
            }
        }
    }

    &.required {
        .tabs {
            .nav-tabs {
                .nav-item {
                    &:first-child {
                        .nav-link {
                            &::after {
                                position: absolute;
                                content: "*";
                                color: var(--danger);
                                padding-left: 2px;
                            }      
                        }                      
                    }                    
                }
            }
        }

        &.is-valid {
            .tabs {
                .tab-content {
                    border-color: var(--success);
                }

                .nav-tabs {
                    .nav-item {
                        .nav-link {
                            &.active {
                                border: 1px solid var(--success);
                            }
                        }                
                    }
                }                
            }
        }

        &.is-invalid {
            .tabs {
                .tab-content {
                    border-color: var(--danger);
                }

                .nav-tabs {
                    .nav-item {
                        .nav-link {
                            &.active {
                                border: 1px solid var(--danger);
                            }
                        }                
                    }
                }                
            }
        }
    }
}
</style>