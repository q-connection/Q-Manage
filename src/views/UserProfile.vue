<template>
    <b-container fluid>
        <b-row class="mb-3">
            <b-col cols=12 xl=3 lg=2 v-if="!$device.mobile">
                <user-info-block/>
            </b-col>
            <b-col cols="12" xl=9 lg=10>
                <b-card class="mb-5 card-profile" :class="{mobile: $device.mobile === true}" :title="$user.fullname">
                    <validation-observer ref="profileForm" v-slot="{handleSubmit}">
                        <b-form @submit.prevent="handleSubmit(onSubmit)">
                            <b-tabs content-class="mt-3" fill>
                                <b-tab title="Basic Information">
                                    <b-row>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="last_name" ref="last_name" v-slot="{errors, valid}">
                                            <b-form-group label="Last name" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.last_name" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="first_name" ref="first_name" v-slot="{errors, valid}">
                                            <b-form-group label="First name" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.first_name" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                         <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required|alpha_num" name="username" ref="username" v-slot="{errors, valid}">
                                            <b-form-group label="Username" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.username" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                         </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required|email" name="email" ref="email" v-slot="{errors, valid}">
                                            <b-form-group label="Email" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.email" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required|digits:10" name="phone" ref="phone" v-slot="{errors, valid}">
                                            <b-form-group label="Phone number" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.phone" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="dob" ref="dob" v-slot="{errors, valid}">
                                            <b-form-group label="Date of birth" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-datepicker 
                                                    v-model="formData.dob" 
                                                    :readonly="!$hasPermission('employee.edit')" 
                                                    :state="$isValid(errors, valid)"
                                                    :date-format-options="{year: 'numeric', month: 'numeric', day: 'numeric'}"
                                                    locale="vi"
                                                >
                                                </b-form-datepicker>
                                            </b-form-group>     
                                        </validation-provider>                           
                                    </b-row>
                                </b-tab>
                                <b-tab title="Identify">
                                    <b-row>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="id_number" ref="id_number" v-slot="{errors, valid}">
                                            <b-form-group label="ID Number" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.id_number" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="id_issuance_date" ref="id_issuance_date" v-slot="{errors, valid}">
                                            <b-form-group label="ID Issuance at" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-datepicker 
                                                    v-model="formData.id_issuance_date" 
                                                    :readonly="!$hasPermission('employee.edit')" 
                                                    :state="$isValid(errors, valid)"
                                                    :date-format-options="{year: 'numeric', month: 'numeric', day: 'numeric'}"
                                                    locale="vi"
                                                >
                                                </b-form-datepicker>                                            
                                            </b-form-group>
                                        </validation-provider>      
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="id_issued_by" ref="id_issued_by" v-slot="{errors, valid}">                  
                                            <b-form-group label="ID Issue By" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.id_issued_by" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>  
                                        </validation-provider>
                                    </b-row>
                                </b-tab>
                                <b-tab title="Address">
                                    <b-row>
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="required" name="permanent_city" ref="permanent_city" v-slot="{errors, valid}">
                                            <b-form-group label="Permanent city" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-select2
                                                    v-model="formData.permanent_city"
                                                    :disabled="!$hasPermission('employee.edit')"
                                                    :options="cities"
                                                    :reduce="loc => loc.value"
                                                />
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="required" name="permanent_district" ref="permanent_district" v-slot="{errors, valid}">
                                            <b-form-group label="Permanent district" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-select2
                                                    v-model="formData.permanent_district"
                                                    :disabled="!$hasPermission('employee.edit')"
                                                    :options="districts"
                                                    :reduce="loc => loc.value"
                                                />                                            
                                            </b-form-group>      
                                        </validation-provider>   
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="required" name="permanent_ward" ref="permanent_ward" v-slot="{errors, valid}">
                                            <b-form-group label="Permanent ward" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-select2
                                                    v-model="formData.permanent_ward"
                                                    :disabled="!$hasPermission('employee.edit')"
                                                    :options="wards"
                                                    :reduce="loc => loc.value"
                                                />    
                                            </b-form-group>       
                                        </validation-provider>          
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="required" name="permanent_address" ref="permanent_address" v-slot="{errors, valid}">
                                            <b-form-group label="Permanent address" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.permanent_address" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>        
                                        </validation-provider>   
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="required" name="residence_city" ref="residence_city" v-slot="{errors, valid}">
                                            <b-form-group label="Residence city" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-select2
                                                    v-model="formData.residence_city"
                                                    :disabled="!$hasPermission('employee.edit')"
                                                    :options="residence_cities"
                                                    :reduce="loc => loc.value"
                                                />  
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="required" name="residence_district" ref="residence_district" v-slot="{errors, valid}">
                                            <b-form-group label="Residence district" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-select2
                                                    v-model="formData.residence_district"
                                                    :disabled="!$hasPermission('employee.edit')"
                                                    :options="residence_districts"
                                                    :reduce="loc => loc.value"
                                                />  
                                            </b-form-group>     
                                        </validation-provider>    
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="required" name="residence_ward" ref="residence_ward" v-slot="{errors, valid}">
                                            <b-form-group label="Residence ward" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-select2
                                                    v-model="formData.residence_ward"
                                                    :disabled="!$hasPermission('employee.edit')"
                                                    :options="residence_wards"
                                                    :reduce="loc => loc.value"
                                                />  
                                            </b-form-group>      
                                        </validation-provider>            
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="required" name="residence_address" ref="residence_address" v-slot="{errors, valid}">
                                            <b-form-group label="Residence address" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.residence_address" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>  
                                        </validation-provider>
                                    </b-row>
                                </b-tab>
                                <b-tab title="Bank">
                                    <b-row>
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="numeric|max:30" name="bank_account" ref="bank_account" v-slot="{errors, valid}">
                                            <b-form-group label="Bank account id" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.bank_account" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="max:30" name="bank_name" ref="bank_name" v-slot="{errors, valid}">
                                            <b-form-group label="Bank name" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.bank_name" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>         
                                        </validation-provider>  
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="max:30" name="bank_branch" ref="bank_branch" v-slot="{errors, valid}">
                                            <b-form-group label="Bank branch" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.bank_branch" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>        
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="max:30" name="bank_city" ref="bank_city" v-slot="{errors, valid}">
                                            <b-form-group label="Bank city" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.bank_city" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                    </b-row>
                                </b-tab>
                                <b-tab title="Other">
                                    <b-row>
                                        <validation-provider tag="div" class="col-12 col-xl-6 col-lg-6" rules="numeric|max:30" name="social_insurance_number" ref="social_insurance_number" v-slot="{errors, valid}">
                                            <b-form-group label="Social insurance number" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.social_insurance_number" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>     
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-6 col-lg-6" rules="numeric|max:30" name="personal_tax_code" ref="personal_tax_code" v-slot="{errors, valid}">
                                            <b-form-group label="Personal tax code" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input v-model="formData.personal_tax_code" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group> 
                                        </validation-provider>
                                    </b-row>
                                </b-tab>
                            </b-tabs>
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

                                <form-button type="submit" variant="primary" :disabled="!$hasPermission('employee.edit') || isSubmitting" :loading="isSubmitting" loading-without-hidden-text>
                                    SAVE
                                </form-button> 
                            </div>   
                            <div v-else>
                                <form-button :block="true" type="submit" variant="primary" :disabled="!$hasPermission('employee.edit') || isSubmitting" :loading="isSubmitting" loading-without-hidden-text>
                                    SAVE
                                </form-button>                                                                
                            </div>    
                        </b-form>
                    </validation-observer>                           
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
                                <div class="text-primary text-cursor download" @click="viewContract(contract.id)">
                                    <b-icon id="download" icon="download"/>
                                </div>
                                <b-spinner class="loading d-none" small/>
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
            cities: [],
            districts: [],
            wards: [],
            residence_cities: [],
            residence_districts: [],          
            residence_wards: [],
            contracts: [],
            formData: {
                last_name: '',
                first_name: '',
                phone: '',
                email: '',
                username: '',
                dob: '',
                id_number: '',
                id_issuance_date: '',
                id_issued_by: '',
                permanent_city: '',
                permanent_district: '',
                permanent_ward: '',
                permanent_address: '',
                residence_city: '',
                residence_district: '',
                residence_ward: '',
                residence_address: '',
                bank_account: '',
                bank_name: '',
                bank_branch: '',
                bank_city: '',
                social_insurance_number: '',
                personal_tax_code: ''
            }            
        }),

        watch: {
            async 'formData.permanent_city'(city_id) {
                if(city_id) {            
                    await this.fetchLocation({type: 'districts', city_id}, 'districts')

                    if(city_id != this.$user.permanent_city) {
                        this.formData.permanent_district = null
                        this.formData.permanent_ward = null                                
                    }
                }
            },
            async 'formData.permanent_district'(district_id) {
                if(district_id) {
                    await this.fetchLocation({type: 'wards', city_id: this.formData.permanent_city, district_id}, 'wards')

                    if(district_id != this.$user.permanent_district) {
                        this.formData.permanent_ward = null   
                    }
                }
            },
            async 'formData.residence_city'(city_id) {
                if(city_id) {                      
                    await this.fetchLocation({type: 'districts', city_id}, 'residence_districts')     

                    if(city_id != this.$user.residence_city) {
                        this.formData.residence_district = null
                        this.formData.residence_ward = null                                
                    }                    
                }
            },
            async 'formData.residence_district'(district_id) {
                if(district_id) {
                    await this.fetchLocation({type: 'wards', city_id: this.formData.residence_city, district_id}, 'residence_wards')

                    if(district_id != this.$user.residence_district) {
                        this.formData.residence_ward = null                                
                    }                       
                }
            },
        },

        async mounted() {
            Object.keys(this.formData).forEach(key => {
                if(['dob', 'id_issuance_date'].includes(key)) {
                    this.formData[key] = this.$mm(this.$user[key], "DD-MM-YYYY").format('YYYY-MM-DD')
                } else {
                    this.formData[key] = this.$user[key]
                }
            })

            await this.fetchLocation({type: 'cities'}, 'cities')
            await this.fetchLocation({type: 'cities'}, 'residence_cities')
        },

        methods: {
            async onSubmit() {
                if(!this.$hasPermission('employee.edit')) {
                    return
                }

                try {
                    this.isSubmitting = true
                    const { data } = await this.$http.post('employee/update-profile', this.formData)

                    if(!data.error) {
                        this.$showAlert({type: 'success', message: 'Updated profile successfully!'})
                    }
                } catch (err) {
                    console.log(err)

                    if(err.response && err.response.status == 422) {
                        this.$showAlert({type: 'danger', message: "An error occurred while updating information, please check."})
                        this.$parseResponseErrors(this.$refs, err.response.data.data)
                    }

                    if(err.response && err.response.status != 422) {
                        this.$showAlert({type: 'danger', message: err.response.data.message})
                    }
                } finally {
                    this.isSubmitting = false
                }
            },

            async fetchLocation({type = 'cities', city_id = '', district_id = ''}, data_key) {
                try {
                    const city     = city_id ? '/' + city_id : '',
                          district = district_id ? '/' + district_id : '';

                    const { data } = await this.$http.get(`location/${type}${city}${district}`)

                    if(!data.error) {
                        this[data_key] = data.data
                    }
                } catch(err) {
                    console.log(err)
                }
            },

            showContractDetail() {
                this.$showAlert({
                    type: 'confirm', 
                    title: "View Contract", 
                    message: 'Enter your password and click CONFIRM to view contract detail',
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
</style>