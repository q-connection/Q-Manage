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
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h5 class="mb-0">CREATE / EDIT</h5>
                    <span class="h3 text-danger text-cursor" @click="$bvModal.hide('modal-announcement')">
                        <b-icon icon="x-circle"/>
                    </span>
                </div>
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

            handleDeleteClicked() {

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
                        resp = await this.$http.post('annoucements/' + this.modalData.id, formData)
                    } else {
                        resp = await this.$http.post('annoucements', formData)
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