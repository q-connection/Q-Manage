<template>
    <b-container fluid>
        <b-row class="mb-5">
            <b-col cols="12">
                <b-card class="user-profile-wrapper" :class="{mobile: $device.mobile}">
                    <div class="p-3">
                        <b-row>
                            <b-col cols=12 xl=2 lg=2>
                                <div class="d-flex justify-content-center">
                                    <div class="avatar-modal">
                                        <form-image-upload 
                                            @upload="onAvatarUpload"
                                            :preview-url="$user.avatar ? $user.avatar_url : null" 
                                            readonly
                                            avatar
                                        />
                                    </div>
                                </div>
                            </b-col>
                            <b-col cols=12 xl=10 lg=10>
                                <b-row>
                                    <b-col cols=12 xl=7 lg=7>
                                        <div class="d-flex mb-2 text-break flex-wrap">
                                            <div class="font-weight-bold text-title">Date Of Birth:</div>
                                            <div class="text-value">{{ $user.dob }}</div>
                                        </div>
                                    </b-col>
                                    <b-col cols=12 xl=5 lg=5>
                                        <div class="d-flex mb-2 flex-wrap">
                                            <div class="font-weight-bold text-title" style="min-width: 120px">Department:</div>
                                            <div class="text-value">{{ $user.departments ? $user.departments[0].name : 'N/A' }}</div>
                                        </div>
                                    </b-col>
                                    <b-col cols=12 xl=7 lg=7>
                                        <div class="d-flex mb-2 text-break flex-wrap">
                                            <div class="font-weight-bold text-title">Phone Number:</div>
                                            <div class="text-value">{{ $user.phone || 'N/A' }}</div>
                                        </div>
                                    </b-col>
                                    <b-col cols=12 xl=5 lg=5>
                                        <div class="d-flex mb-2 flex-wrap">
                                            <div class="font-weight-bold text-title" style="min-width: 120px">Title:</div>
                                            <div class="text-value">{{ $user.role_name }}</div>
                                        </div>
                                    </b-col>
                                    <b-col cols=12 xl=7 lg=7>
                                        <div class="d-flex mb-2 text-break flex-wrap">
                                            <div class="font-weight-bold text-title">Email:</div>
                                            <div class="text-value">{{ $user.email || 'N/A' }}</div>
                                        </div>
                                    </b-col>
                                    <b-col cols=12 xl=5 lg=5>
                                        <div class="d-flex mb-2 flex-wrap">
                                            <div class="font-weight-bold text-title" style="min-width: 120px">Contract:</div>
                                            <div class="text-break text-warning position-relative pb-4 pb-xl-0 pb-lg-0 pb-sm-3">
                                                <span v-if="$user.contract_type == 'freelancer'">Freelancer staff</span>
                                                <span v-if="$user.contract_type == 'official'">Official staff</span>
                                                <span v-if="$user.contract_type == 'probation'">Probation staff</span>
                                                <div class="position-absolute" style="width: 200px">
                                                    ({{ $user.contract_start_date || 'N/A' }} - {{ $user.contract_end_date || 'N/A' }})
                                                </div>
                                            </div>
                                        </div>
                                    </b-col>
                                    <b-col cols=12 xl=6 lg=6>
                                        <div class="d-flex mb-2 text-break flex-wrap">
                                            <div class="font-weight-bold text-title">ID Number:</div>
                                            <div class="text-value">{{ $user.id_number || 'N/A' }}</div>
                                        </div>
                                    </b-col>
                                    <b-col cols=12>
                                        <div class="d-flex mb-2 text-break flex-wrap">
                                            <div class="font-weight-bold text-title">Permanent Address:</div>
                                            <div class="text-value">{{ $user.permanent_full_address || 'N/A' }}</div>
                                        </div>
                                    </b-col>
                                    <b-col cols=12>
                                        <div class="d-flex mb-2 text-break flex-wrap">
                                            <div class="font-weight-bold text-title">Residence Address:</div>
                                            <div class="text-value">{{ $user.residence_full_address || 'N/A' }}</div>
                                        </div>
                                    </b-col>
                                    <b-col cols=12>
                                        <div class="d-flex mb-2 text-break flex-wrap">
                                            <div class="font-weight-bold text-title">Bank account information:</div>
                                            <div  class="text-value">
                                                {{ $user.bank_account || 'N/A' }} -
                                                {{ $user.bank_name || 'N/A' }} -
                                                {{ $user.bank_branch || 'N/A' }}
                                            </div>
                                        </div>
                                    </b-col>
                                    <b-col cols=12 v-show="!$device.mobile">
                                        <div class="d-flex">
                                            <div class="mr-4">
                                                <span class="text-primary text-cursor" @click="showContractDetail">
                                                    <q-icon icon="clarity:contract-solid" style="font-size: 18px"/>
                                                    Contract
                                                </span>   
                                            </div>
                                            <div>
                                                <span class="text-primary text-cursor" @click="$bvModal.show('modal-password')">
                                                    <q-icon icon="teenyicons:password-solid" style="font-size: 18px"/>
                                                    Change password
                                                </span>                                                
                                            </div>
                                        </div>                                                                            
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>                        
                    </div>
                </b-card>
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
        <b-modal id="modal-password" hide-header hide-footer>
            <div class="p-2">
                <modal-custom-header title="Change Password" modal-id="modal-password"/>
                <validation-observer ref="changePwForm" v-slot="{handleSubmit}">
                    <b-form @submit.prevent="handleSubmit(onSubmit)">
                        <b-row>
                            <validation-provider class="col-12" rules="required" v-slot="{errors}" name="current_password">
                                <b-form-group label="Current password" label-class="font-weight-medium label-required" :invalid-feedback="errors[0]" :state="errors[0] && errors[0].length <= 0">
                                    <b-form-input type="password" name="current_password" placeholder="Enter your current password" v-model="changePwData.current_password" :state="errors[0] && errors[0].length <= 0"/>
                                </b-form-group>
                            </validation-provider>
                        </b-row>
                        <b-row>
                            <validation-provider class="col-12"  rules="required|min:6|max:30" v-slot="{errors}" vid="confirmation" name="new_password">
                                <b-form-group label="New password" label-class="font-weight-medium label-required" :invalid-feedback="errors[0]" :state="errors[0] && errors[0].length <= 0" description="Min: 6 characters, Max: 30 characters">
                                    <b-form-input type="password" name="new_password" placeholder="Enter your new password" v-model="changePwData.new_password" :state="errors[0] && errors[0].length <= 0"/>
                                </b-form-group>
                            </validation-provider>
                        </b-row>
                        <b-row>
                            <validation-provider class="col-12"  rules="required|min:6|max:30|confirmed:confirmation" v-slot="{errors}" name="new_password_confirmation">
                                <b-form-group label="New password confirm" label-class="font-weight-medium label-required" :invalid-feedback="errors[0]" :state="errors[0] && errors[0].length <= 0">
                                    <b-form-input type="password" name="new_password_confirmation" placeholder="Re-enter your new password" v-model="changePwData.new_password_confirmation" :state="errors[0] && errors[0].length <= 0"/>
                                </b-form-group>
                            </validation-provider>
                        </b-row>
                        <div class="d-flex justify-content-end">
                            <form-button :block="$device.mobile" type="submit" variant="primary" :disabled="isSubmitting" :loading="isSubmitting" loading-without-hidden-text>
                                SUBMIT
                            </form-button>
                        </div>
                    </b-form>
                </validation-observer>                
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
            changePwData: {
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
            }            
        }),

        methods: {
            // async onSubmit({formData, refs}) {
            //     if(!this.$hasPermission('employee.edit')) {
            //         return
            //     }

            //     try {
            //         this.isSubmitting = true
            //         const { data } = await this.$http.post('employee/update-profile', formData)

            //         if(!data.error) {
            //             this.$showAlert({type: 'success', message: 'Updated profile successfully!'})
            //         }
            //     } catch (err) {
            //         console.log(err)

            //         if(err.response && err.response.status == 422) {
            //             this.$showAlert({type: 'danger', message: "An error occurred while updating information, please check."})
            //             this.$parseResponseErrors(refs, err.response.data.data)
            //         }

            //         if(err.response && err.response.status != 422) {
            //             this.$showAlert({type: 'danger', message: err.response.data.message})
            //         }
            //     } finally {
            //         this.isSubmitting = false
            //     }
            // },
            async onSubmit() {
                try {
                    this.isSubmitting = true
                    const { data } = await this.$http.post('employee/change-password', this.changePwData)

                    if(!data.error) {
                        this.$showAlert({type: 'success', message: "Change password successfully!"})

                        this.changePwData.current_password = ''
                        this.changePwData.new_password = ''
                        this.changePwData.new_password_confirmation = ''
                        this.$refs.changePwForm.reset()
                    } else {
                        this.$showAlert({type: 'danger', message: data.message})
                    }
                } catch (err) {
                    console.log(err)
                    
                    if(err.response.data) {
                        this.$showAlert({type: 'danger', message: err.response.data.message})
                    }
                } finally {
                    this.isSubmitting = false
                }
            },

            async onAvatarUpload({file, uploading}) {
                if(!file) return
                
                try {
                    uploading(true)
                    const formData = new FormData()
                    formData.append('avatar', file)
                    
                    const { data } = await this.$http.post('employee/update-avatar', formData)

                    if(!data.error) {
                        this.$showAlert({type: 'success', message: "Updated avatar successfully"})
                        await this.$store.dispatch('fetchUser')
                    } else {
                        this.$showAlert({type: 'danger', message: data.message})
                    }
                } catch (err) {
                    console.log(err)
                    if(err.response.data) {
                        this.$showAlert({type: 'danger', message: err.response.data.message})
                    }               
                } finally {
                    uploading(false)
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

.avatar-modal {
    width: 200px;
    height: 200px;
    max-width: 100%;
    overflow: hidden;
    margin-bottom: .75rem;
}

.text-title {
    min-width: 195px
}

.text-value {
    max-width: 100%;
    word-break: break-all;
}

@media only screen and (max-width: 990px) {
    .text-title {
        width: 100%;
    }
}
</style>