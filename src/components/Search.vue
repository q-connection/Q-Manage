<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-multiple-template-root -->
<!-- eslint-disable vue/valid-template-root -->
<template>
    <div class="icon-input">
        <b-form-input v-model="search" placeholder="Tìm kiếm..."/>
        <QIcon icon="bx:search-alt" class="icon-input__icon material-icons" color="#e0e0e0" width="23" height="23" />
    </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>

.form-control {
    border: 1px solid #E0E0E0;
}
.icon-input {
    margin-bottom: 10px;
    position: relative;
    max-width: 300px;

    &__text-field {
        width: 100%;
        padding: 5px 30px 5px 5px;
    }

    &__icon {
        color: rgba(0, 0, 0, 1);
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
    }

    &__text-field:focus+&__icon {
        color: #FF8400;
    }
}
</style>