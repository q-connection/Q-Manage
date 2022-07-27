<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <b-col class="customer-item">
        <b-img src="https://picsum.photos/200" rounded="circle" alt="Circle image"></b-img>
        <b-col>
            <div class="full-name">
                {{ customer?.name }}
            </div>
            <div class="email">
                {{ customer?.name }}
            </div>
            <div class="username">
                {{ customer?.name }}
            </div>
        </b-col>
    </b-col>
</template>
<script>
export default {

    props: {
        customer: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {}
        }
    }
}
</script>
<style lang="scss" scoped>
.customer-item {
    background: rgba(240, 176, 29, 0.21);
    border-radius: 26.5px;

    .full-name {
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 17px;
    }

    .email {
        font-weight: 500;
        font-size: 10px;
        line-height: 12px;
    }

    .username {
        font-weight: 500;
        font-size: 10px;
        line-height: 12px;
    }
}
</style>