<template>
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <page-breadcrumb :items="breadcrumb"/>
            </b-col>
            <b-col cols=12>
                <b-card class="my-3" v-if="!isLoading">
                    <b-card-title>{{ anno.title }}</b-card-title>
                    <b-card-sub-title>{{ $mm(anno.created_at).format('LLLL') }}</b-card-sub-title>
                    <div class="mt-3" v-if="anno.files">
                        <a :href="anno.files" target="_blank" class="text-primary h5">
                            <q-icon icon="et:attachments"/>
                            {{ getSplitedFile(anno.files) }}
                        </a>
                    </div>
                    <div class="mt-3" v-html="anno.description"></div>
                    <PDF class="mt-3" :src="anno.files" :page="1" v-if="anno.files">
                        <template slot="loading">
                            <b-spinner variant="primary" small>
                                Loading document...
                            </b-spinner>
                        </template>
                    </PDF>
                </b-card>
                <b-card class="my-3 p-3" v-else>
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center">
                            <b-spinner variant="primary"/>
                            <div class="h4 mt-3">Loading...</div>
                        </div>
                    </div>
                </b-card>
            </b-col>
            <b-col cols=12 v-if="!isLoading && other_announcements.length > 0">
                <h4>Other announcements</h4>
                <b-row>
                    <b-col cols=12 xl=3 lg=3 v-for="(item, index) in other_announcements" :key="index">
                        <div class="announcement-item" :class="{mobile: $device.mobile === true}" @click="handleOtherAnnoClicked(item.id)">
                            <div class="thumbnail">
                                <img :src="item.thumbnail ? item.thumbnail_url : '/images/image-placeholder.png'">
                            </div>
                            <div class="title">
                                {{ item.title }}
                            </div>
                        </div>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    import PDF from 'pdfvuer'

    export default {
        components: {PDF},

        data: () => ({
            anno: {},
            other_announcements: [],
            isLoading: true
        }),

        computed: {
            breadcrumb() {
                const {params} = this.$route

                return [
                    {title: "Dashboard", to: "dashboard"},
                    {title: "Announcements", to: "announcements"},
                    {title: `${this.$lodash.isEmpty(this.anno) ? 'Loading...' : this.anno.title}`, to: "view-announcement", params}
                ]
            }
        },

        async mounted() {
            await this.fetchAnnocement()
            await this.fetchOtherAnnocements()
        },

        methods: {
            async fetchAnnocement(id = null) {
                try {
                    const anno_id = id || this.$route.params.id
                    const { data } = await this.$http.get('announcements/' + anno_id)

                    if(!data.error) {
                        this.anno = data.data
                    }
                } catch (err) {
                    console.log(err)

                    if(err.response && err.response.status == 404) {
                        this.$router.push({name: 'not_found'})
                    }

                    if(err.response && err.response.status == 500) {
                        this.$router.push({name: 'server_error'})
                    }
                } finally {
                    this.isLoading = false
                }
            },

            async fetchOtherAnnocements(id = null) {
                try {
                    const anno_id = id || this.$route.params.id
                    const { data } = await this.$http.get('announcements', {params: {execpt: anno_id, page: 1, per_page: 4}})

                    if(!data.error) {
                        this.other_announcements = data.data.data
                    }
                } catch (err) {
                    console.log(err)
                }
            },

            getSplitedFile(link) {
                if(!link) {
                    return ''
                }

                const splited = link.split('/')

                return splited[splited.length - 1]
            },

            async handleOtherAnnoClicked(id) {
                if(id == this.$route.params.id) return

                this.$router.replace({name: 'view-announcement', params: {id}})       
                this.isLoading = true
                this.anno = {}
                this.other_announcements = []

                await this.fetchAnnocement(id)
                await this.fetchOtherAnnocements(id)
            }
        }
    }
</script>

<style lang="scss" scoped>
.announcement-item {
    cursor: pointer;

    .thumbnail {
        width: 100%;
        height: 200px;
        border-radius: 10px;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .title {
        font-size: 16px;
        font-weight: 500;
        margin-top: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 2; 
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;        
    }

    &.mobile {
        display: flex;
        margin-bottom: 10px;

        .thumbnail {
            width: 70px;
            height: 50px;
        }

        .title {
            font-size: 14px;
            padding-left: 8px;
            margin-top: 0;     
        }
    }
}
</style>