<template>
    <b-container fluid>
        <b-row>
            <b-col cols="12" xl=3 lg=2>
                <user-info-block/>
            </b-col>
            <b-col cols="12" xl=9 lg=10>
                <b-card class="mb-5" :title="$user.fullname">
                    <b-tabs content-class="mt-3" fill>
                        <b-tab title="Basic Information">
                            <b-row>
                                <b-form-group class="col-12 col-xl-4 col-lg-4" label="Last name">
                                    <b-form-input :value="formData.last_name" readonly></b-form-input>
                                </b-form-group>
                                <b-form-group class="col-12 col-xl-4 col-lg-4" label="First name">
                                    <b-form-input :value="formData.first_name" readonly></b-form-input>
                                </b-form-group>
                                <b-form-group class="col-12 col-xl-4 col-lg-4" label="Username">
                                    <b-form-input :value="formData.username" readonly></b-form-input>
                                </b-form-group>
                                <b-form-group class="col-12 col-xl-4 col-lg-4" label="Email">
                                    <b-form-input :value="formData.email" readonly></b-form-input>
                                </b-form-group>
                                <b-form-group class="col-12 col-xl-4 col-lg-4" label="Phone number">
                                    <b-form-input :value="formData.phone" readonly></b-form-input>
                                </b-form-group>
                                <b-form-group class="col-12 col-xl-4 col-lg-4" label="Date of birth">
                                    <b-form-input :value="formData.dob" readonly></b-form-input>
                                </b-form-group>                                
                            </b-row>
                        </b-tab>
                        <b-tab title="Identify">
                            <b-row>
                                <b-form-group class="col-12 col-xl-4 col-lg-4" label="ID Number">
                                    <b-form-input :value="formData.id_number" readonly></b-form-input>
                                </b-form-group>
                                <b-form-group class="col-12 col-xl-4 col-lg-4" label="ID Issuance at">
                                    <b-form-input :value="formData.id_issuance_date" readonly></b-form-input>
                                </b-form-group>                        
                                <b-form-group class="col-12 col-xl-4 col-lg-4" label="ID Issue By">
                                    <b-form-input :value="formData.id_issued_by" readonly></b-form-input>
                                </b-form-group>  
                            </b-row>
                        </b-tab>
                        <b-tab title="Address">
                            <b-row>
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Permanent city">
                                    <b-form-input :value="formData.permanent_city" readonly></b-form-input>
                                </b-form-group>
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Permanent district">
                                    <b-form-input :value="formData.permanent_district" readonly></b-form-input>
                                </b-form-group>                        
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Permanent ward">
                                    <b-form-input :value="formData.permanent_ward" readonly></b-form-input>
                                </b-form-group>                        
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Permanent address">
                                    <b-form-input :value="formData.permanent_address" readonly></b-form-input>
                                </b-form-group>                        
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Residence city">
                                    <b-form-input :value="formData.residence_city" readonly></b-form-input>
                                </b-form-group>
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Residence district">
                                    <b-form-input :value="formData.residence_district" readonly></b-form-input>
                                </b-form-group>                        
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Residence ward">
                                    <b-form-input :value="formData.residence_ward" readonly></b-form-input>
                                </b-form-group>                        
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Residence address">
                                    <b-form-input :value="formData.residence_address" readonly></b-form-input>
                                </b-form-group>  
                            </b-row>
                        </b-tab>
                        <b-tab title="Bank">
                            <b-row>
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Bank account id">
                                    <b-form-input :value="formData.bank_account" readonly></b-form-input>
                                </b-form-group>
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Bank name">
                                    <b-form-input :value="formData.bank_name" readonly></b-form-input>
                                </b-form-group>                        
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Bank branch">
                                    <b-form-input :value="formData.bank_branch" readonly></b-form-input>
                                </b-form-group>                        
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Bank city">
                                    <b-form-input :value="formData.bank_city" readonly></b-form-input>
                                </b-form-group>
                            </b-row>
                        </b-tab>
                        <b-tab title="Other">
                            <b-row>
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Department">
                                    <b-form-input :value="formData.department" readonly></b-form-input>
                                </b-form-group>
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Position">
                                    <b-form-input :value="formData.role" readonly></b-form-input>
                                </b-form-group>                        
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Social insurance number">
                                    <b-form-input :value="formData.social_insurance_number" readonly></b-form-input>
                                </b-form-group>                        
                                <b-form-group class="col-12 col-xl-3 col-lg-3" label="Personal tax code">
                                    <b-form-input :value="formData.personal_tax_code" readonly></b-form-input>
                                </b-form-group> 
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

                        <form-button type="submit" variant="primary" loading-without-hidden-text>
                            SAVE
                        </form-button> 
                    </div>                                  
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        data: () => ({
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
                department: '',
                social_insurance_number: '',
                personal_tax_code: ''
            }            
        }),

        async mounted() {
            Object.keys(this.formData).forEach(key => {
                this.formData[key] = this.$user[key]
            })
        }
    }
</script>

<style lang="scss" scoped>

</style>