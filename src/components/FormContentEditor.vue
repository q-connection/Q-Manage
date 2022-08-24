<template>
    <div 
        class="card-editor form-content-editor mb-3"
        :class="{
            required: required,
            'is-valid': state === true,
            'is-invalid': state === false,
            'no-review': reviewable === false
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

    const List = Quill.import('formats/list');
    const ListItem = Quill.import('formats/list/item');
    const Parchment = Quill.import('parchment');
    const Module = Quill.import('core/module');
    const Delta = Quill.import('delta');

    class TaskListItem extends ListItem {
        format(name, value) {
            if (name === TaskList.blotName && !value) {
                this.replaceWith(Parchment.create(this.statics.scope));
            }
            else {
                super.format(name, value);
            }
        }

        // when inserting a new list item, remove the 'checked' css class
        clone() {
            const clone = super.clone();
            clone.domNode.classList.remove('checked');
            return clone;
        }
    }

    TaskListItem.blotName = 'task-list-item';
    TaskListItem.tagName = 'LI';

    class TaskList extends List {
        static create() {
            return super.create('bullet');
        }

        static formats() {
            return 'bullet';
        }
    }

    TaskList.blotName = 'task-list';
    TaskList.tagName = 'UL';
    TaskList.className = 'task-list';
    TaskList.defaultChild = 'task-list-item';
    TaskList.allowedChildren = [TaskListItem];

    class TaskListModule extends Module {
        constructor(quill, options) {
            super(quill, options);
            
            this.quill.container.addEventListener('click', (e) => {
                if (e.target.matches('ul.task-list > li')) {
                    e.target.classList.toggle('checked');
                    this.quill.updateContents(new Delta().retain(1));

                    if(options && typeof options.callback == 'function') {
                        options.callback(e.target)
                    }
                }
            });
        }
    }

    Quill.register({
        'formats/task-list': TaskList,
        'formats/task-list/item': TaskListItem,
        'modules/task-list': TaskListModule
    });

    // https://github.com/quilljs/quill/blob/develop/assets/icons/list-check.svg
    Quill.import('ui/icons')['task-list'] = `
        <svg class="" viewbox="0 0 18 18">
            <line class="ql-stroke" x1="9" x2="15" y1="4" y2="4"></line>
            <polyline class="ql-stroke" points="3 4 4 5 6 3"></polyline>
            <line class="ql-stroke" x1="9" x2="15" y1="14" y2="14"></line>
            <polyline class="ql-stroke" points="3 14 4 15 6 13"></polyline>
            <line class="ql-stroke" x1="9" x2="15" y1="9" y2="9"></line>
            <polyline class="ql-stroke" points="3 9 4 10 6 8"></polyline>
        </svg>
    `;

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
            tabIndex: 0
        }),

        computed: {
            editorSettings() {
                return {
                    modules: {
                        toolbar: [
                            [{ 'font': [] }],

                            [{ 'size': ['small', false, 'large', 'huge'] }],  

                            ['bold', 'italic', 'underline', 'strike'],        
                            ['blockquote', 'code-block'],

                            [{ 'list': 'ordered'}, { 'list': 'bullet' }], [ 'task-list' ],
                            [{ 'indent': '-1'}, { 'indent': '+1' }],
                            [ 'link', 'image', 'video', 'formula' ],  


                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],

                            ['clean']                        
                        ],
                        imageDrop: true,
                        'task-list': {
                            issue_id: this.$route.params.issue_id
                        },
                        imageResize: {
                            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
                        }
                    }
                }
            }            
        },

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

    &.no-review {
        .tabs {       
            > div {
                padding: 0
            }   

            .nav-tabs {
                .nav-item {
                    .nav-link {
                        border: none !important;
                        padding: 0 !important;
                        margin-bottom: .5rem;
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