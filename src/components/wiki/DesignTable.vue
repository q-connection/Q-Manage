<template>
    <b-card>
        <div class="mb-2 h5 font-weight-bold">Designs</div>        
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>Release ({{total}})</div>
            <div>
                <b-button 
                    :to="{name: 'project-wiki-designs-create'}"
                    variant="success"
                    size="sm"
                    class="p-2"
                    style="min-width: 90px"
                >
                    Add
                </b-button>
            </div>
        </div>
        <b-row class="mb-3">
            <b-col cols=12 xl=8 lg=8>
                <form-input-group class="d-none d-xl-block d-lg-block search-form">
                    <b-form-input style="min-width: 285px;" placeholder="Search versions and description" v-model.lazy="queryParams.search"></b-form-input>
                    <template #append>
                        <span class="h3">
                            <q-icon icon="bx:search-alt"/>
                        </span>
                    </template>
                </form-input-group>                
            </b-col>
            <b-col cols=12 xl=4 lg=4>
                <b-select2
                    placeholder="Select labels"
                    label="name"
                    v-model="queryParams.tags"
                    :reduce="tag => tag.id"
                    :options="tags"
                    multiple
                />
            </b-col>
        </b-row>
        <b-row>
            <b-col cols=12 v-for="(item, index) in designs" :key="index">
                <div class="design-item">
                    <div class="design-item--title mb-1">
                        <span class="badge bg-primary text-white">{{ item.version ? item.version.name : 'N/A' }}</span>
                        <span class="ml-1">Link: </span>
                        <a :href="item.url">Click here</a>
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
                        <div class="text-muted">{{ $mm(item.created_at).format('LLLL') }}</div>
                        <div class="text-muted">Created by <b>{{ item.created_by.fullname }}</b></div>
                    </div>
                    <div class="design-item--tag">
                        <span 
                            class="badge mr-2" 
                            :style="{backgroundColor: item.tag ? item.tag.color : '#333', color: '#fff'}"
                        >
                            {{ item.tag ? item.tag.name : 'N/A' }}
                        </span>
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
            tags: [],
            designs: [],
            queryParams: {
                page: 1,
                per_page: 5,
                search: '',
                tags: [],
                project_id: ''
            }
        }),

        watch: {
            queryParams: {
                deep: true,
                async handler() {
                    clearTimeout(this.timer)
                    this.timer = setTimeout(async () => {
                        await this.fetchDesigns()
                    },750)
                }
            }
        },

        async mounted() {
            await this.fetchTags()
            await this.fetchDesigns()
        },

        methods: {
            async fetchTags() {
                try {
                    const { data } = await this.$http.get('design_tags', {params: {
                        project_id: this.$route.params.id
                    }})

                    if(!data.error) {
                        this.tags = data.data
                    }
                } catch (err) {
                    console.log(err)
                }
            },

            async fetchDesigns() {
                try {
                    const params = Object.assign({}, this.queryParams)
                    params.tags = params.tags.join(',')
                    params.project_id = this.$route.params.id

                    const { data } = await this.$http.get('project_designs', {params})

                    if(!data.error) {
                        this.total = data.data.total
                        this.designs = data.data.data
                    }
                } catch (err) {
                    console.log(err)
                }
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