<template>
    <b-button :type="type" :variant="variant" :disabled="disabled" :size="size" @click="($event) => $emit('click', $event)">
        <div v-if="!loading">
            <slot/>
        </div>
        <div v-else>
            <b-spinner type="grow" variant="white" label="Loading..." :small="this.size != 'lg'"></b-spinner>
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
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>