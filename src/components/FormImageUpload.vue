<template>
    <div class="fiu-wrapper" :class="{valid: state === true, invalid: state === false}">
        <input ref="file" type="file" :accept="accept" style="display: none" @change="handleFileUpload"/>
        <div class="preview">
            <img :src="preview"/>
        </div>
        <div class="overlay" @click="onClickUpload" :class="{readonly}">
            <span class="h2 mt-1" v-if="!readonly">
                <b-icon icon="upload"/>
            </span>
            <span class="h2 mt-1" v-else>
                <q-icon icon="ant-design:eye-filled"/>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            value: [File, String],

            accept: {
                type: String,
                default: 'image/jpg,image/jpeg,image/png,image/gif'
            },

            maxSize: {
                type: Number,
                default: 30
            },

            state: {
                default: null
            },

            readonly: {
                type: Boolean,
                default: false
            },

            disabled: {
                type: Boolean,
                default: false
            },

            previewUrl: {
                type: String,
                default: ''
            }
        },

        computed: {
            preview() {
                if(this.previewUrl && !this.value) {
                    return this.previewUrl
                }

                if(!this.value) {
                    return '/images/image-placeholder.png'
                }

                if(typeof this.value == 'object') {
                    return URL.createObjectURL(this.value)
                }

                return this.value
            }
        },

        methods: {
            handleFileUpload(event) {
                if(this.disabled || this.readonly) return

                const file = event.target.files[0]
                this.$emit('input', file)
            },

            onClickUpload() {
                if(this.disabled || this.readonly) {
                    return
                }

                this.$refs.file.click()                
            }
        }
    }
</script>

<style lang="scss" scoped>
.fiu-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: 10px;
    border: 1px solid #dee2e6;
    overflow: hidden;
    
    &.valid {
        border: 1px solid var(--success)
    }
    
    &.invalid {
        border: 1px solid var(--danger)
    }

    .preview {
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 25%;
        width: 100%;
        background-color: rgba(240, 176, 29, 0.35);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: var(--primary);
        line-height: 2;
        
        &:not(.readonly):hover {
            background-color: rgba(240, 176, 29, 0.6);
            color: #fff
        }

        &.readonly {
            cursor: auto;
        }
    }
}
</style>