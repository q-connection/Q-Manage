<template>
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="mb-0" v-html="title"></h5>
        <span class="h1 text-danger text-cursor" @click="$bvModal.hide(modalId)">
            <q-icon icon="ant-design:close-circle-filled"/>
        </span>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                required: true
            },

            modalId: {
                type: String,
                required: true
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>