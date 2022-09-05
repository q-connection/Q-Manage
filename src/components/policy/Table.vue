<template>
<div>
    <table-default
        ref="table"
        :columns="columns"
        :config="tableConfig"
        :show-columns="false"
        searchable
        :selectable="!viewOnly"
        hover
    >
        <template slot="tableHeadActions" slot-scope="{selected}" v-if="!viewOnly">
            <b-button 
                variant="outline-primary" 
                size="sm" 
                class="p-2"
                v-if="$hasPermission('policy.create')"
                @click="$bvModal.show('modal-policy')"
            >
                Create
            </b-button>
            <b-button 
                variant="outline-danger" 
                size="sm" 
                class="p-2 ml-2"
                v-if="$hasPermission('policy.destroy')"
                @click="handleDeleteClicked(selected)"
                :disabled="selected.length <= 0"
            >
                Delete
            </b-button>
        </template>
        <template slot="row-id" slot-scope="{row}">
            <div class="text-break d-flex align-items-center">
                <div class="d-flex justify-content-end mr-2" :style="`width: ${viewOnly ? 60 : 40}px`">
                    <span class="h3 mb-0 mr-1 text-warning" v-if="row.high_priority" style="line-height: 0">
                        <q-icon icon="ant-design:star-filled"/>
                    </span>
                    <span class="h3 mb-0" style="line-height: 0">
                        <q-icon icon="carbon:policy"/>
                    </span>
                </div>
                <div>
                    <div class="font-weight-bold">{{ row.name }}</div>
                    <div>{{ row.description.substring(0, 100) }}...</div>
                    <div class="small mt-2">{{ $mm(row.created_at).format('DD/MM/YYYY HH:mm:ss') }}</div>
                </div>
            </div>
        </template>
        <template slot="row-action">
            <span class="h3 text-warning text-cursor">
                <b-icon icon="eye-fill"/>
            </span>
        </template>
    </table-default>   
    <b-modal id="modal-policy" size="xl" hide-header hide-footer @hide="modalData = null" v-if="!viewOnly">
        <div class="p-3">
            <modal-custom-header modal-id="modal-policy" title="CREATE / EDIT"/>
            <FormPolicy :data="modalData" @submit="handleSubmit" :isSubmitting="isSubmitting"/>
        </div>
    </b-modal>    
</div>
</template>

<script>
    import FormPolicy from './Form.vue'

    export default {
        name: 'TablePolicy',
        components: {FormPolicy},

        props: {
            viewOnly: {
                type: Boolean,
                default: false
            }
        },

        data: () => ({
            isSubmitting: false,
            modalData: null
        }),

        computed: {
            tableConfig() {
                return {
                    url: 'policies'
                }
            },

            columns() {
                return [
                    {label: "ID", name: "id", rowClass: 'text-cursor', width: '90%', rowClicked: this.handleEditClicked},
                    {label: "Action", name: "action", width: this.viewOnly ? '5%' : '5%', rowClicked: this.handleEditClicked},                    
                ]
            }
        },
        
        methods: {
            async handleSubmit({formData, refs}) {
                try {
                    this.isSubmitting = true
                    let resp = {}

                    if(this.modalData) {
                        resp = await this.$http.post('policies/' + this.modalData.id, formData)
                    } else {
                        resp = await this.$http.post('policies', formData)
                    }

                    const data = resp.data

                    if(!data.error) {
                        this.$showAlert({type: 'success', message: 'Your update has been saved successfully'})
                        this.$bvModal.hide('modal-policy')
                        this.$refs.table.refresh(true)
                    }
                } catch (err) {
                    console.log(err)

                    if(err.response && err.response.status == 422) {
                        this.$parseResponseErrors(refs, err.response.data.data)
                    }

                    if(err.response && err.response.status != 422) {
                        this.$showAlert({type: 'danger', message: err.response.data.message})
                    }
                } finally {
                    this.isSubmitting = false
                }
            },

            handleEditClicked(data) {
                if(this.viewOnly) {
                    this.$router.push({name: 'view-policy', params: {id: data.id}})
                    return
                }
                
                this.modalData = data
                this.$bvModal.show('modal-policy')
            },     
            
            async handleDeleteClicked(selected) {
                if(selected.length <= 0) {
                    return
                }

                this.$showAlert({
                    type: 'confirm', 
                    title: "Warning!", 
                    icon: 'ant-design:warning-filled',
                    message: 'Do you really want to delete these records?<br/>This process cannot be undone.',
                    callback: async ({dismiss}) => {
                        try {
                            const { data } = await this.$http.post('policies/delete', {items: selected})

                            if(!data.error) {
                                this.$showAlert({type: 'success', message: "Deleted select items successfully"})
                                await this.$refs.table.refresh(true)
                            } else {
                                dismiss(true)
                            }
                        } catch (err) {
                            console.log(err)
                            this.$showAlert({type: 'danger', message: "Something went wrong"})
                        }
                    }
                })
            },            
        }
    }
</script>

<style lang="scss" scoped>

</style>