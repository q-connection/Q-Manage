<template>
    <project-layout>
        <b-row>
            <b-col cols=12 xl=3 lg=3>
                <wiki-sidebar/>
            </b-col>
            <b-col cols=12 xl=9 lg=9>
                <b-card body-class="p-0" v-if="spec">
                    <div class="p-3">
                        <router-link :to="{name: 'project-wiki-spec-files'}">
                            <q-icon icon="eva:arrow-ios-back-outline"/>
                            Back
                        </router-link>                        
                    </div>
                    <div class="d-flex justify-content-between flex-wrap mb-3 px-3 py-2">
                        <div>
                            <div class="d-flex align-items-end mb-1">
                                <span class="bg-primary text-white font-weight-medium rounded-lg" style="font-weight: 600; padding: 2px 4px">{{ spec.version?.name || 'N/A' }}</span>
                                <span class="ml-2 h5 mb-0" style="font-weight: 600">{{ spec.screen ? spec.screen.name : 'Unknown' }}</span>                                
                                <router-link :to="{name: 'project-wiki-spec-files-edit'}" class="ml-2 h4 mb-0" v-if="$hasPermission('project.spec.edit') && !spec.disabled">
                                    <q-icon icon="akar-icons:edit"/>    
                                </router-link>                                
                            </div>
                            <div class="text-muted">{{ $mm(spec.created_at).format('DD/MM/YYYY HH:mm:ss') }} by {{ spec.created_by.fullname }}</div>
                        </div>
                        <div>
                            <span 
                                class="rounded-lg ml-2" 
                                :style="{backgroundColor: spec.tag ? spec.tag.color : '#333', color: '#fff', padding: '2px 4px'}"
                            >
                                {{ spec.tag ? spec.tag.name : 'N/A' }}
                            </span>                            
                        </div>
                    </div>
                    <div class="w-100 spec-content border-bottom px-3 pb-3 pt-1">
                        <div class="ql-snow">
                            <div 
                                class="ql-editor p-0" 
                                style="min-height: auto" 
                                v-html="spec.description"
                            >
                            </div>
                        </div>                         
                    </div>
                    <transition-group class="position-relative overflow-hidden" name="list" tag="div" appear>
                        <div class="mb-1 p-3 border-bottom bg-white" key="design">
                            <h5>Design</h5>
                            <div v-if="spec.design_urls?.length > 0">
                                <ul class="list-group">
                                    <li 
                                        class="list-group-item"
                                        v-for="(file, fileIdx) in spec.design_urls" 
                                        :key="fileIdx"                                
                                    >
                                        <div class="d-flex justify-content-between">
                                            <div style="font-weight: 600">{{ file.title }}</div>
                                            <div class="text-truncate">
                                                <a :href="file.url" target="_blank">
                                                    <q-icon icon="akar-icons:link-chain"/>
                                                    {{ file.url }}
                                                </a>                       
                                            </div>                 
                                        </div>
                                    </li>
                                </ul>
                            </div>                                              
                        </div>
                        <div class="mb-1 p-3 border-bottom bg-white d-flex align-items-end" key="localization">
                            <div class="h5 mb-0">
                                Localization Strings
                            </div>                  
                            <div class="h4 mb-0 ml-2">
                                <router-link :to="{name: 'project-wiki-localization', query: {version: spec.version?.name || 'N/A', screen: spec.screen ? spec.screen.name : 'N/A'}}">
                                    <q-icon icon="akar-icons:edit"/> 
                                </router-link>                                
                            </div>                           
                        </div>
                        <div class="mb-1 p-3 bg-white border-bottom" v-for="(comment, index) in allowedComments" :key="index">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center mb-3">
                                    <form-button-icon
                                        class="mr-1"
                                        icon="bi:trash-fill"
                                        variant="danger"
                                        @click="onDeleteComment($event, comment.id)"
                                        v-if="$hasPermission('project.spec.comment.destroy')"
                                    />
                                    <img-lazy-load
                                        class="avatar"
                                        :src="comment.created_by.avatar_thumb_url"
                                        error="/images/default-avatar.png"
                                    />
                                    <div class="ml-2">
                                        <h6 class="mb-0">{{ comment.created_by.fullname }}</h6>
                                        <small class="text-muted">
                                            {{ $mm(comment.created_at).format('DD/MM/YYYY HH:mm:ss') }}
                                        </small>                            
                                    </div>
                                </div>  
                                <div>
                                    <span 
                                        class="h3 text-cursor mb-0" 
                                        @click="toggleSolveComment(comment.id)"
                                        :class="{'text-secondary': comment.solved === false, 'text-success': comment.solved === true}"
                                    >
                                        <q-icon icon="akar-icons:circle-check"/>
                                    </span>
                                </div> 
                            </div>
  
                            <div class="ql-snow">
                                <div 
                                    class="ql-editor p-0" 
                                    style="min-height: auto" 
                                    v-html="comment.content"
                                >
                                </div>
                            </div>                                                
                        </div>
                        <div class="p-3 bg-white" key="comment">
                            <div class="d-flex justify-content-end" v-if="comments.length > 0">
                                <div 
                                    class="bg-primary text-white px-2 py-1 text-cursor font-weight-bold" 
                                    style="border-radius: 15px"
                                    @click="show_all = !show_all"
                                >
                                    <span v-if="!show_all">Show comments ({{ listCommentsSolved.length }})</span>
                                    <span v-else>Hide comments</span>
                                </div>
                            </div>
                            <validation-observer v-slot="{handleSubmit}">
                                <form @submit.prevent="handleSubmit(submitComment)">
                                    <validation-provider
                                        name="comment"
                                        ref="comment"
                                        rules="required"
                                        v-slot="{errors, valid}"
                                    >
                                        <form-content-editor
                                            label="Content"
                                            v-model="comment"
                                            :state="$isValid(errors, valid)"
                                            :error="errors[0]"
                                            reviewable
                                        />
                                    </validation-provider>
                                    <div class="d-flex justify-content-end">
                                        <form-button
                                            type="submit"
                                            variant="primary"
                                            class="w-md-100"
                                            style="min-width: 250px"
                                            :disabled="isComment"
                                            :loading="isComment"
                                            loading-without-hidden-text
                                        >
                                            COMMENT
                                        </form-button>
                                    </div>
                                </form>
                            </validation-observer>
                        </div>
                    </transition-group>
                </b-card>
            </b-col>
        </b-row>
    </project-layout>
</template>

<script>
    import ProjectLayout from '@/components/project/Layout.vue'
    import WikiSidebar from '@/components/wiki/Sidebar.vue'

    export default {
        components: {ProjectLayout, WikiSidebar},
        data: () => ({
            show_all: false,
            isComment: false,
            comment: ''
        }),
        computed: {
            spec() {
                return this.$store.state.project.spec
            },

            comments() {                
                return this.spec.comments || []
            },

            allowedComments() {
                if(this.show_all) {
                    return this.comments
                }

                return this.comments.filter(x => x.solved === false)
            },

            listCommentsSolved() {
                return this.comments.filter(x => x.solved === true)
            }            
        },
        async mounted() {
            await this.fetchSpec(true)
        },
        methods: {
            async fetchSpec(force = false) {
                const { spec_id = null } = this.$route.params
                
                if(!spec_id) {
                    this.$router.push({name: 'projetc-wiki-spec-files', params: {id: this.$route.params.id}})
                    return
                }

                if(this.spec && !force) {
                    return
                }

                try {
                    const { data } = await this.$http.get('project_specs/' + spec_id)

                    if(!data.error) {
                        this.$store.commit('project/SET_SPEC', data.data)
                    }
                } catch (err) {
                    console.log(err)
                }
            },

            async submitComment() {
                try {
                    this.isComment = true
                    const { data } = await this.$http.post('spec_comments', {content: this.comment, spec_id: this.$route.params.spec_id})

                    if(!data.error) {
                        await this.fetchSpec(true)
                        this.comment = ''
                    }
                } catch (err) { 
                    console.log(err)
                } finally {
                    this.isComment = false
                }
            },

            async toggleSolveComment(id) {
                try {
                    const cmt = this.comments.find(x => x.id == id && x.solved === false)

                    if(cmt) {
                        const idx = this.comments.findIndex(x => x.id == id)
                        cmt.solved = true
                        this.$set(this.comments, idx, cmt)
                        await this.$http.put('spec_comments/solve/' + id)
                    }
                } catch (err) {
                    console.log(err)
                }
            },        
            
            async onDeleteComment(e, id) {
                try {
                    e.toggleLoading(true)
                    await this.$http.delete('spec_comments/' + id)
                    await this.fetchSpec(true)

                    this.$toast.success("Deleted an comment successfully!")
                } catch (err) {
                    console.log(err)
                    this.$toast.error("Something went wrong!")
                } finally {
                    e.toggleLoading(false)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.avatar {
    width: 36px;
    height: 36px;
    overflow: hidden;
    position: relative;
    border-radius: 50%;
    border: 1px solid var(--light)
}

.spec-content {
   white-space: pre-wrap; 
   word-wrap: break-word; 
   font-family: inherit
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>