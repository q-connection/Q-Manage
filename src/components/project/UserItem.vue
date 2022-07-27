<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <b-row class="user-item">
        <div @click="incrementYear">
            <QIcon icon="ant-design:delete-outlined" class="delete-user" color="white" width="21" height="21" />
        </div>

        <b-img src="https://picsum.photos/200" class="avatar" rounded="circle" alt="Circle image"></b-img>

        <b-col>
            <div class="full-name">
                {{ user?.full_name }}
            </div>
            <div class="email">
                {{ user?.email }}
            </div>
            <div class="username">
                {{ user?.username }}
            </div>
        </b-col>
    </b-row>
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
        incrementYear() {
            this.$emit('removePeople', this.user?.id)
        }

    },
    mounted() {
        console.log('user', this.user)
    }
}
</script>
<style lang="scss" scoped>
.user-item {
    height: 53px;
    background: rgba(240, 176, 29, 0.21);
    border-radius: 26.5px;
    border-radius: 26.5px;
    margin-top: 25px;

    &:not(last-of-type,first-of-type) {
        margin-right: 25px;
    }


    .delete-user {
        position: absolute;
        top: 20px;
        right: 55px;
        background-color: #fa4032;
        border-radius: 10px;
        cursor: pointer;
    }

    .avatar {
        width: 50px;
        height: 50px;
        border: 1px solid #F59300;
    }

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