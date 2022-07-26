<template>
    <div>
        <div id="user-notworking" v-if="not_working_users.length > 0">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <h5 class="mb-0 title-notworking">Not working today</h5>
                <div class="text-cursor">
                    <span class="h5 text-primary" @click="toggleList">
                        <b-icon icon="chevron-up" v-if="is_show_list"></b-icon>
                        <b-icon icon="chevron-down" v-else></b-icon>
                    </span>
                </div>
            </div>
            <div class="user-notworking-wrapper" :class="{ hide: is_show_list === false }">
                <div class="notworking-item" v-for="(u, index) in not_working_users" :key="index">
                    <div class="user-name-notworking ">{{ u }}</div>
                </div>
            </div>
        </div>
        <div class="text-right mt-2">
            <h5 class="text-primary text-cursor organizational-chart " @click="$bvModal.show('modal-organization')">
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

                if (!data.error) {
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
.title-notworking {
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
}

.user-notworking-wrapper {
    max-height: 160px;
    overflow: auto;
    transition: .25s;

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar:horizontal {
        height: auto;
        max-height: 99px;
        background-color: red;
    }

    &::-webkit-scrollbar-track {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #D9D9D9;
        border-radius: 10px;
    }

    .notworking-item {
        padding: .25rem .5rem;
        font-size: 18px;
        border-bottom: 1px solid #d9d9d9;
        margin-bottom: 5px;


        .user-name-notworking {
            font-weight: 400;
            font-size: 14px;
            line-height: 19px;
        }

        &:hover {
            background: #F5F5F5;
        }
    }

    &.hide {
        max-height: 0;
    }
}

.organizational-chart {
    font-style: italic;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
}
</style>