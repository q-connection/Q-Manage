
<template>
    <div class="notifications" :class="{fixed}">
        <marquee>
            Đây là nội dung thông báo mới
        </marquee>
    </div>
</template>

<script>
    export default {
        props: {
            fixed: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<style lang="scss" scoped>
.notifications {
    background-color: rgba(245, 147, 0, 0.05);
    padding: .15rem;
    font-weight: bold;

    &.fixed {
        position: fixed;
        top: 80px;
        left: 0;
        width: 100%;
    }
}
</style>