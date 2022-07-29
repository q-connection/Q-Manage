<template>
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <div class="p-1">
                    <TableAnnouncements 
                        ref="table"
                        @onCreate="handleCreateClicked" 
                        @onDelete="handleDeleteClicked"
                        @onEdit="handleEditClicked"
                    />
                </div>
            </b-col>
        </b-row>
        <b-modal id="modal-announcement" size="xl" hide-header hide-footer @hide="modalData = null">
            <div class="p-3">
                <modal-custom-header modal-id="modal-announcement" title="CREATE / EDIT"/>
                <FormAnnouncements :data="modalData" @submit="handleSubmit" :isSubmitting="isSubmitting"/>
            </div>
        </b-modal>
    </b-container>
</template>

<script>
    import TableAnnouncements from '@/components/announcement/Table.vue'
    import FormAnnouncements from '@/components/announcement/Form.vue'

    export default {
        name: 'HrmAnnouncements',
        components: {TableAnnouncements, FormAnnouncements},
        data: () => ({
            isSubmitting: false,
            modalData: null
        }),

        async mounted() {
        },
        
        methods: {
            handleCreateClicked() {
                this.$bvModal.show('modal-announcement')
            },

            async handleDeleteClicked({items, refresh}) {
                this.$showAlert({
                    type: 'confirm', 
                    title: "Warning!", 
                    icon: 'ant-design:warning-filled',
                    message: 'Do you really want to delete these records?<br/>This process cannot be undone.',
                    callback: async ({dismiss}) => {
                        try {
                            const { data } = await this.$http.post('announcements/delete', {items})

                            if(!data.error) {
                                this.$showAlert({type: 'success', message: "Deleted select items successfully"})
                                await refresh(true)
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

            handleEditClicked(data) {
                this.modalData = data
                this.$bvModal.show('modal-announcement')
            },

            async handleSubmit({formData, refs}) {
                try {
                    this.isSubmitting = true
                    let resp = {}

                    if(this.modalData) {
                        resp = await this.$http.post('announcements/' + this.modalData.id, formData)
                    } else {
                        resp = await this.$http.post('announcements', formData)
                    }

                    const data = resp.data

                    if(!data.error) {
                        this.$showAlert({type: 'success', message: 'Your update has been saved successfully'})
                        this.$bvModal.hide('modal-announcement')
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
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>