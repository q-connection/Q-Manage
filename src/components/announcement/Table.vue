<template>
    <div>
        <b-table-simple id="table-announcements" hover responsive>
            <b-thead>
                <b-tr>
                    <b-td width="4%" v-if="!onlyView">
                        <b-form-checkbox :checked="selected.length == announcements.length && announcements.lenth > 0" @change="toggleSelectAll">
                            All
                        </b-form-checkbox>
                    </b-td>
                    <b-td colspan="3" class="px-0">
                        <div 
                            class="d-flex align-items-center" 
                            :class="{'justify-content-between': onlyView === false, 'justify-content-end': onlyView === true}"
                        >
                            <div class="d-flex" v-if="!onlyView">
                                <b-button class="mr-2 p-2" variant="outline-primary" size="sm" @click="$emit('onCreate', $event)" v-if="$hasPermission('announcement.create')">
                                    Create
                                </b-button>
                                <form-button 
                                    class="p-2" 
                                    variant="outline-danger" 
                                    size="sm" 
                                    @click="onDelete" 
                                    v-if="$hasPermission('announcement.destroy')"
                                    :loading="deleteLoading"
                                    :disabled="deleteLoading"
                                    loading-without-hidden-tetxt
                                >
                                    Delete
                                </form-button>
                            </div>
                            <div>
                                <form-input-group class="d-none d-xl-block d-lg-block">
                                    <b-form-input class="input-search" style="min-width: 285px; min-height: 40px" placeholder="Search..." v-model.lazy="queryParams.search"></b-form-input>
                                    <template #append>
                                        <span class="h3">
                                            <q-icon icon="bx:search-alt"/>
                                        </span>
                                    </template>
                                </form-input-group>
                            </div>
                        </div>
                    </b-td>
                </b-tr>
            </b-thead>
            <b-tbody>
                <b-tr v-for="(anno, index) in announcements" :key="index">
                    <b-td width="4%" v-if="!onlyView">
                        <b-checkbox :checked="selected.includes(anno.id)" @change="toggleSelect(anno.id)"/>
                    </b-td>
                    <b-td width="5%" class="text-cursor" @click="$router.push({name: 'view-announcement', params: {id: anno.id}})" v-else>
                        <div class="rounded overflow-hidden">
                            <img :src="anno.thumbnail_url || '/images/image-placeholder.png'" style="width: 72px; height: 72px; object-fit: cover">
                        </div>
                    </b-td>
                    <b-td width="91%" class="text-cursor px-0" @click="$emit('onEdit', anno)" v-if="!onlyView">
                        <div class="text-break font-weight-bold d-flex">
                            <div class="d-flex justify-content-end mr-2" style="width: 40px">
                                <span class="h5 text-warning mr-1" v-if="anno.high_priority">
                                    <q-icon icon="ant-design:star-filled"/>
                                </span>
                                <span class="h5 text-danger">
                                    <q-icon icon="zondicons:announcement"/>
                                </span>
                            </div>
                            <div>{{ anno.title }}</div>
                        </div>
                    </b-td>
                    <b-td width="95%" class="text-cursor" @click="$router.push({name: 'view-announcement', params: {id: anno.id}})" v-else>
                        <div class="text-break font-weight-bold">
                            {{ anno.title }}
                        </div>
                        <div class="small mt-1">
                            {{ anno.short_description || '' }}
                        </div>
                        <div class="mt-3 small d-none d-xl-block d-lg-block">
                            {{ $mm(anno.created_at).format('LLL') }}
                        </div>                        
                    </b-td>
                    <b-td width="5%" v-if="!onlyView">
                        <div class="d-flex align-items-center">
                            <form-button-icon class="mr-1" variant="success" icon="icon-park-outline:email-push" @click="onPushMail($event, anno.id)"/>
                            <form-button-icon variant="warning" icon="bi:eye-fill" @click="newTab(anno.id)"/>   
                        </div>                            
                    </b-td>
                    <b-td width="5%" v-else>
                        <span class="h3 text-warning" v-if="anno.high_priority">
                            <q-icon icon="ant-design:star-filled"/>
                        </span>
                    </b-td>
                </b-tr>
                <b-tr v-if="announcements.length <= 0">
                    <b-td colspan="4">
                        <div class="text-center">
                            No records to show.
                        </div>
                    </b-td>
                </b-tr>
            </b-tbody>
        </b-table-simple>
        <div class="float-right">
            <b-pagination
                v-model="queryParams.page"
                :total-rows="total_rows"
                :per-page="queryParams.per_page"
                aria-controls="table-announcements"
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
    </div>             
</template>

<script>
    export default {
        name: 'TableAnnouncements',
        props: {
            onlyView: {
                type: Boolean,
                default: false
            }
        },

        data: () => ({
            total_rows: 3,
            announcements: [],
            selected: [],
            deleteLoading: false,
            queryParams: {
                per_page: 10,
                page: 1,
                search: ''
            }
        }),

        watch: {
            async 'queryParams.search'() {
                await this.fetchAnnouncements()
            },

            async 'queryParams.page'() {
                await this.fetchAnnouncements()
            },
        },

        async mounted() {
            await this.fetchAnnouncements()
        },
        
        methods: {
            async fetchAnnouncements() {
                try {
                    const { data } = await this.$http.get('announcements', {params: this.queryParams})

                    if(!data.error) {
                        this.announcements = data.data.data
                        this.total_rows = data.data.total
                    }
                } catch (err) {
                    console.log(err)
                }
            },

            async refresh(sync = false) {
                if(sync) {
                    this.selected = []
                    await this.fetchAnnouncements()
                }
            },

            toggleSelect(anno_id) {
                if(this.selected.includes(anno_id)) {
                    this.$delete(this.selected, this.selected.findIndex(x => x == anno_id))
                } else {
                    this.selected.push(anno_id)
                }
            },

            toggleSelectAll() {
                if(this.selected.length > 0) {
                    this.selected = []
                } else {
                    this.selected = this.announcements.map((x) => x.id)
                }
            },

            toggleDeleteLoading(loading = false) {
                this.deleteLoading = loading
            },

            onDelete() {
                if(this.selected.length <= 0) {
                    this.$showAlert({type: 'danger', message: 'Please select at least 1 item'})

                    return
                }

                this.$emit('onDelete', {items: this.selected, refresh: this.refresh, loading: this.toggleDeleteLoading})
            },

            newTab(id) {
                let routeData = this.$router.resolve({name: 'view-announcement', params: {id}});
                window.open(routeData.href, '_blank');                
            },

            onPushMail({toggleLoading}, id) {
                this.$showAlert({
                    type: 'confirm',
                    title: "Warning!",
                    message: 'Really, do you want to send this email? There is no reversing this process.',
                    callback: async ({dismiss}) => {
                        try {
                            toggleLoading(true)
                            const { data } = await this.$http.post('announcements/send-mail/' + id)

                            if(!data.error) {
                                dismiss(true)

                                this.$showAlert({
                                    type: 'success',
                                    message: 'Sent mail to employees successfully'
                                })
                            }
                        } catch (err) {
                            console.log(err)
                            this.$showAlert({
                                type: 'danger',
                                message: 'Something went wrong, please try again later'
                            })                    
                        } finally {
                            toggleLoading(false)
                        }
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.input-search {
    border: 1px solid #E0E0E0
}
</style>