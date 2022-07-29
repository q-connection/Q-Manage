<template>
    <button 
        :type="type" 
        :class="`${fill} ${variant ? `text-${variant}` : ''} ${size} ${btnLoading ? 'loading' : ''}`"
        :disabled="disabled"
        class="button-icon"
        @click="$emit('click', {$event, toggleLoading})"
    >
        <div class="icon">
            <q-icon :icon="icon" v-if="!btnLoading"/>
            <b-spinner small v-else/>
        </div>
    </button>
</template>

<script>
    export default {
        props: {
            type: {
                default: 'button'
            },
            icon: {
                type: String,
                required: true
            },
            fill: {
                default: 'clear'
            },
            variant: {
                default: 'primary'
            },
            disabled: {
                type: Boolean,
                default: false
            },
            loading: {
                type: Boolean,
                default: false
            },
            size: {
                type: String,
                default: 'md'
            }
        },

        data: () => ({
            btnLoading: false
        }),

        watch: {
            loading(newval) {
                this.btnLoading = newval
            }
        },
        
        methods: {
            toggleLoading(sync = false) {
                this.btnLoading = sync
            }
        }
    }
</script>

<style lang="scss" scoped>
.button-icon {
    font-size: 22px;
    outline: none;
    border: 0;
    border-radius: 50%;
    min-height: 32px;
    min-width: 32px;
    position: relative;
    line-height: 1;
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
    text-decoration: none;
    overflow: hidden;
    cursor: pointer;    

    &.clear {
        background-color: transparent;
    }

    .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &:not(:disabled):hover {
        background-color: rgba(247, 247, 247, .8);
    }

    &.lg {
        min-height: 48px;
        min-width: 48px;
        font-size: 26px;
    }

    &:after {
        content: "";
        background: rgba(240, 240, 240, 1);
        display: block;
        position: absolute;
        padding-top: 300%;
        padding-left: 350%;
        margin-left: -20px!important;
        margin-top: -120%;
        opacity: 0;
        transition: all 0.8s        
    }

    &:active:after {
        padding: 0;
        margin: 0;
        opacity: 1;
        transition: 0s
    }    

    &:disabled, &.loading {
        pointer-events: none;

        .icon {
            opacity: .6;
        }
    }
}
</style>