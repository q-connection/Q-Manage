<template>
    <div class="fiu-container position-relative" :class="{ avatar }">
        <div class="fiu-wrapper" :class="{ valid: state === true, invalid: state === false }">
            <input ref="file" type="file" :accept="accept" style="display: none" @change="handleFileUpload" />
            <div class="preview">
                <img-lazy-load class="w-100 h-100" :src="preview" error="/images/avatar-placeholder.png" />
            </div>
        </div>
        <div class="overlay" @click="onClickUpload" v-if="!readonly && !avatar">
            <span class="h2">
                <b-icon icon="upload" />
            </span>
        </div>
        <div class="overlay full" v-if="readonly" @click="viewImage">
            <span class="h2 text-primary">
                <q-icon icon="ant-design:eye-filled" />
            </span>
        </div>
        <div class="avatar-edit-icon" v-if="avatar" @click="onClickUpload">
            <span class="h2" style="line-height: 0">
                <q-icon icon="fluent:image-edit-16-filled" v-if="!isUploading" />
                <q-icon icon="ei:spinner" class="spin" v-else />
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: [File, String, Object],

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
        },

        avatar: {
            type: Boolean,
            default: false
        }
    },

    data: () => ({
        isUploading: false
    }),

    computed: {
        preview() {
            if (this.previewUrl && !this.value) {
                return this.previewUrl
            }

            if (!this.value) {
                return '/images/image-placeholder.png'
            }

            if (typeof this.value == 'object') {
                return URL.createObjectURL(this.value)
            }

            return this.value
        }
    },

    methods: {
        uploading(sync) {
            this.isUploading = sync
        },

        handleFileUpload(event) {
            if (this.disabled || this.isUploading) return

            const file = event.target.files[0]
            this.$emit('input', file)
            this.$emit('upload', { file, uploading: this.uploading })
        },

        onClickUpload() {
            if (this.disabled || this.isUploading) {
                return
            }

            this.$refs.file.click()
        },

        viewImage() {
            this.$viewerApi({
                images: [this.preview]
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.fiu-container {
    width: 100%;
    height: 100%;

    .avatar-edit-icon {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        background: #fff;
        width: 46px;
        height: 46px;
        padding: .5rem;
        border: 1px solid var(--primary);
        color: var(--primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        cursor: pointer;

        .h2 {
            margin-bottom: 0;
        }

        &:hover {
            background: var(--primary);
            color: #fff;
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
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;

        &.readonly {
            background-color: transparent;
            cursor: auto;
        }

        &.full {
            background-color: transparent;
            height: 100%;

            span {
                display: none
            }
        }

        &:hover {
            background-color: rgba(240, 176, 29, 0.6);
            color: #fff;

            span {
                display: block
            }
        }
    }

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
            overflow: hidden;
            border-radius: 10px;
            position: relative;
            height: 100%;       
            width: 100%;     
            
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }


    &.avatar {
        border-radius: 50%;

        .overlay {
            &.full {
                border-radius: 50%;
            }

            &:hover {
                border-radius: 50%;
            }
        }

        .fiu-wrapper {
            border-radius: 50%;
        }
    }
}
</style>