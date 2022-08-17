<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="user-item" :class="{ mobile: $device.mobile === true }">
        <div class="delete-user" @click="removePeople">
            <QIcon icon="ant-design:delete-outlined" color="white" width="21" height="21" />
        </div>
        <b-img :src="user.avatar_url ? user.avatar_url : null" class="avatar" rounded="circle" alt="Circle image"></b-img>
        <div class="ml-2">
            <div class="full-name">
                {{ user.full_name }}
            </div>
            <div class="email">
                {{ user.email }}
            </div>
            <div class="username">
                {{ user.username }}
            </div>
        </div>
    </div>
</template>
<script>
export default {

    props: {
        user: {
            type: Object,
            // eslint-disable-next-line vue/require-valid-default-prop
            default: {}
        }
    },
    methods: {
        removePeople() {
            this.$emit('removePeople', this.user?.id)
        }
    },
}
</script>
<style lang="scss" scoped>
.user-item {
    width: 260px;
    height: 53px;
    margin-top: 25px;
    background: rgba(240, 176, 29, 0.21);
    border-radius: 26.5px;
    padding-top: 5px;
    position: relative;
    display: flex;

    &:not(last-of-type, first-of-type, .mobile) {
        margin-right: 25px;
    }

    &.mobile {
        margin-right: 11px !important;
    }

    .delete-user {
        position: absolute;
        top: -5px;
        right: 15px;
        background-color: #fa4032;
        border-radius: 10px;
        cursor: pointer;
        padding: 2px;
        transition: .25s;

        &:hover {
            transform: scale(1.1);
        }
    }

    .avatar {
        width: 45px;
        height: 45px;
        border: 1px solid #F59300;
        margin-left: .25rem;
    }

    .full-name {
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