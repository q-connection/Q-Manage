<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
        <b-row>
            <b-col>
                <b-list-group class="group-list-project" v-if="list.length > 0">
                    <b-list-group-item class="d-flex justify-content-between align-items-center list-project"
                        v-for="(p, index) in list" :key="index">
                        <b-row :class="['item', { 'issue-attach': isShowIssues }]">
                            <slot name="icon" />
                            <div class="project-info">
                                <div class="project-name">
                                    <div style="display: flex;">
                                        {{ p?.name }}
                                        <slot name="badges" />
                                    </div>
                                </div>
                                <div class="create-at">
                                    {{ p?.formatted_created_at }} by {{ p?.created_by }}
                                </div>
                                <div class="issue" v-show="isShowIssues">
                                    <label>
                                        Task: <span class="text-success">{{ task }}</span>
                                    </label>
                                    <label>
                                        Bug:<span class="text-danger">{{ task }}</span>
                                    </label>
                                </div>
                            </div>
                        </b-row>
                        <b-row class="list-avatar">
                            <div v-for="(c, avatarIndex) in p.customers" :key="avatarIndex">
                                <b-img class="avatar" :src="getAvatar(c.avatar)" rounded="circle" alt="Circle image">
                                </b-img>
                            </div>
                        </b-row>
                    </b-list-group-item>
                </b-list-group>
                <b-list-group v-else-if="queryParams.q != ''">
                    <b-list-group-item class="text-center align-items-center list-project">
                        <div> No matching records found</div>
                    </b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <div class="float-right" style="margin-top: 27px" v-show="isShowPagination">
                    <b-pagination first-class="custom-pagination-first" last-class="custom-pagination-last"
                        v-model="queryParams.page" :total-rows="total_rows" :per-page="queryParams.per_page"
                        aria-controls="table-announcements">
                        <template #prev-text>
                            <b-icon icon="chevron-left" />
                        </template>
                        <template #next-text>
                            <b-icon icon="chevron-right" />
                        </template>
                    </b-pagination>
                </div>
            </b-col>
        </b-row>
    </div>
</template>
<script>
export default {
    data: () => ({
        list: [],
        task: 10,
        bug: 0,
        total_rows: 0,
        queryParams: {
            per_page: 10,
            page: 1,
            q: ''
        }
    }),
    props: {
        isShowIssues: {
            type: Boolean,
            default: false
        },
        isShowPagination: {
            type: Boolean,
            default: false
        },
        keySearch: {
            type: String,
            default: "",
        },
        getAll: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        async fetchProjects() {
            try {
                const { data } = await this.$http.get(`projects`, { params: this.queryParams });
                if (!data.error) {
                    this.list = data.data.data
                    this.total_rows = data.data.total
                }
            } catch (err) {
                console.log(err)
            }
        },
        getAvatar(avatar) {
            return avatar ? avatar : '/images/default-user-avatar.png'
        }
    },
    watch: {
        'keySearch': function (val) {
            this.queryParams.q = val
            this.fetchProjects()
        },
        'queryParams.page': function (p) {
            this.queryParams.page = p
            this.fetchProjects()
        }
    },
    mounted() {
        if (this.getAll) this.queryParams.per_page = 10000
        this.queryParams.q = this.keySearch
        this.fetchProjects()
    },
}
</script>
<style lang="scss" scoped>
.group-list-project {
    border-radius: 10px;
    cursor: pointer;

    .list-project {
        padding: 0px;
        border: 1px solid #E0E0E0;

        .item {
            margin: 15px auto 14px 44px;

            &.issue-attach {
                margin: 8px auto 8px 35px !important;
            }

            .icon {
                margin-right: 16px;
                margin-top: 5px;
            }

            .project-info {
                .project-name {
                    font-weight: 600;
                    font-size: 16px;
                    line-height: 17px;
                    margin-bottom: 2px;
                }

                .badges-status {
                    margin-left: 13px;
                    min-width: 24px;
                    height: 18px;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 10px;
                    line-height: 12px;
                }

                .create-at {
                    font-weight: 500;
                    font-size: 14px;
                    line-height: 12px;
                }

                .issue {
                    display: flex;
                    margin-top: 6px;
                    font-weight: 500;
                    font-size: 10px;
                    line-height: 12px;
                    color: #666666;

                    span {
                        margin-right: 19px;
                    }
                }
            }
        }

        .project-image {
            width: 44px;
            height: 46px; //cũ 44px
            margin-right: 28px;
            border-radius: 5px;
        }

        .list-avatar {
            margin: 0px;

            .avatar {
                width: 37px;
                height: 37px;
                border: 1px solid #F59300;
                margin-right: 12px;

                &:last-of-type {
                    margin-right: 32px;
                }
            }
        }

    }
}
</style>
<style>
.custom-pagination-first,
.custom-pagination-last {
    display: none;
}
</style>