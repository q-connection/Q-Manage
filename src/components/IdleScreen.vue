<template>
    <div class="idle-screen fade" :class="{show: $store.state.idleLoading == true}">
        <div class="idle-screen--logo">
            <img src="/images/logo.png"/>
            <b-spinner variant="warning"/>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.idle-screen {
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    width: 100%;
    min-height: 100vh;
    z-index: 99999;
    transition: .25s;
    overflow: hidden;
    visibility: hidden;
    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;       

    * {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;            
    }    
    
    &.show {
        overflow-x: hidden;
        overflow-y: auto;       
        visibility: visible;             
    }

    .idle-screen--logo {
        display: flex;
        width: 100%;
        min-height: 100vh;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        img {
            height: 60px;
            width: auto;
            margin-bottom: .5rem;
        }
    }
}
</style>