<template>
    <b-container fluid>
        <b-row>
            <b-col cols="12" xl=3 lg=2>
                <user-info-block/>
            </b-col>
            <b-col cols="12" xl=9 lg=10>
                <b-card class="mb-3" title="User Profile">
                    <b-row>
                        <b-form-group class="col-12 col-xl-6 col-lg-6" label="Username">
                            <b-form-input :value="$user.username" readonly></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-12 col-xl-6 col-lg-6" label="Full name">
                            <b-form-input :value="$user.fullname" readonly></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-12 col-xl-6 col-lg-6" label="Email">
                            <b-form-input :value="$user.email" readonly></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-12 col-xl-6 col-lg-6" label="Phone">
                            <b-form-input :value="$user.phone" readonly></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-12 col-xl-6 col-lg-6" label="Date of birth">
                            <b-form-input :value="$user.dob" readonly></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-12 col-xl-6 col-lg-6" label="Last login at">
                            <b-form-input :value="$user.last_login" readonly></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-12" label="Residence Address">
                            <b-form-input :value="$user.residence_full_address" readonly></b-form-input>
                        </b-form-group>
                        <b-form-group class="col-12" label="Permanent Address">
                            <b-form-input :value="$user.permanent_full_address" readonly></b-form-input>
                        </b-form-group>
                    </b-row>
                </b-card>
                <b-row>
                    <b-col cols=12 xl=6 lg=6>
                        <b-card title="Contract Information">
                            <b-table-simple bordered hover small caption-top responsive>
                                <b-tbody>
                                    <b-tr>
                                        <b-th>Contract type</b-th>
                                        <b-td>{{ $user.contract_type.toUpperCase() }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Contract type time</b-th>
                                        <b-td>{{ $user.contract_type_time }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Contract signed date</b-th>
                                        <b-td v-if="$user.contract_type == 'freelancer'">{{ $user.freelance_contract_date }}</b-td>
                                        <b-td v-else-if="$user.contract_type == 'probation'">{{ $user.probationary_contract_date }}</b-td>
                                        <b-td v-else>{{ $user.official_contract_date }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Contract end date</b-th>
                                        <b-td>{{ $user.contract_end_date }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Salary</b-th>
                                        <b-td v-if="$user.contract_type == 'freelancer'">{{ $formatCurrency($user.freelancer_salary) }}</b-td>
                                        <b-td v-else-if="$user.contract_type == 'probation'">{{ $formatCurrency($user.probationary_salary) }}</b-td>
                                        <b-td v-else>{{ $formatCurrency($user.official_salary) }}</b-td>
                                    </b-tr>
                                </b-tbody>
                            </b-table-simple>
                        </b-card>
                    </b-col>
                    <b-col cols=12 xl=6 lg=6>
                        <b-card title="Other Information">
                            <b-table-simple bordered hover small caption-top responsive>
                                <b-tbody>
                                    <b-tr>
                                        <b-th>Social insurance ID</b-th>
                                        <b-td>{{ $user.social_insurance_number || 'N/A' }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Tax code</b-th>
                                        <b-td>{{ $user.personal_tax_code || 'N/A' }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Indentity ID</b-th>
                                        <b-td>{{ $user.id_number || 'N/A'  }}</b-td>
                                    </b-tr>
                                    <b-tr>
                                        <b-th>Indentity By</b-th>
                                        <b-td>{{ $user.id_issued_by || 'N/A'  }}</b-td>
                                    </b-tr>
                                </b-tbody>
                            </b-table-simple>
                        </b-card>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
    export default {
        computed: {
            
        },
    }
</script>

<style lang="scss" scoped>

</style>