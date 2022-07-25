<template>
    <div class="mobile-navbar">
        <div class="mobile-navbar--item">
            <div class="d-flex flex-column justify-content-center align-items-center text-cursor" @click="$router.push({name: 'dashboard'})">
                <div class="h5 mb-0"><b-icon icon="speedometer2" variant="white"/></div>
                <div class="title">Dashboard</div>
            </div>
        </div>
        <div class="mobile-navbar--item">
            <div class="d-flex flex-column justify-content-center align-items-center text-cursor" @click="$router.push({name: 'projects'})">
                <div class="h5 mb-0"><b-icon icon="list-ol" variant="white"/></div>
                <div class="title">Projects</div>
            </div>
        </div>
        <div class="mobile-navbar--item">
            <div class="d-flex flex-column justify-content-center align-items-center text-cursor" @click="$router.push({name: 'profile'})">
                <div class="h5 mb-0"><b-icon icon="person-circle" variant="white"/></div>
                <div class="title">Account</div>
            </div>
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
            line-height: 2rem;
        }
    }
}
</style>