<template>
    <b-card class="mb-5 card-profile" :class="{mobile: $device.mobile === true}" :title="cardTitle">
        <validation-observer ref="profileForm" v-slot="{handleSubmit}">
            <b-form @submit.prevent="handleSubmit(onSubmit)">
                <b-tabs v-model="tabIndex" fill>
                    <b-tab title="Basic Information">
                        <b-row class="align-items-center">
                            <b-col cols=12 xl=3 lg=3>
                                <div class="d-flex justify-content-center">
                                    <validation-provider 
                                        tag="div" 
                                        rules="ext:jpg,jpeg,png|size:3072" 
                                        name="avatar" 
                                        ref="avatar" 
                                        class="avatar"
                                        v-slot="{errors, valid}"
                                    >
                                        <form-image-upload
                                            v-model="formData.avatar"
                                            :preview-url="formData.avatar_url"
                                            :state="$isValid(errors, valid)"
                                            avatar
                                        />
                                        <div class="text-danger text-center mt-1 small">
                                            {{ errors[0] }}
                                        </div>
                                    </validation-provider>
                                </div>
                            </b-col>
                            <b-col cols=12 xl=9 lg=9>
                                <b-row>
                                    <validation-provider tag="div" class="col-12 col-xl-6 col-lg-6" rules="required|max:30" name="last_name" ref="last_name" v-slot="{errors, valid}">
                                        <b-form-group 
                                            label="Last name" 
                                            :invalid-feedback="errors[0]" 
                                            :state="$isValid(errors, valid)"
                                            label-class="font-weight-medium label-required"
                                        >
                                            <b-form-input v-model="formData.last_name" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                    <validation-provider tag="div" class="col-12 col-xl-6 col-lg-6" rules="required|max:30" name="first_name" ref="first_name" v-slot="{errors, valid}">
                                        <b-form-group 
                                            label="First name" 
                                            :invalid-feedback="errors[0]" 
                                            :state="$isValid(errors, valid)"
                                            label-class="font-weight-medium label-required"
                                        >
                                            <b-form-input v-model="formData.first_name" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-6 col-lg-6" rules="required|alpha_num" name="username" ref="username" v-slot="{errors, valid}">
                                        <b-form-group 
                                            label="Username" 
                                            :invalid-feedback="errors[0]" 
                                            :state="$isValid(errors, valid)"
                                            label-class="font-weight-medium label-required"
                                        >
                                            <b-form-input v-model="formData.username" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                        </b-form-group>
                                        </validation-provider>
                                    <validation-provider tag="div" class="col-12 col-xl-6 col-lg-6" rules="required|email" name="email" ref="email" v-slot="{errors, valid}">
                                        <b-form-group 
                                            label="Email" 
                                            :invalid-feedback="errors[0]" 
                                            :state="$isValid(errors, valid)"
                                            label-class="font-weight-medium label-required"
                                        >
                                            <b-form-input v-model="formData.email" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                    <validation-provider tag="div" class="col-12 col-xl-6 col-lg-6" rules="required|digits:10" name="phone" ref="phone" v-slot="{errors, valid}">
                                        <b-form-group 
                                            label="Phone number" 
                                            :invalid-feedback="errors[0]" 
                                            :state="$isValid(errors, valid)"
                                            label-class="font-weight-medium label-required"
                                        >
                                            <b-form-input v-model="formData.phone" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                        </b-form-group>
                                    </validation-provider>
                                    <validation-provider tag="div" class="col-12 col-xl-6 col-lg-6" rules="required" name="dob" ref="dob" v-slot="{errors, valid}">
                                        <b-form-group 
                                            label="Date of birth" 
                                            :invalid-feedback="errors[0]" 
                                            :state="$isValid(errors, valid)"
                                            label-class="font-weight-medium label-required"
                                        >
                                            <b-form-datepicker 
                                                v-model="formData.dob" 
                                                :readonly="!$hasPermission('employee.edit') || readonly" 
                                                :state="$isValid(errors, valid)"
                                                :date-format-options="{year: 'numeric', month: 'numeric', day: 'numeric'}"
                                                locale="vi"
                                            >
                                            </b-form-datepicker>
                                        </b-form-group>     
                                    </validation-provider>                           
                                    <validation-provider tag="div" class="col-12" rules="required|oneOf:male,female" name="gender" ref="gender" v-slot="{errors, valid}">
                                        <b-form-group 
                                            label="Gender" 
                                            :invalid-feedback="errors[0]" 
                                            :state="$isValid(errors, valid)"
                                            label-class="font-weight-medium label-required"
                                        >
                                            <b-form-radio-group 
                                                v-model="formData.gender"
                                            >
                                                <b-form-radio value="male">Male</b-form-radio>
                                                <b-form-radio value="female">Female</b-form-radio>
                                            </b-form-radio-group>
                                        </b-form-group>     
                                    </validation-provider>                           
                                </b-row>
                            </b-col>
                        </b-row>
                    </b-tab>
                    <b-tab title="Identify">
                        <b-row>
                            <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="numeric" name="id_number" ref="id_number" v-slot="{errors, valid}">
                                <b-form-group label="ID Number" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-form-input v-model="formData.id_number" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                </b-form-group>
                            </validation-provider>
                            <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" name="id_issuance_date" ref="id_issuance_date" v-slot="{errors, valid}">
                                <b-form-group label="ID Issuance at" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-form-datepicker 
                                        v-model="formData.id_issuance_date" 
                                        :readonly="!$hasPermission('employee.edit') || readonly" 
                                        :state="$isValid(errors, valid)"
                                        :date-format-options="{year: 'numeric', month: 'numeric', day: 'numeric'}"
                                        locale="vi"
                                    >
                                    </b-form-datepicker>                                            
                                </b-form-group>
                            </validation-provider>      
                            <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" name="id_issued_by" ref="id_issued_by" v-slot="{errors, valid}">                  
                                <b-form-group label="ID Issue By" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-form-input v-model="formData.id_issued_by" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                </b-form-group>  
                            </validation-provider>
                        </b-row>
                    </b-tab>
                    <b-tab title="Address">
                        <b-row>
                            <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" name="permanent_city" ref="permanent_city" v-slot="{errors, valid}">
                                <b-form-group label="Permanent city" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-select2
                                        v-model="formData.permanent_city"
                                        :disabled="!$hasPermission('employee.edit') || readonly || readonly"
                                        :options="cities"
                                        :reduce="loc => loc.value"
                                    />
                                </b-form-group>
                            </validation-provider>
                            <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" name="permanent_district" ref="permanent_district" v-slot="{errors, valid}">
                                <b-form-group label="Permanent district" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-select2
                                        v-model="formData.permanent_district"
                                        :disabled="!$hasPermission('employee.edit') || readonly || readonly"
                                        :options="districts"
                                        :reduce="loc => loc.value"
                                    />                                            
                                </b-form-group>      
                            </validation-provider>   
                            <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" name="permanent_ward" ref="permanent_ward" v-slot="{errors, valid}">
                                <b-form-group label="Permanent ward" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-select2
                                        v-model="formData.permanent_ward"
                                        :disabled="!$hasPermission('employee.edit') || readonly || readonly"
                                        :options="wards"
                                        :reduce="loc => loc.value"
                                    />    
                                </b-form-group>       
                            </validation-provider>          
                            <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" name="permanent_address" ref="permanent_address" v-slot="{errors, valid}">
                                <b-form-group label="Permanent address" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-form-input v-model="formData.permanent_address" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                </b-form-group>        
                            </validation-provider>   
                            <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" name="residence_city" ref="residence_city" v-slot="{errors, valid}">
                                <b-form-group label="Residence city" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-select2
                                        v-model="formData.residence_city"
                                        :disabled="!$hasPermission('employee.edit') || readonly || readonly"
                                        :options="residence_cities"
                                        :reduce="loc => loc.value"
                                    />  
                                </b-form-group>
                            </validation-provider>
                            <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" name="residence_district" ref="residence_district" v-slot="{errors, valid}">
                                <b-form-group label="Residence district" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-select2
                                        v-model="formData.residence_district"
                                        :disabled="!$hasPermission('employee.edit') || readonly || readonly"
                                        :options="residence_districts"
                                        :reduce="loc => loc.value"
                                    />  
                                </b-form-group>     
                            </validation-provider>    
                            <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" name="residence_ward" ref="residence_ward" v-slot="{errors, valid}">
                                <b-form-group label="Residence ward" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-select2
                                        v-model="formData.residence_ward"
                                        :disabled="!$hasPermission('employee.edit') || readonly || readonly"
                                        :options="residence_wards"
                                        :reduce="loc => loc.value"
                                    />  
                                </b-form-group>      
                            </validation-provider>            
                            <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" name="residence_address" ref="residence_address" v-slot="{errors, valid}">
                                <b-form-group label="Residence address" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-form-input v-model="formData.residence_address" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                </b-form-group>  
                            </validation-provider>
                        </b-row>
                    </b-tab>
                    <b-tab title="Bank">
                        <b-row>
                            <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="numeric|max:30" name="bank_account" ref="bank_account" v-slot="{errors, valid}">
                                <b-form-group label="Bank account id" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-form-input v-model="formData.bank_account" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                </b-form-group>
                            </validation-provider>
                            <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="max:30" name="bank_name" ref="bank_name" v-slot="{errors, valid}">
                                <b-form-group label="Bank name" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-form-input v-model="formData.bank_name" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                </b-form-group>         
                            </validation-provider>  
                            <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="max:30" name="bank_branch" ref="bank_branch" v-slot="{errors, valid}">
                                <b-form-group label="Bank branch" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-form-input v-model="formData.bank_branch" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                </b-form-group>        
                            </validation-provider>
                            <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="max:30" name="bank_city" ref="bank_city" v-slot="{errors, valid}">
                                <b-form-group label="Bank city" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-form-input v-model="formData.bank_city" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                </b-form-group>
                            </validation-provider>
                        </b-row>
                    </b-tab>
                    <b-tab title="Other">
                        <b-row>
                            <validation-provider tag="div" class="col-12 col-xl-6 col-lg-6" rules="numeric|max:30" name="social_insurance_number" ref="social_insurance_number" v-slot="{errors, valid}">
                                <b-form-group label="Social insurance number" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-form-input v-model="formData.social_insurance_number" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                </b-form-group>     
                            </validation-provider>
                            <validation-provider tag="div" class="col-12 col-xl-6 col-lg-6" rules="numeric|max:30" name="personal_tax_code" ref="personal_tax_code" v-slot="{errors, valid}">
                                <b-form-group label="Personal tax code" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                    <b-form-input v-model="formData.personal_tax_code" :readonly="!$hasPermission('employee.edit') || readonly" :state="$isValid(errors, valid)"></b-form-input>
                                </b-form-group> 
                            </validation-provider>
                        </b-row>
                    </b-tab>
                    <b-tab @click="onViewContracts" v-if="!creating">
                        <template #title>
                            <span>
                                Contracts
                                <q-icon icon="wpf:key-security"/>
                            </span>                            
                        </template>
                        <div class="mb-3">
                            <ContractForm :user_id="user ? user.id : null" @added="onAddedNewContract"/>
                        </div>
                        <div class="px-1">
                            <table-default
                                :columns="contractColumns"
                                :config="contractTableConfig"
                                :show-columns="false"
                                hover   
                                responsive
                                v-if="contract_pwd && contractSecurityPassed" 
                            >
                                <template slot="row-contract_type" slot-scope="{row}">
                                    <div class="d-flex align-items-center">
                                        <div class="h2 mb-0 mr-2 text-primary" style="line-height: 0">
                                            <q-icon icon="clarity:contract-solid"/>
                                        </div>
                                        <div class="font-weight-bold" v-if="row.contract_type == 'official'">Official Contract</div>
                                        <div class="font-weight-bold" v-if="row.contract_type == 'freelancer'">Freelancer Contract</div>
                                        <div class="font-weight-bold" v-if="row.contract_type == 'probation'">Probation Contract</div>
                                    </div>
                                </template>
                                <template slot="row-contract_start_date" slot-scope="{row}">
                                    <div style="min-width: 120px">
                                        <div class="d-flex">
                                            <span class="font-weight-medium small d-none d-xl-block d-lg-block" style="width: 60px">Start Date:</span> 
                                            <span class="font-weight-bold text-primary ml-2">{{ row.contract_start_date }}</span>
                                        </div>
                                        <div class="d-flex">
                                            <span class="font-weight-medium small d-none d-xl-block d-lg-block" style="width: 60px">End Date:</span> 
                                            <span class="font-weight-bold text-primary ml-2">{{ row.contract_end_date }}</span>
                                        </div>
                                    </div>
                                </template>
                                <template slot="row-contract_salary" slot-scope="{row}">
                                    <div class="d-flex align-items-center" style="min-width: 120px">
                                        <div class="h2 mb-0 mr-2 text-primary" style="line-height: 0">
                                            <q-icon icon="dashicons:money-alt"/>
                                        </div>
                                        <div class="font-weight-bold mb-0" style="line-height: 0">
                                             {{ $formatCurrency(row.contract_salary, 'VND') }}
                                        </div>
                                    </div>                                    
                                </template>
                                <template slot="row-action" slot-scope="{row}">
                                    <a class="text-primary" :href="row.document_url || 'javascript:;'" target="_blank">
                                        <span class="h1 mb-0" style="line-height: 0">
                                            <q-icon icon="wpf:view-file"/>
                                        </span> 
                                    </a>
                                </template>
                            </table-default>                          
                        </div>
                    </b-tab>
                </b-tabs>
                <slot name="submitContent">
                    <div class="d-flex justify-content-between mt-3">
                        <router-link :to="{name: 'hrm-employees'}" class="btn btn-dark">
                            <div class="d-flex align-items-center justify-content-center mt-1">
                                <q-icon icon="eva:arrow-ios-back-outline"/>
                                BACK
                            </div>
                        </router-link>
                        <form-button type="submit" variant="primary" style="width: 250px; max-width: 50%" :disabled="!$hasPermission('employee.edit') || readonly || isSubmitting" :loading="isSubmitting" loading-without-hidden-text>
                            SAVE
                        </form-button>                      
                    </div>
                </slot>   
            </b-form>
        </validation-observer>                                    
    </b-card>
</template>

<script>
    import ContractForm from '@/components/employee/ContractForm.vue'

    export default {
    components: { ContractForm },
        props: {
            user: {
                type: [Object, String],
                default: ''
            },

            isSubmitting: {
                type: Boolean,
                default: false
            },

            title: {
                type: String,
                default: ''
            },

            readonly: {
                type: Boolean,
                default: false
            },

            creating: {
                type: Boolean,
                default: true
            }
        },

        data: () => ({
            cities: [],
            districts: [],
            wards: [],
            residence_cities: [],
            residence_districts: [],          
            residence_wards: [],          
            contractSecurityPassed: false,  
            tabIndex: 0,
            contract_pwd: '',
            formData: {
                avatar: null,
                avatar_url: '',
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
                personal_tax_code: '',
                gender: 'male'
            },
            contractColumns: [
                {label: "Type", name: 'contract_type'},
                {label: "Duration", name: 'contract_start_date'},
                {label: "Salary", name: 'contract_salary'},
                {label: "Action", name: 'action'},
            ]          
        }),

        computed: {
            cardTitle() {
                return this.title || this.user.fullname
            },

            contractTableConfig() {
                return {
                    url: 'employee/contracts',
                    method: 'post',
                    params: {
                        password: this.contract_pwd,
                        user_id: this.user ? this.user.id : ''
                    }
                }
            }             
        },

        watch: {
            async 'formData.permanent_city'(city_id) {
                if(city_id) {            
                    await this.fetchLocation({type: 'districts', city_id}, 'districts')

                    if(city_id != this.user.permanent_city) {
                        this.formData.permanent_district = null
                        this.formData.permanent_ward = null                                
                    }
                }
            },
            async 'formData.permanent_district'(district_id) {
                if(district_id) {
                    await this.fetchLocation({type: 'wards', city_id: this.formData.permanent_city, district_id}, 'wards')

                    if(district_id != this.user.permanent_district) {
                        this.formData.permanent_ward = null   
                    }
                }
            },
            async 'formData.residence_city'(city_id) {
                if(city_id) {                      
                    await this.fetchLocation({type: 'districts', city_id}, 'residence_districts')     

                    if(city_id != this.user.residence_city) {
                        this.formData.residence_district = null
                        this.formData.residence_ward = null                                
                    }                    
                }
            },
            async 'formData.residence_district'(district_id) {
                if(district_id) {
                    await this.fetchLocation({type: 'wards', city_id: this.formData.residence_city, district_id}, 'residence_wards')

                    if(district_id != this.user.residence_district) {
                        this.formData.residence_ward = null                                
                    }                       
                }
            },
            user(newval) {
                if(typeof newval == 'object') {
                    this.initUser()
                }
            }
        },        

        async mounted() {
            this.initUser()

            await this.fetchLocation({type: 'cities'}, 'cities')
            await this.fetchLocation({type: 'cities'}, 'residence_cities')            
        },

        methods: {
            initUser() {
                if(Object.keys(this.user).length > 0) {
                    Object.keys(this.formData).forEach(key => {
                        if(['dob', 'id_issuance_date'].includes(key)) {
                            this.formData[key] = this.$mm(this.user[key], "DD-MM-YYYY").format('YYYY-MM-DD')
                        } else {
                            if(key != 'avatar') {
                                this.formData[key] = this.user[key]
                            }
                        }
                    })
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

            onSubmit() {
                const formData = Object.assign({}, this.formData)

                this.$emit('submit', {formData: this.$objToFormData(formData), refs: this.$refs})
            },

            async fetchContracts({dismiss, password}) {
                try {
                    const { data } = await this.$http.post("employee/verify-permission", {password, permission: 'employee.edit'})
                    
                    if(data.error) {
                        this.$showAlert({type: 'danger', message: data.message})
                    } else {
                        if(typeof dismiss == 'function') {
                            dismiss()
                        }

                        this.contract_pwd = password
                        this.contractSecurityPassed = true
                        this.tabIndex = 5
                    }
                } catch (err) {
                    console.log(err)
                    
                    if(err.response && err.response.data) {
                        this.$showAlert({type: 'danger', message: err.response.data.message})
                    }
                }
            },

            async onAddedNewContract() {
                await this.fetchContracts({password: this.contract_pwd})
            },

            onViewContracts() {
                this.$nextTick(() => {
                    this.tabIndex = 0
                })

                if(this.contractSecurityPassed) {
                    return
                }

                this.$showAlert({
                    type: 'confirm', 
                    title: "View Contract", 
                    message: 'Enter your password and click CONFIRM to view contract detail',
                    require_password: true,
                    callback: this.fetchContracts
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
.avatar {
    width: 240px;
    height: 240px;
}
</style>