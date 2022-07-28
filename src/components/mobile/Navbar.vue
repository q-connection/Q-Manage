<template>
    <div class="mobile-navbar" :class="{hrm: $hasPermission('hrm.index') && $hasPermission('employee.index')}">
        <div class="mobile-navbar--item">
            <router-link class="d-flex flex-column justify-content-center align-items-center text-cursor text-decoration-none" :to="{name: 'dashboard'}">
                <div class="icon h4 mb-0"><q-icon icon="ant-design:dashboard-filled"/></div>
                <div class="title">Dashboard</div>
            </router-link>
        </div>
        <div class="mobile-navbar--item">
            <router-link  class="d-flex flex-column justify-content-center align-items-center text-cursor text-decoration-none" :to="{name: 'projects'}">
                <div class="icon h4 mb-0"><q-icon icon="ic:sharp-view-list"/></div>
                <div class="title">Projects</div>
            </router-link>
        </div>
        <div class="mobile-navbar--item" v-if="$hasPermission('hrm.index') && $hasPermission('employee.index')">
            <router-link :to="{name: 'hrm-employees'}" class="item d-flex flex-column justify-content-center align-items-center text-cursor text-decoration-none" :class="{'router-link-exact-active': inHrmRoutes === true}">
                <div class="icon h4 mb-0"><q-icon icon="healthicons:human-resoruces"/></div>
                <div class="title">HRM</div>
            </router-link>
        </div>
        <div class="mobile-navbar--item">
            <router-link class="d-flex flex-column justify-content-center align-items-center text-cursor text-decoration-none" :to="{name: 'profile'}">
                <div class="icon h4 mb-0"><q-icon icon="ic:sharp-account-circle"/></div>
                <div class="title">Account</div>
            </router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'MobileNavbar',
        computed: {
            inHrmRoutes() {
                return this.$route.name.indexOf('hrm') !== -1
            }
        }
    }
</script>

<style lang="scss" scoped>
.mobile-navbar {
    position: fixed;
    bottom: 0;
    left: 0;
    min-height: 59px;
    display: flex;
    width: 100%;
    z-index: 99;

    .mobile-navbar--item {
        width: calc(100% / 3);

        &.hrm {
            width: calc(100% / 4);
        }

        a, .item {
            position: relative;
            padding: .5rem;
            background-color: var(--white);

            .icon, .title {
                color: var(--primary);
                opacity: .5
            }

            .title {
                line-height: 1.5rem;
            }            

            &.router-link-exact-active {
                .icon, .title {
                    transition: .25s;
                    opacity: 1;
                }
            }          
            
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 5px;
                -webkit-box-shadow: 0px -4px 5px rgba(50, 50, 50, 0.1);
                -moz-box-shadow: 0px -4px 5px rgba(50, 50, 50, 0.1);
                box-shadow: 0px -4px 5px rgba(50, 50, 50, 0.1);
            }
        }

        &:first-child > a {
            border-top-left-radius: 10px;

            &::before {
                border-top-left-radius: 10px;
            }
        }

        &:last-child > a {
            border-top-right-radius: 10px;

            &::before {
                border-top-right-radius: 10px;
            }            
        }        
    }
}
</style>