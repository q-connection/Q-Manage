<template>
<div class="page-content" :class="{hrm: inHrmRoutes === true}">
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="mb-0">Active Employees</h5>
                    <router-link :to="{name: 'hrm-employees-inactive'}">
                        View Inactive Employees
                    </router-link>
                </div>
            </b-col>
            <b-col cols=12>
                <table-default
                    :columns="columns"
                    :config="tableConfig"
                    :show-columns="false"
                    searchable
                    hover
                >
                    <template slot="tableHeadActions">
                        <b-button 
                            :to="{name: 'hrm-employees-create'}" 
                            variant="outline-primary" 
                            size="sm" 
                            class="p-2"
                            v-if="$hasPermission('employee.create') && !$device.mobile"
                        >
                            Add
                        </b-button>
                    </template>
                    <template slot="row-id" slot-scope="{row}">
                        <div class="employee-avatar">
                            <img :src="row.avatar_thumb_url ? row.avatar_thumb_url : null"/>
                            <div class="overlay">
                                {{ row.username }}
                            </div>
                        </div>
                    </template>
                    <template slot="row-fullname" slot-scope="{row}">
                        <div class="d-flex">
                            <div>
                                <div class="font-weight-bold">{{ row.fullname }} ({{ row.role_name }})</div>
                                <div class="text-dark small">
                                    <b-icon icon="telephone-fill"/>
                                    {{ row.phone }}
                                </div>
                                <div class="text-dark small">
                                    <b-icon icon="envelope-fill"/>
                                    {{ row.email }}
                                </div>
                            </div>
                        </div>
                    </template>
                    <template slot="row-point" slot-scope="{row}">
                        <div class="d-none d-xl-block d-lg-block">
                            <div class="mb-1">
                                Total point: <b>{{ row.point || 0 }}</b>
                                <router-link
                                    class="h5 mb-0"
                                    :to="{name: 'hrm-employees-point-history', params: {id: row.id}}"
                                >
                                    <q-icon icon="clarity:list-line"/>
                                </router-link>
                            </div>
                            <div class="mb-1">
                                Available annual Leave: <b>{{ row.available_leave_days || 0 }}</b>
                            </div>
                            <div class="mb-1">
                                Last year annual leave: <b>{{ row.old_leave_days || 0 }}</b>
                            </div>
                        </div>
                    </template>
                    <template slot="row-actions" slot-scope="{row}">
                        <span class="h3 text-warning text-cursor" @click="previewEmp(row)">
                            <b-icon icon="eye-fill"/>
                        </span>
                    </template>
                </table-default>
            </b-col>
        </b-row>
        <b-modal id="emp-modal" size="xl" hide-header hide-footer>
            <div class="p-3" v-if="selectedEmp">
                <modal-custom-header modal-id="emp-modal" :title="getModalTitle"/>
                <b-row>
                    <b-col cols=12 xl=3 lg=3>
                        <div class="avatar-modal">
                            <form-image-upload :preview-url="selectedEmp.avatar ? selectedEmp.avatar_url : null" readonly/>
                        </div>
                    </b-col>
                    <b-col cols=12 xl=9 lg=9>
                        <b-row>
                            <b-col cols=12 xl=7 lg=7>
                                <div class="d-flex mb-2 text-break flex-wrap">
                                    <div class="font-weight-bold text-title">Date Of Birth:</div>
                                    <div class="text-value">{{ selectedEmp.dob }}</div>
                                </div>
                            </b-col>
                            <b-col cols=12 xl=5 lg=5>
                                <div class="d-flex mb-2 flex-wrap">
                                    <div class="font-weight-bold text-title" style="min-width: 120px">Department:</div>
                                    <div class="text-value">{{ selectedEmp.departments ? (selectedEmp.departments[0] ? selectedEmp.departments[0].name : 'N/A') : 'N/A' }}</div>
                                </div>
                            </b-col>
                            <b-col cols=12 xl=7 lg=7>
                                <div class="d-flex mb-2 text-break flex-wrap">
                                    <div class="font-weight-bold text-title">Phone Number:</div>
                                    <div class="text-value">{{ selectedEmp.phone || 'N/A' }}</div>
                                </div>
                            </b-col>
                            <b-col cols=12 xl=5 lg=5>
                                <div class="d-flex mb-2 flex-wrap">
                                    <div class="font-weight-bold text-title" style="min-width: 120px">Title:</div>
                                    <div class="text-value">{{ selectedEmp.role_name }}</div>
                                </div>
                            </b-col>
                            <b-col cols=12 xl=7 lg=7>
                                <div class="d-flex mb-2 text-break flex-wrap">
                                    <div class="font-weight-bold text-title">Email:</div>
                                    <div class="text-value">{{ selectedEmp.email || 'N/A' }}</div>
                                </div>
                            </b-col>
                            <b-col cols=12 xl=5 lg=5>
                                <div class="d-flex mb-2 flex-wrap">
                                    <div class="font-weight-bold text-title" style="min-width: 120px">Contract:</div>
                                    <div class="text-break text-warning position-relative pb-4 pb-xl-0 pb-lg-0 pb-sm-3">
                                        <span v-if="selectedEmp.contract_type == 'freelancer'">Freelancer staff</span>
                                        <span v-if="selectedEmp.contract_type == 'official'">Official staff</span>
                                        <span v-if="selectedEmp.contract_type == 'probation'">Probation staff</span>
                                        <div class="position-absolute" style="width: 200px">
                                            ({{ selectedEmp.contract_start_date || 'N/A' }} - {{ selectedEmp.contract_end_date || 'N/A' }})
                                        </div>
                                    </div>
                                </div>
                            </b-col>
                            <b-col cols=12 xl=6 lg=6>
                                <div class="d-flex mb-2 text-break flex-wrap">
                                    <div class="font-weight-bold text-title">ID Number:</div>
                                    <div class="text-value">{{ selectedEmp.id_number || 'N/A' }}</div>
                                </div>
                            </b-col>
                            <b-col cols=12>
                                <div class="d-flex mb-2 text-break flex-wrap">
                                    <div class="font-weight-bold text-title">Permanent Address:</div>
                                    <div class="text-value">{{ selectedEmp.permanent_full_address || 'N/A' }}</div>
                                </div>
                            </b-col>
                            <b-col cols=12>
                                <div class="d-flex mb-2 text-break flex-wrap">
                                    <div class="font-weight-bold text-title">Residence Address:</div>
                                    <div class="text-value">{{ selectedEmp.residence_full_address || 'N/A' }}</div>
                                </div>
                            </b-col>
                            <b-col cols=12>
                                <div class="d-flex mb-2 text-break flex-wrap">
                                    <div class="font-weight-bold text-title">Bank account information:</div>
                                    <div  class="text-value">
                                        {{ selectedEmp.bank_account || 'N/A' }} -
                                        {{ selectedEmp.bank_name || 'N/A' }} -
                                        {{ selectedEmp.bank_branch || 'N/A' }}
                                    </div>
                                </div>
                            </b-col>
                            <b-col cols=12>
                                <div class="float-right">
                                    <b-button variant="primary" style="min-width: 250px; font-size: 16px; line-height: 2" :to="{name: 'hrm-employees-detail', params: {id: selectedEmp.id}}">
                                        EDIT
                                    </b-button>
                                </div>
                            </b-col>
                        </b-row>
                    </b-col>
                </b-row>
            </div>
        </b-modal>
    </b-container>
</div>
</template>

<script>
    export default {
        name: 'HmEmployees',
        data: () => ({
            breadcrumb_items: [
                {to: 'dashboard', title: 'Dashboard'},
                {to: 'hrm-employees', title: 'Employees'},
            ],
            tableConfig: {
                url: 'employee/list',
                params: {
                    status: 'active'
                }
            },
            selectedEmp: null                
        }),

        computed: {
            columns() {
                return [
                    {
                        label: "ID",
                        name: "id",
                        width: '90px',
                        rowClass: 'text-cursor',
                        rowClicked: row => this.onRowClick(row)
                    },
                    {
                        label: "Name",
                        name: "fullname",
                        width: '350px',
                        rowClass: 'text-cursor',
                        rowClicked: row => this.onRowClick(row)
                    },
                    { 
                        label: "Point",
                        name: "point",
                        width: '220px',
                        rowClass: 'text-cursor',
                    },
                    {
                        label: 'Actions',
                        name: "actions",
                        width: '90px'
                    }
                ]  
            },

            getModalTitle() {
                const emp = this.selectedEmp

                if(!emp) return 'N/A'

                return `${emp.fullname} (<span class="text-warning">${emp.username}</span>)`
            }
        },

        methods: {
            previewEmp(emp) {
                this.selectedEmp = emp
                this.$bvModal.show('emp-modal')
            },

            onRowClick(row) {
                this.$router.push({name: 'hrm-employees-detail', params: {id: row.id}})    
            }
        }
    }
</script>

<style lang="scss" scoped>
.employee-avatar {
    position: relative;
    width: 70px;
    height: 60px;
    overflow: hidden;
    border-radius: 10px;
    background-image: url(/public/images/avatar-placeholder.png);
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: top center;
    border: 1px solid var(--light);

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        -o-object-fit: cover;
        border-radius: 10px;
    }

    .overlay {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 20px;
        text-align: center;
        font-size: 10px;
        color: #fff;
        font-weight: 600;
        background: rgba(55, 55, 55, 0.77);
        line-height: 2;
        max-width: 100%;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
    }
}

.avatar-modal {
    min-width: 185px;
    height: 195px;
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