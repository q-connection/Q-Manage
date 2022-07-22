<template>
    <b-container fluid>
        <b-row>
            <b-col cols="12" xl=3 lg=2>
                <user-info-block/>
            </b-col>
            <b-col cols="12" xl=9 lg=10>
                <b-card class="mb-5" :title="$user.fullname">
                    <validation-observer ref="profileForm" v-slot="{handleSubmit}">
                        <b-form @submit.prevent="handleSubmit(onSubmit)">
                            <b-tabs content-class="mt-3" fill>
                                <b-tab title="Basic Information">
                                    <b-row>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="last_name" ref="last_name" v-slot="{errors, valid}">
                                            <b-form-group label="Last name" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.last_name" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="first_name" ref="first_name" v-slot="{errors, valid}">
                                            <b-form-group label="First name" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.first_name" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                         <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="username" ref="username" v-slot="{errors, valid}">
                                            <b-form-group label="Username" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.username" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                         </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="email" ref="email" v-slot="{errors, valid}">
                                            <b-form-group label="Email" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.email" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="phone" ref="phone" v-slot="{errors, valid}">
                                            <b-form-group label="Phone number" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.phone" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="dob" ref="dob" v-slot="{errors, valid}">
                                            <b-form-group label="Date of birth" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.dob" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>     
                                        </validation-provider>                           
                                    </b-row>
                                </b-tab>
                                <b-tab title="Identify">
                                    <b-row>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="id_number" ref="id_number" v-slot="{errors, valid}">
                                            <b-form-group label="ID Number" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.id_number" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="id_issuance_date" ref="id_issuance_date" v-slot="{errors, valid}">
                                            <b-form-group label="ID Issuance at" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.id_issuance_date" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>      
                                        <validation-provider tag="div" class="col-12 col-xl-4 col-lg-4" rules="required" name="id_issued_by" ref="id_issued_by" v-slot="{errors, valid}">                  
                                            <b-form-group label="ID Issue By" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.id_issued_by" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
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
                                                <b-form-input :value="formData.permanent_address" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
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
                                                <b-form-input :value="formData.residence_address" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>  
                                        </validation-provider>
                                    </b-row>
                                </b-tab>
                                <b-tab title="Bank">
                                    <b-row>
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="numeric|max:30" name="bank_account" ref="bank_account" v-slot="{errors, valid}">
                                            <b-form-group label="Bank account id" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.bank_account" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="max:30" name="bank_name" ref="bank_name" v-slot="{errors, valid}">
                                            <b-form-group label="Bank name" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.bank_name" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>         
                                        </validation-provider>  
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="max:30" name="bank_branch" ref="bank_branch" v-slot="{errors, valid}">
                                            <b-form-group label="Bank branch" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.bank_branch" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>        
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-3 col-lg-3" rules="max:30" name="bank_city" ref="bank_city" v-slot="{errors, valid}">
                                            <b-form-group label="Bank city" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.bank_city" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                    </b-row>
                                </b-tab>
                                <b-tab title="Other">
                                    <b-row>
                                        <validation-provider tag="div" class="col-12 col-xl-6 col-lg-6" rules="numeric|max:30" name="social_insurance_number" ref="social_insurance_number" v-slot="{errors, valid}">
                                            <b-form-group label="Social insurance number" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.social_insurance_number" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group>     
                                        </validation-provider>
                                        <validation-provider tag="div" class="col-12 col-xl-6 col-lg-6" rules="numeric|max:30" name="personal_tax_code" ref="personal_tax_code" v-slot="{errors, valid}">
                                            <b-form-group label="Personal tax code" :invalid-feedback="errors[0]" :state="$isValid(errors, valid)">
                                                <b-form-input :value="formData.personal_tax_code" :readonly="!$hasPermission('employee.edit')" :state="$isValid(errors, valid)"></b-form-input>
                                            </b-form-group> 
                                        </validation-provider>
                                    </b-row>
                                </b-tab>
                            </b-tabs>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <div class="mb-1">
                                        <a href="#">
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

                                <form-button type="submit" variant="primary" :disabled="!$hasPermission('employee.edit')" loading-without-hidden-text>
                                    SAVE
                                </form-button> 
                            </div>       
                        </b-form>
                    </validation-observer>                           
                </b-card>
            </b-col>
        </b-row>
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
                this.formData[key] = this.$user[key]
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
                    const { data } = await this.$http.post('employee/update', this.formData)

                    if(!data.error) {
                        this.$showAlert({type: 'success', message: 'Updated profile successfully!'})
                    }
                } catch (err) {
                    console.log(err)

                    if(err.response && err.response.status == 422) {
                        this.$parseResponseErrors(this.$refs, err.response.data)
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
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>