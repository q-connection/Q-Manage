<template>
    <div id="app">
        <component :is="layout">
            <router-view />
        </component>
        <idle-screen />
        <alert-custom />
        <vue-progress-bar/>
    </div>
</template>

<script>
export default {
    name: "App",
    data: () => ({
        innerWidth: 0,
        innerHeight: 0
    }),

    computed: {
        layout() {
            let device = this.$device.mobile ? "mobile" : "desktop";

            if(device == 'desktop' && this.innerWidth < 1200) {
                device = 'mobile'
            }

            if(device == 'mobile' && this.innerWidth >= 1200) {
                device = 'desktop'
            }

            return (this.$route.meta.layout || "blank") + `-${device}-layout`;
        },
    },
    mounted() {
        const that = this;
        this.innerWidth = window.innerWidth;
        this.innerHeight = window.innerHeight;

        window.addEventListener("resize", function () {
            that.innerWidth = window.innerWidth;
            that.innerHeight = window.innerHeight;
        });
    }   
};
</script>

<style lang="scss">
@import "@/assets/sass/main.scss";
</style>