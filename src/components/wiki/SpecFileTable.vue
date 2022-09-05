<template>
    <b-card>
        <div class="mb-2 h5 font-weight-bold">Specification</div>
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>Release ({{total}})</div>
            <div>
                <b-button 
                    :to="{name: 'project-wiki-spec-files-create'}"
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
            <b-col cols=12 xl=3 lg=3>
                <b-select2
                    placeholder="Select screens"
                    label="name"
                    v-model="queryParams.screens"
                    :reduce="screen => screen.id"
                    :options="screens"
                />            
            </b-col>
            <b-col cols=12 xl=3 lg=3>
                <b-select2
                    placeholder="Select versions"
                    label="name"
                    v-model="queryParams.versions"
                    :reduce="version => version.id"
                    :options="versions"
                />
            </b-col>
            <b-col cols=12 xl=3 lg=3>
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
                <div class="design-item" @click="onShowDetailSpec(item)">
                    <div class="design-item--title mb-1">
                        <span class="bg-primary text-white font-weight-medium rounded-lg" style="font-weight: 600; padding: 2px 4px">{{ item.version ? item.version.name : 'N/A' }}</span>
                        <span class="ml-1 h5 mb-0" style="font-weight: 600">{{ item.screen ? item.screen.name : 'Unknown' }}</span>
                    </div>
                    <div class="design-item--author">
                        <div class="text-muted">{{ $mm(item.created_at).format('DD/MM/YYYY HH:mm:ss') }}</div>
                        <div class="text-muted">Created by <b>{{ item.created_by.fullname }}</b></div>
                    </div>
                    <div class="design-item--tag">
                        <span 
                            class="rounded-lg ml-2" 
                            :style="{backgroundColor: item.tag ? item.tag.color : '#333', color: '#fff', padding: '2px 4px'}"
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
            versions: [],
            screens: [],
            queryParams: {
                page: 1,
                per_page: 5,
                search: '',
                tags: [],
                project_id: '',
                versions: null,
                screens: null
            }
        }),

        watch: {
            queryParams: {
                deep: true,
                async handler() {
                    clearTimeout(this.timer)
                    this.timer = setTimeout(async () => {
                        await this.fetchSpecs()
                    },750)
                }
            }
        },

        async mounted() {
            this.fetchTags()
            this.fetchVersions()
            this.fetchScreens()
            await this.fetchSpecs()
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

            async fetchVersions() {
                try {
                    const { data } = await this.$http.get('versions', {params: {
                        project_id: this.$route.params.id
                    }})

                    if(!data.error) {
                        this.versions = data.data
                    }
                } catch (err) {
                    console.log(err)
                }
            },

            async fetchScreens() {
                try {
                    const { data } = await this.$http.get('localization_features', {params: {
                        project_id: this.$route.params.id
                    }})

                    if(!data.error) {
                        this.screens = data.data
                    }
                } catch (err) {
                    console.log(err)
                }
            },

            async fetchSpecs() {
                try {
                    const params = Object.assign({}, this.queryParams)
                    params.tags = params.tags.join(',')
                    params.project_id = this.$route.params.id

                    const { data } = await this.$http.get('project_specs', {params})

                    if(!data.error) {
                        this.total = data.data.total
                        this.designs = data.data.data
                    }
                } catch (err) {
                    console.log(err)
                }
            },

            onShowDetailSpec(item) {
                this.$store.commit('project/SET_SPEC', item)

                this.$router.push({name: 'project-wiki-spec-files-detail', params: {
                    id: this.$route.params.id,
                    spec_id: item.id
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
    cursor: pointer;
    transition: .25s;
    
    &:hover {
        transform: scale(1.01);
    }

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