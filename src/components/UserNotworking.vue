<template>
    <div>
        <div id="user-notworking" v-if="not_working_users.length > 0">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">Not working today</h5>
                <div class="text-cursor">
                    <span class="h4 text-primary" @click="toggleList">
                        <b-icon icon="chevron-up" v-if="is_show_list"></b-icon>
                        <b-icon icon="chevron-down" v-else></b-icon>
                    </span>
                </div>
            </div>
            <div class="user-notworking-wrapper" :class="{hide: is_show_list === false}">
                <div class="notworking-item" v-for="(u, index) in not_working_users" :key="index">
                    {{ u }}
                </div>
            </div>       
        </div>
        <div class="text-right mt-2">
            <h5 class="text-primary text-cursor" @click="$bvModal.show('modal-organization')">
                Organizational Charts
            </h5>
        </div> 
    </div>
</template>

<script>
    export default {
        data: () => ({
            not_working_users: [],
            is_show_list: true
        }),

        async mounted() {
            await this.fetchNotWorkingUsers()
        },

        methods: {
            async fetchNotWorkingUsers() {
                try {
                    const { data } = await this.$http.get('employee/not-working-today')

                    if(!data.error) {
                        this.not_working_users = data.data.map((x) => x.name)
                    }
                } catch (err) {
                    console.log(err)
                }
            },      
            
            toggleList() {
                this.is_show_list = !this.is_show_list
            }
        }
                
    }
</script>

<style lang="scss" scoped>
.user-notworking-wrapper {
    margin-top: 10px;
    max-height: 150px;
    overflow: auto;
    transition: .25s;

    .notworking-item {
        padding: .25rem .5rem;
        font-size: 18px;
        background: #F5F5F5;
        border-bottom: 1px solid #d9d9d9;
        margin-bottom: 5px;
    }

    &.hide {
        max-height: 0;
    }
}
</style>