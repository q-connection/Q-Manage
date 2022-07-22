<template>
    <div class="alert-wrapper fade" :style="{width: clientWidth, height: clientHeight}" :class="{show: isActive === true}">
        <div class="alert-wrapper--dialog">
            <div class="alert-wrapper--dialog__content">
                <div class="alert-icon text-info mb-2" v-if="type == 'confirm'">
                    <q-icon icon="bi:shield-lock-fill" style="font-size: 65px"/>
                </div>                
                <div class="alert-title">
                    {{ title }}
                </div>
                <div class="alert-message" v-html="message"></div>
                <div class="alert-icon" v-if="type != 'confirm'">
                    <img :src="`/images/icons/${type}.png`">
                </div>
                <b-form @submit.prevent="onCallback" v-if="this.type == 'confirm'">
                    <b-form-group label="Password" :invalid-feedback="confirmErrorMsg" :state="confirmErrorMsg">
                        <b-input type="password" placeholder="Enter your password" :state="confirmErrorMsg" v-model="password" required/>
                    </b-form-group>
                    <div class="alert-confirm--buttons">
                        <div class="p-2">
                            <b-button variant="secondary" size="sm" @click="isActive = false">
                                Cancel
                            </b-button>
                        </div>
                        <div class="p-2">
                            <form-button variant="success" type="submit" :disabled="isConfirming" :loading="isConfirming">
                                Confirm
                            </form-button>
                        </div>
                    </div>
                </b-form>
            </div>
        </div>
    </div>   
</template>

<script>
    export default {
        data: () => ({
            innerWidth: '',
            innerHeight: '',
            title: 'Successfully!',
            type: 'success',
            message: '',
            isActive: false,
            callback: null,
            isConfirming: false,
            password: '',
            confirmErrorMsg: null
        }),

        computed: {
            clientWidth() {
                return (this.innerWidth || window.innerWidth) + 'px'
            },

            clientHeight() {
                return (this.innerHeight || window.innerHeight) + 'px'
            }
        },

        created() {
            this.$root.$on('SHOW_ALERT', (type = 'success', message = '', title = 'Successfully!', timeout = 3500, callback = null) => {
                this.title = title
                this.message = message
                this.type = type
                this.isActive = true
                this.callback = callback

                if(type != 'confirm') {
                    setTimeout(() => {
                        this.dismiss()
                    }, timeout)
                }
            })
        },

        mounted() {
            const that = this
            window.addEventListener('resize', function(){
                that.innerWidth = window.innerWidth;
                that.innerHeight = window.innerHeight; 
            });
        },

        methods: {
            async onCallback() {
                this.isConfirming = true
                if(typeof this.callback === "function") {
                    await this.callback(this)
                }

                this.isConfirming = false
            },

            dismiss() {
                this.isActive = false
                this.password = ''
                this.isConfirming = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .alert-wrapper {
        position: fixed;
        background: rgba(0, 0, 0, 0.1);
        z-index: 9999;
        top: 0;
        left: 0;
        overflow: hidden;
        visibility: hidden;
        -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
        animation: fadein 0.5s, fadeout 0.5s 2.5s;        
        transition: 0.25s;

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

        .alert-wrapper--dialog {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            transition: -webkit-transform .3s ease-out;
            transition: transform .3s ease-out;
            transition: transform .3s ease-out,-webkit-transform .3s ease-out;
            -webkit-transform: translate(0,-50px);
            transform: translate(0,-50px);            

            .alert-wrapper--dialog__content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fff;
                padding: 1rem;
                border-radius: 1rem;
                width: 360px;
                min-height: 210px;
                max-width: 80%;
                max-height: 400px;

                .alert-title {
                    font-style: normal;
                    font-weight: 500;
                    font-size: 24px;
                    line-height: 20px;    
                    text-align: center;
                    color: #000000;
                    margin-top: 1rem;
                    margin-bottom: .75rem                                 
                }

                .alert-message {
                    text-align: center;
                    color: #999999;
                    margin-bottom: .75rem;
                }

                .alert-icon {
                    display: flex;
                    width: 100%;
                    justify-content: center;

                    img {
                        width: 65px;
                        height: 65px
                    }
                }

                .alert-confirm--buttons {
                    display: flex;
                    justify-content: center;

                    .btn {
                        height: 48px;
                    }
                }
            }   
        }
    }
</style>