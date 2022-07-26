
<template>
    <div class="notifications" :class="{fixed}">
        <div class="notifications-content">
            <marquee>
                Đây là nội dung thông báo mới
            </marquee>
        </div>
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
    background-color: #fff;
    font-weight: bold;

    &.fixed {
        position: fixed;
        top: 65px;
        left: 0;
        width: 100%;
        z-index: 1;
    }

    .notifications-content {
        background: rgba(245, 147, 0, 0.05);      
        padding: .15rem; 
    }
}
</style>