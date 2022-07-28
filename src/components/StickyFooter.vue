<template>
    <div class="footer-wrapper" :style="{position}">
        <div class="footer-content">
            Q-Connection @ All Rights Reserved 2022
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            position: {
                type: String,
                default: 'relative'
            }
        }
    }
</script>

<style lang="scss" scoped>
.footer-wrapper {
    bottom: 0;
    left: 50%;
    width: 100%;
    transform: translateX(-50%);
    padding: 1rem;

    .footer-content {
        text-align: center;
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 12px;
        color: #666666;        
    }
}
</style>