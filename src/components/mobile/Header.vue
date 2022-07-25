<template>
    <div class="header">
        <div class="text-primary">
            <q-icon icon="ant-design:question-circle"/>
        </div>
        <div class="text-primary">
            <q-icon icon="clarity:bell-solid"/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'HeaderMobile'
    }
</script>

<style lang="scss" scoped>
.header {
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.75rem;
    padding: .5rem .75rem;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 48px;
    z-index: 1;
    background: #fff;
}
</style>