<template>
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <page-breadcrumb :items="breadcrumb"/>
            </b-col>
            <b-col cols=12>
                <b-card class="my-3" v-if="!isLoading">
                    <h5>{{ anno.name }}</h5>
                    <b-card-sub-title>{{ $mm(anno.created_at).format('LLL') }}</b-card-sub-title>
                    <div class="mt-3" v-if="anno.file">
                        <a :href="anno.file_url" target="_blank" class="text-primary h6">
                            <q-icon icon="et:attachments"/>
                            {{ getSplitedFile(anno.file) }}
                        </a>
                    </div>
                    <div class="mt-3" v-html="anno.description"></div>
                    <div class="mt-3 w-100 border" v-if="anno.file">
                        <embed :src="fileUrl(anno.file)" style="width: 100%; min-height: 500px" type="application/pdf">
                    </div>
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
        </b-row>
    </b-container>
</template>

<script>
    export default {
        data: () => ({
            anno: {},
            isLoading: true
        }),

        computed: {
            breadcrumb() {
                const {params} = this.$route

                return [
                    {title: "Dashboard", to: "dashboard"},
                    {title: "Policies", to: "policies"},
                    {title: `${this.$lodash.isEmpty(this.anno) ? 'Loading...' : this.anno.name}`, to: "view-policy", params}
                ]
            }
        },

        async mounted() {
            await this.fetchAnnocement()
            // await this.fetchOtherAnnocements()
        },

        methods: {
            async fetchAnnocement(id = null) {
                try {
                    const anno_id = id || this.$route.params.id
                    const { data } = await this.$http.get('policies/' + anno_id)

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

                this.$router.replace({name: 'view-policy', params: {id}})       
                this.isLoading = true
                this.anno = {}
                this.other_announcements = []

                await this.fetchAnnocement(id)
                await this.fetchOtherAnnocements(id)
            },

            fileUrl(file) {
                return process.env.VUE_APP_API_ENDPOINT + `/stream-pdf/${file}`
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