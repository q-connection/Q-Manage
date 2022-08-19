<template>
    <div v-lazy-container="{selector: 'img'}" @click="$emit('click', $event)">
        <img :data-src="src" :data-error="error" data-loading="/images/loading.gif" style="width: 100%; height: 100%; object-fit: cover">
    </div>
</template>

<script>
    export default {
        props: {
            src: {
                default: ''
            },

            error: {
                default: '/images/image-placeholder.png'
            }
        }
    }
</script>