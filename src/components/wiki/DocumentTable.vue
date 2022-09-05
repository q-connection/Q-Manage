<template>
    <b-card>
        <div class="mb-2 h5 font-weight-bold">Documents</div>
        <div class="mb-2">
            <div>Release ({{total}})</div>
        </div>
        <b-row class="mb-3">
            <b-col cols=12 xl=10 lg=10>
                <form-input-group class="d-none d-xl-block d-lg-block search-form">
                    <b-form-input style="min-width: 285px;" placeholder="Search versions and description" v-model.lazy="queryParams.search"></b-form-input>
                    <template #append>
                        <span class="h3">
                            <q-icon icon="bx:search-alt"/>
                        </span>
                    </template>
                </form-input-group>                
            </b-col>
            <b-col>
                <b-button 
                    :to="{name: 'project-wiki-documents-create'}"
                    variant="success"
                    size="sm"
                    class="p-2"
                    style="width: 100%; height: 100%; line-height: 2"
                >
                    Add
                </b-button>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols=12 v-for="(item, index) in documents" :key="index">
                <div class="design-item">
                    <div class="design-item--title mb-1">
                        <a class="text-success h5 mb-0" :href="item.file_url">
                            <q-icon icon="entypo:download"/>
                        </a>
                        <span class="mx-1 font-weight-bold">{{ item.title }} </span>
                        <a class="h5 mb-0" href="javascript:;" @click="handleEdit(item)">
                            <q-icon icon="fa-solid:edit"/>
                        </a>
                    </div>
                    <div class="design-item--description mb-2">
                        <read-more 
                            class="read-more" 
                            more-str="show more" 
                            :text="`<div style='white-space: pre-wrap; word-wrap: break-word; font-family: inherit'>${item.description}</div>`" 
                            link="#" 
                            less-str="show less" 
                            :max-chars="200"
                        />
                    </div>
                    <div class="design-item--author">
                        <div class="text-muted">{{ $mm(item.created_at).format('DD/MM/YYYY HH:mm:ss') }}</div>
                        <div class="text-muted">Created by <b>{{ item.created_by.fullname }}</b></div>
                    </div>
                </div>
            </b-col>
            <b-col cols=12>
                <div class="d-flex justify-content-end mt-2">
                    <b-pagination
                        v-model="queryParams.page"
                        :total-rows="total"
                        :per-page="queryParams.per_page"
                    >
                        <template #first-text>
                            <b-icon icon="chevron-double-left"/>
                        </template>
                        <template #last-text>
                            <b-icon icon="chevron-double-right"/>
                        </template>
                        <template #prev-text>
                            <b-icon icon="chevron-left"/>
                        </template>
                        <template #next-text>
                            <b-icon icon="chevron-right"/>
                        </template>
                    </b-pagination>    
                </div>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
    export default {
        name: 'WikiTable',
        data: () => ({
            total: 0, 
            documents: [],
            queryParams: {
                page: 1,
                per_page: 5,
                search: '',
                project_id: '',
            }
        }),

        watch: {
            queryParams: {
                deep: true,
                async handler() {
                    clearTimeout(this.timer)
                    this.timer = setTimeout(async () => {
                        await this.fetchDocuments()
                    },750)
                }
            }
        },

        async mounted() {
            await this.fetchDocuments()
        },

        methods: {
            async fetchDocuments() {
                try {
                    const params = Object.assign({}, this.queryParams)
                    params.project_id = this.$route.params.id

                    const { data } = await this.$http.get('project_documents', {params})

                    if(!data.error) {
                        this.total = data.data.total
                        this.documents = data.data.data
                    }
                } catch (err) {
                    console.log(err)
                }
            },

            handleEdit(item) {
                this.$store.commit('project/SET_DOCUMENT', item)

                this.$router.push({name: 'project-wiki-documents-edit', params: {
                    id: this.$route.params.id,
                    doc_id: item.id
                }})
            }
        }
    }
</script>

<style lang="scss" scoped>
.design-item {
    padding: .75rem;
    border: 1px solid #E0E0E0;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    margin-bottom: .75rem;
    position: relative;

    .design-item--author {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .design-item--tag {
        position: absolute;
        top: .75rem;
        right: .75rem;
    }
}

.description {
    white-space: pre-wrap; 
    word-wrap: break-word;
    font-family: inherit;    
}
</style>