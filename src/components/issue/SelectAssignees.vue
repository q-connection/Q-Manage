<template>
    <div class="assignees-wrapper" v-click-outside="hide">
        <div class="toolbar" @click="show">
            <div class="title">Assignees</div>
            <div class="icon">
                <q-icon icon="ep:setting"></q-icon>
            </div>
        </div>
        <div class="assignees-users no-padding no-cursor">
            <div 
                class="assignees-users--item"
                v-for="(user, index) in usersSelected" 
                :key="index" 
            >
                <div class="left">
                    <img-lazy-load 
                        class="avatar" 
                        :src="user.avatar_url" 
                        error="/images/avatar-placeholder.png"
                    />
                    <div>
                        <div class="font-weight-bold">{{ user.fullname }}</div>
                        <div class="text-gray small">{{ user.username }}</div>
                    </div>
                </div>
                <div class="right">
                    <span class="danger text-cursor" @click="onClickUser(user.id)">
                        <q-icon icon="codicon:close"/>
                    </span>
                </div>
            </div>
            <div class="text-danger small my-1">{{error}}</div>
        </div>
        <div class="assignees-dropdown" v-show="isDropdown">
            <div class="px-3 pt-3 pb-2 mb-1">
                <b-form-input v-model="search" placeholder="Type or chooose a user"/>
            </div>
            <div>
                <div class="assignees-users pb-4">
                    <div v-show="usersSelected.length > 0">
                        <div class="d-flex justify-content-end py-1 px-3">
                            <div class="text-cursor" @click="$emit('input', [])">
                                <span>Clear All</span>
                                <span class="text-danger h5 m-0 p-0">
                                    <q-icon icon="codicon:close"/>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div 
                        class="assignees-users--item"
                        v-for="(user, index) in userFiltered" 
                        :key="index" 
                        @click="onClickUser(user.id)"
                        :class="{active: value.includes(user.id)}" 
                    >
                        <div class="left">
                            <img-lazy-load 
                                class="avatar" 
                                :src="user.avatar_url" 
                                error="/images/avatar-placeholder.png"
                            />
                            <div>
                                <div class="font-weight-bold">{{ user.fullname }}</div>
                                <div class="text-gray small">{{ user.username }}</div>
                            </div>
                        </div>
                        <div class="right">
                            <span class="success" v-if="!value.includes(user.id)">
                                <q-icon icon="akar-icons:plus"/>
                            </span>
                            <span class="danger" v-else>
                                <q-icon icon="codicon:close"/>
                            </span>
                        </div>
                    </div>
                    <div class="text-center text-muted" v-if="userFiltered.length <= 0">
                        No record to show.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ClickOutside from 'vue-click-outside'
import { mapActions } from 'vuex'

    export default {
        directives: {ClickOutside},
        props: {
            value: {
                type: Array,
                default: () => ([])
            },

            error: String
        },
        data: () => ({
            isDropdown: false,
            search: ''
        }),
        computed: {
            users() {
                return this.$store.state.employees
            },

            userFiltered() {
                if(!this.search) {
                    return this.users
                }

                return this.users.filter(x => {
                    if(x.fullname.indexOf(this.search) !== -1 || x.username.indexOf(this.search) !== -1) {
                        return true
                    }
                    
                    return false
                })
            },

            usersSelected() {
                return this.users.filter(x => this.value.includes(x.id))
            }
        },
        async mounted() {
            await this.fetchBasicData()
        },
        methods: {
            ...mapActions([
                'fetchBasicData'
            ]),

            onClickUser(id) {
                let users = this.value || [];
                const idx = users.findIndex(x => x == id)

                if(idx !== -1) {
                    this.$delete(users, idx)
                } else {
                    users.push(id)
                }

                this.$emit('input', users)
            },

            hide() {
                if(this.isDropdown) {
                    this.isDropdown = false
                }
            },

            show() {
                this.isDropdown = !this.isDropdown
            }
        }
    }
</script>

<style lang="scss" scoped>
.assignees-wrapper {
    margin-bottom: .5rem;
    padding-bottom: .5rem;
    border-bottom: 1px solid #f5f5f5;
    position: relative;

    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        cursor: pointer;

        .title {
            font-weight: 600;
            line-height: 1.5;
        }

        .icon {
            font-size: 18px
        }
    }

    .assignees-dropdown {
        top: 2rem;
        left: 0;
        width: 100%;
        height: 300px;
        position: absolute;
        border: 1px solid #f5f5f5;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 8%);
        overflow: hidden;
        z-index: 1;
    }

    .assignees-users {
        max-height: 250px;
        overflow-y: auto;

        .assignees-users--item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 45px;
            padding: 1rem;
            cursor: pointer;

            .left {
                display: flex;
                align-items: center;

                .avatar {
                    margin-right: .5rem;
                    width: 32px;
                    height: 32px;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid var(--primary);
                    border-radius: 50%;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        -o-object-fit: cover;
                    }
                }
            }

            .right {
                font-size: 20px;
                line-height: 0;

                .success {
                    color: var(--success)
                }

                .danger {
                    color: var(--danger)
                }
            }

            &:hover {
                background-color: var(--light);
            }

            &.active {
                background-color: #f5f5f5;                  
            }
        }

        &.no-padding {
            .assignees-users--item {
                padding: 0;
            }
        }

        &.no-cursor {
            .assignees-users--item {
                cursor: auto;
            }
        }
    }    
}
</style>