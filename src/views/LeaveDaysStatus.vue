<template>
<div class="page-content" :class="{hrm: inHrmRoutes === true}">
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <div class="wrapper-full">
                    <div class="text-center" v-if="status == 'approved'">
                        <img src="/images/gifs/approved.gif" height="250">
                        <h3>Thank you for your approval</h3>
                        <router-link :to="{name: 'dashboard'}" class="btn btn-primary btn-lg mt-3">
                            Back to home
                        </router-link>
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</div>
</template>

<script>
    export default {
        name: 'PageLeaveDaysStatus',
        computed: {
            status() {
                return this.$route.query.status
            }
        },
        mounted() {
            if(!this.status) {
                this.$router.push({name: 'dashboard'})
            }
        }
    }
</script>

<style lang="scss" scoped>
.wrapper-full {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}
</style>