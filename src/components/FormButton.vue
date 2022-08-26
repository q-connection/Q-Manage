<template>
    <b-button :to="to" :type="type" :variant="variant" :disabled="disabled" :size="size" @click="($event) => $emit('click', $event)" :block="block">
        <div v-if="!loading">
            <slot name="icon"/>
            <slot/>
        </div>
        <div v-else>
            <div v-if="loadingWithoutHiddenText">
                <b-spinner type="grow" :variant="loadingVariant" label="Loading..." :small="this.size != 'lg'"></b-spinner>
                <slot/>
            </div>
            <div class="d-flex justify-content-center w-100" v-else>
                <b-spinner type="grow" :variant="loadingVariant" label="Loading..." :small="this.size != 'lg'"></b-spinner>
            </div>
        </div>
    </b-button>
</template>

<script>
    export default {
        props: {
            variant: {
                type: String,
                default: 'primary'
            },

            disabled: {
                type: Boolean,
                default: false
            },

            type: {
                type: String,
                default: 'button'
            },

            loading: {
                type: Boolean,
                default: false
            },

            size: {
                type: String,
                default: 'md'
            },

            loadingWithoutHiddenText: {
                type: Boolean,
                default: false
            },

            block: {
                type: Boolean,
                default: false
            },

            to: {
                default: null
            },
        },

        computed: {
            loadingVariant() {
                const variant = this.variant || ''

                return variant.indexOf('outline-') !== -1 ? variant.replace('outline-') : 'white'
            }
        }
    }
</script>