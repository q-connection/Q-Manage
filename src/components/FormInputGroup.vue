<template>
    <div class="cig">
        <slot/>
        <div class="cig-prepend">
            <slot name="prepend"/>
        </div>        
        <div class="cig-append">
            <slot name="append"/>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.cig {
    position: relative;

    .cig-append, .cig-prepend {
        position: absolute;
        top: 45%;
        transform: translateY(-45%);
        color: #ced4da
    }

    .cig-append {
        right: 8px;
    }

    .cig-prepend {
        left: 8px
    }
}
</style>