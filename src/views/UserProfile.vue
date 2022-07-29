<template>
    <b-container fluid>
        <b-row class="mb-3">
            <b-col cols=12 xl=3 lg=2 v-if="!$device.mobile">
                <user-info-block/>
            </b-col>
            <b-col cols="12" xl=9 lg=10>
                <user-profile-form :user="$user" :is-submitting="isSubmitting" @submit="onSubmit">
                    <template slot="submitContent">
                        <div class="d-flex justify-content-between align-items-center" v-if="!$device.mobile">
                            <div>
                                <div class="mb-1">
                                    <a href="javascript:;" @click="showContractDetail">
                                        <q-icon icon="clarity:contract-solid" style="font-size: 18px"/>
                                        Contract
                                    </a>
                                </div>
                                <div>
                                    <router-link :to="{name: 'secutiry'}">
                                        <q-icon icon="teenyicons:password-solid" style="font-size: 18px"/>
                                        Change password
                                    </router-link>
                                </div>
                            </div>
                            <!-- 
                            <form-button type="submit" variant="primary" :disabled="!$hasPermission('employee.edit') || isSubmitting" :loading="isSubmitting" loading-without-hidden-text>
                                SAVE
                            </form-button>  
                            -->
                        </div>   
                        <!-- <div v-else>
                            <form-button :block="true" type="submit" variant="primary" :disabled="!$hasPermission('employee.edit') || isSubmitting" :loading="isSubmitting" loading-without-hidden-text>
                                SAVE
                            </form-button>                                                                
                        </div>  -->
                    </template>
                </user-profile-form>
            </b-col>
        </b-row>
        <b-modal id="modal-contracts" hide-footer size="lg">
            <template #modal-title>
                Contracts Detail
            </template>
            <div class="contract-wrapper">
                <b-table-simple bordered hover small caption-top responsive>
                    <b-thead>
                        <b-tr>
                            <b-th>Type</b-th>
                            <b-th>Start Date</b-th>
                            <b-th>End Date</b-th>
                            <b-th>Salary</b-th>
                            <b-th></b-th>
                        </b-tr>
                    </b-thead>
                    <b-tbody>
                        <b-tr v-for="(contract, index) in contracts" :key="index">
                            <b-td>{{ contract.contract_type }}</b-td>
                            <b-td>{{ contract.contract_start_date }}</b-td>
                            <b-td>{{ contract.contract_end_date }}</b-td>
                            <b-td>{{ $formatCurrency(contract.contract_salary) }}</b-td>
                            <b-td class="text-center" :id="`contract_${contract.id}`">
                                <a :href="contract.document_url" class="h5 text-primary text-cursor download" v-if="contract.document_url">
                                    <b-icon id="download" icon="download"/>
                                </a>
                                <div class="h5 text-danger">
                                    <b-icon icon="x"/>
                                </div>
                            </b-td>
                        </b-tr>
                    </b-tbody>
                </b-table-simple>
            </div>
        </b-modal>  
        <div class="fixed-content" v-if="$device.mobile">
            <div class="mb-1">
                <a href="javascript:;" @click="showContractDetail">
                    <q-icon icon="clarity:contract-solid" style="font-size: 18px"/>
                    Contract
                </a>
            </div>
            <div>
                <router-link :to="{name: 'secutiry'}">
                    <q-icon icon="teenyicons:password-solid" style="font-size: 18px"/>
                    Change password
                </router-link>
            </div>
        </div>               
    </b-container>
</template>

<script>
    export default {
        data: () => ({
            isSubmitting: false,
            contracts: [],          
        }),

        methods: {
            async onSubmit({formData, refs}) {
                if(!this.$hasPermission('employee.edit')) {
                    return
                }

                try {
                    this.isSubmitting = true
                    const { data } = await this.$http.post('employee/update-profile', formData)

                    if(!data.error) {
                        this.$showAlert({type: 'success', message: 'Updated profile successfully!'})
                    }
                } catch (err) {
                    console.log(err)

                    if(err.response && err.response.status == 422) {
                        this.$showAlert({type: 'danger', message: "An error occurred while updating information, please check."})
                        this.$parseResponseErrors(refs, err.response.data.data)
                    }

                    if(err.response && err.response.status != 422) {
                        this.$showAlert({type: 'danger', message: err.response.data.message})
                    }
                } finally {
                    this.isSubmitting = false
                }
            },

            showContractDetail() {
                this.$showAlert({
                    type: 'confirm', 
                    title: "View Contract", 
                    message: 'Enter your password and click CONFIRM to view contract detail',
                    require_password: true,
                    callback: async ({dismiss, password}) => {
                        try {
                            const { data } = await this.$http.post("employee/contracts", {password})
                            
                            if(data.error) {
                                this.$showAlert({type: 'danger', message: data.message})
                            } else {
                                dismiss()
                                this.contracts = data.data
                                this.$bvModal.show('modal-contracts')
                            }
                        } catch (err) {
                            console.log(err)
                            
                            if(err.response && err.response.data) {
                                this.$showAlert({type: 'danger', message: err.response.data.message})
                            }
                        }
                    }
                })
            },

            async viewContract(id) {
                const elem = document.getElementById('contract_' + id)

                try {
                    elem.querySelector('.loading').classList.remove('d-none')
                    elem.querySelector('.download').classList.add('d-none')

                    const { data } = await this.$http.get("employee/view-contract/" + id, {responseType: 'blob'})
                    window.open(URL.createObjectURL(data))
                } catch (err) {
                    console.log(err)
                    
                    this.$showAlert({type: 'danger', message: "Something went wrong, please try again later."})
                } finally {
                    elem.querySelector('.download').classList.remove('d-none')
                    elem.querySelector('.loading').classList.add('d-none')                    
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.fixed-content {
    position: fixed;
    bottom: 55px;
    left: 0;
    height: 90px;
    padding: .75rem;
    background: #fff;
    width: 100%;
    box-shadow: 0 -3px 5px rgba(0, 0, 0, .1);
}

.contract-wrapper {
    tr {
        td {
            vertical-align: middle;
        }
    }
}
</style>