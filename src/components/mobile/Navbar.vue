<template>
    <div class="mobile-navbar">
        <div class="mobile-navbar--item">
            <router-link class="d-flex flex-column justify-content-center align-items-center text-cursor text-decoration-none" :to="{name: 'dashboard'}">
                <div class="h4 mb-0 text-white"><q-icon icon="ant-design:dashboard-filled"/></div>
                <div class="title text-white">Dashboard</div>
            </router-link>
        </div>
        <div class="mobile-navbar--item">
            <router-link  class="d-flex flex-column justify-content-center align-items-center text-cursor text-decoration-none" :to="{name: 'projects'}">
                <div class="h4 mb-0 text-white"><q-icon icon="ic:sharp-view-list"/></div>
                <div class="title text-white">Projects</div>
            </router-link>
        </div>
        <div class="mobile-navbar--item">
            <router-link class="d-flex flex-column justify-content-center align-items-center text-cursor text-decoration-none" :to="{name: 'profile'}">
                <div class="h4 mb-0 text-white"><q-icon icon="ic:sharp-account-circle"/></div>
                <div class="title text-white">Account</div>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MobileNavbar'
    }
</script>

<style lang="scss" scoped>
.mobile-navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    min-height: 59px;
    background-color: var(--primary);
    color: #fff;
    display: flex;
    width: 100%;

    .mobile-navbar--item {
        width: 33.3%;
        padding: .5rem;

        .title {
            line-height: 1.5rem;
        }
    }
}

.router-link-exact-active {
    font-weight: bold;
}
</style>