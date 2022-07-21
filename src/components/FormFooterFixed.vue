<template>
    <div class="footer-fixed">
        <div class="footer-fixed--content">
            <div><slot name="start"></slot></div>
            <div><slot/></div>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.footer-fixed {
    position: fixed;
    left:0;
    bottom: 0;
    height: 80px;
    background: #fff;
    width: 100%;
    box-shadow: 0.125rem 0 0.25rem rgb(0 0 0 / 8%) !important;
    z-index: 1;
    padding: .75rem;

    .footer-fixed--content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>