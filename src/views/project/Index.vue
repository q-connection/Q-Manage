<!-- eslint-disable vue/multi-word-component-names -->
<template>
<div class="page-content" :class="{hrm: inHrmRoutes === true}">
    <b-container fluid>
        <b-row>
            <b-col class="title-page">
                Projects
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <project-table 
                    show-thumbnail 
                    :show-create-button="$hasPermission('project.create') && !$device.mobile"
                    @create="onCreate" 
                    @edit-project="showEditProject"
                    v-if="!isSubmitting" />
            </b-col>
        </b-row>
        <b-modal 
            id="bv-modal-create-project" 
            header-class="custom-header" 
            content-class="custom-content" 
            hide-footer
            size="xl" 
            hide-header-close
            @hide="clearFormData"
        >
            <template #modal-title>
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0"> CREATE PROJECT</h5>
                    <span @click="$bvModal.hide('bv-modal-create-project')" style="cursor:pointer">
                        <QIcon icon="carbon:close-filled" class="close-modal float-right close-modal-custom"
                            color="#fa4032" width="47" height="47" />
                    </span>
                </div>
            </template>
            <div class="d-block" :class="{ mobile: $device.mobile === true }">
                <validation-observer ref="profileForm" v-slot="{ handleSubmit }">
                    <b-form @submit.prevent="handleSubmit(onSubmit)" ref="refCreateProject">
                        <b-row>
                            <b-col cols=12 xl=3 lg=3>
                                <validation-provider
                                    :rules="{ 'image': formData.type != 'edit', required: formData.type != 'edit' }"
                                    name="thumbnail" ref="thumbnail" v-slot="{ errors, valid }">
                                    <div class="project-image pr-0 pr-xl-3">
                                        <form-image-upload v-model="formData.thumbnail" :state="$isValid(errors, valid)"
                                            :preview="formData.thumbnail" />
                                        <span class="text-danger small">
                                            {{ errors[0] }}
                                        </span>
                                    </div>
                                </validation-provider>
                            </b-col>
                            <b-col cols=12 xl=9 lg=9>
                                <b-row>
                                    <b-col>
                                        <validation-provider rules="required|max:255" name="project name" ref="name"
                                            v-slot="{ errors, valid }">
                                            <b-form-group :invalid-feedback="errors[0]" label="Project name"
                                                label-class="label-required">
                                                <b-form-input placeholder="Project name..." v-model="formData.name"
                                                    :state="$isValid(errors, valid)">
                                                </b-form-input>
                                            </b-form-group>
                                        </validation-provider>
                                    </b-col>
                                    <b-col md="4" sm="12">
                                            <b-form-group  label="Status"
                                                label-class="label-required">
                                                <b-form-radio-group id="radio-group-2" class="radio-label"
                                                    name="radio-sub-component" v-model="formData.status"
                                            >
                                                    <b-form-radio value="published" selected>Active</b-form-radio>
                                                    <b-form-radio value="draft">Inactive</b-form-radio>
                                                </b-form-radio-group>
                                            </b-form-group>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col>
                                        <validation-provider rules="required" name="description" ref="description"
                                            v-slot="{ errors, valid }">
                                            <b-form-group label="Description" :invalid-feedback="errors[0]"
                                                label-class="label-required">
                                                <b-form-textarea id="textarea-large" class="description" size="lg"
                                                    placeholder="Description" v-model="formData.description"
                                                    :state="$isValid(errors, valid)">
                                                </b-form-textarea>
                                            </b-form-group>
                                        </validation-provider>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                        <b-row class="add-people" :class="{ mobile: $device.mobile === true }">
                            <b-col md="6">
                                <b-form-group label-class="collaborator-name" label="Collaborators">
                                    <div class="d-flex">
                                        <b-select2 
                                            v-model="customer_selected" 
                                            class="search-customer"
                                            placeholder="Search by employee ID or email" :options="list_customer_filtered"
                                            :filter-by="customerFilter"
                                            :closeOnSelect="false"
                                            label="fullname"
                                        >
                                            <template v-slot:option="option">
                                                <div class="p-1">
                                                    <div class="user-item">
                                                        <b-img :src="option.avatar_url" class="avatar" rounded="circle"
                                                            alt="Circle image"></b-img>
                                                        <b-col class="info">
                                                            <div class="full-name">
                                                                {{ option.full_name }}
                                                            </div>
                                                            <div class="email">
                                                                {{ option.email }}
                                                            </div>
                                                            <div class="username">
                                                                {{ option.username }}
                                                            </div>
                                                        </b-col>
                                                        <div @click="addPeople(option)"
                                                            class="btn-add-people align-items-center">
                                                            <QIcon icon="fluent:add-circle-16-filled" color="#197130"
                                                                width="22" height="22" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                        </b-select2>
                                    </div>
                                </b-form-group>
                            </b-col>
                            <b-col md="12" style="margin-top: -15px;">
                                <validation-provider rules="required" name="Collaborators" ref="list_customer_selected"
                                    v-slot="{ errors, valid }">
                                    <input type="hidden" v-model="formData.list_customer_selected"
                                        :state="$isValid(errors, valid)" />
                                    <div class="small text-danger" v-if="formData.form_customer_selected.length == 0">{{
                                            errors[0]
                                    }}</div>
                                </validation-provider>
                            </b-col>

                        </b-row>
                        <b-row>
                            <b-col md="12">
                                <b-row v-if="$device.mobile || $layout == 'mobile'">
                                    <b-col sm="12">
                                        <QIcon icon="fa-solid:user-friends" color="#f0b01d" width="26" height="18" />
                                        <span class="amount-customer">
                                            {{ formData.form_customer_selected.length > 5 ? '5+' :
                                                    formData.form_customer_selected.length
                                            }}
                                        </span>
                                    </b-col>
                                </b-row>
                                <b-row v-if="!$device.mobile && $layout != 'mobile'">
                                    <b-col md="3" v-for="(item, index) in formData.list_customer_selected" :key="index">
                                        <UserItem :user="item" @removePeople="removePeople" />
                                    </b-col>
                                </b-row>
                                <b-row v-else class="flex-nowrap overflow-auto">
                                    <b-col md="12" class="d-flex">
                                        <div v-for="(item, index) in formData.list_customer_selected" :key="index">
                                            <UserItem :user="item" @removePeople="removePeople" />
                                        </div>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>

                        <slot name="submitContent">
                            <div 
                                class="d-flex justify-content-end mt-4"
                                :class="{ 'justify-content-end': $device.mobile === true }"
                            >
                                <form-button type="submit" variant="primary" class="w-md-100" style="min-width: 250px;"
                                    :loading="isSubmitting" :disabled="isSubmitting" loading-without-hidden-text>
                                    SAVE
                                </form-button>
                            </div>
                        </slot>
                    </b-form>
                </validation-observer>
            </div>
        </b-modal>
    </b-container>
</div>
</template>

<script>
import UserItem from '@/components/project/UserItem.vue';
import ProjectTable from '@/components/project/Table.vue'

export default {
    components: { UserItem, ProjectTable },
    data() {
        return {
            project_detail: {},
            key_search: '',
            customer_selected: '',
            isConfirming: false,
            isSubmitting: false,
            urlImage: '',
            customerFilter: (option, label, search) => {
                let temp = search.toLowerCase();
                return option.full_name.toLowerCase().indexOf(temp) > -1 ||
                    option.email.toLowerCase().indexOf(temp) > -1
            },
            formData: {
                name: '',
                description: '',
                status: 'published',
                list_customer_selected: [],
                form_customer_selected: [],
                thumbnail: '',
                type: 'create',
                id: 0,

            }
        }
    },
    watch: {
        'customer_selected': function () {
            this.customer_selected = ''
        },
        'formdata.thumbnail': function (value) {
            this.formData.thumbnail = value.target.files[0]
        },

    },
    computed: {
        list_customer() {
            return this.$store.state.employees
        },

        list_customer_filtered() {
            const selected_customers = this.formData.form_customer_selected || []
            return this.$store.state.employees.filter(x => !selected_customers.includes(x.id))
        }
    },
    methods: {
        addPeople(item) {
            this.upsert(this.formData.list_customer_selected, this.formData.form_customer_selected, item)
        },
        upsert(array, form, item) { // (1)
            const i = array.findIndex(_item => _item.id === item.id)
            if (i > -1) array[i] = item // (2)
            else {
                array.push(item)
                form.push(item.id)
            }
        },
        removePeople(id) {
            const array = this.formData.list_customer_selected;
            const form = this.formData.form_customer_selected;
            // eslint-disable-next-line no-undef
            this.formData.list_customer_selected = array.filter(function (c) {
                return id != c.id
            });
            this.formData.form_customer_selected = form.filter(function (c) {
                return id != c
            });
        },
        disableChangeSelect() {
            this.customer_selected = []
        },
        onFileChange(e) {
            const file = e.target.files[0]
            this.thumbnail = file
            this.urlImage = URL.createObjectURL(file)
        },
        async onSubmit() {
            if (!this.$hasPermission('project.create')) {
                return
            }

            try {
                this.isSubmitting = true
                let formData = new FormData();
                for (var key in this.formData) {
                    formData.append(key, this.formData[key]);
                }
                if (this.formData.type == 'edit') {
                    if (!this.$hasPermission('project.edit')) {
                        return
                    }
                    const { data } = await this.$http.post(`projects/${this.formData.id}`, formData)
                    if (!data.error) {
                        this.$showAlert({ type: 'success', message: 'Update Project successfully!' })
                        this.clearFormData()
                    }
                } else {
                    const { data } = await this.$http.post('projects', formData)
                    if (!data.error) {
                        this.$showAlert({ type: 'success', message: 'Create Project successfully!' })
                        this.clearFormData()
                    }
                }

            } catch (err) {
                console.log(err)

                if (err.response && err.response.status == 422) {
                    this.$showAlert({ type: 'danger', message: "An error occurred while updating information, please check." })
                    this.$parseResponseErrors(this.$refs, err.response.data.data)
                }

                if (err.response && err.response.status != 422) {
                    this.$showAlert({ type: 'danger', message: err.response.data.message })
                }
            } finally {
                this.isSubmitting = false
            }

        },
        async showEditProject(project) {
            this.project_detail = project
            this.formData.name = this.project_detail.name
            this.formData.description = this.project_detail.description
            this.formData.status = this.project_detail.status
            this.formData.thumbnail = this.project_detail.thumbnail
            this.formData.type = 'edit'
            this.formData.id = this.project_detail.id
            this.formData.form_customer_selected = this.project_detail.customers.map(x => x.customer_id)
            this.formData.list_customer_selected = this.list_customer.filter((elem) => this.project_detail.customers.find(({ customer_id }) => {
                if (elem.id === customer_id) {
                    elem.show = false
                    this.upsert(this.formData.list_customer_selected, this.formData.form_customer_selected, elem)
                    return true;
                }
            }))
            this.$bvModal.show('bv-modal-create-project')
        },
        clearFormData() {
            this.formData.list_customer_selected = []
            this.formData.form_customer_selected = []
            this.formData.type = 'create'
            this.urlImage = ''
            this.formData.thumbnail = ''
            this.formData.description = '',
            this.formData.name = '',
            this.projectTableLoaded = true,
            this.$bvModal.hide('bv-modal-create-project')
        },
        onCreate() {
            this.$bvModal.show('bv-modal-create-project')
        }
    },
}
</script>
<style lang="scss" scoped>
.btn-open-modal {
    margin-bottom: 13px;
    font-size: 14px;

    &:hover {
        background: #FFFFFF;
    }

    &.mobile {
        margin-left: auto;
    }
}

.title-page {
    font-size: 16px;
    font-family: 'Inter';
    line-height: 17px;
    font-weight: 600;
    margin-bottom: 30px;
}


#bv-modal-create-project {
    background: #FFFFFF;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
    border-radius: 29px;
    height: 604px;

    .mobile {
        .project-image {
            margin-bottom: 14px;
        }
    }

    .project-image {
        width: 100%;
        height: 185px;
        border-radius: 10px;
        object-fit: cover;

        .upload-image {
            position: absolute;
            bottom: 0px;
            background: rgba(240, 176, 29, 0.35);
            width: 185px;
            padding: 20px;
            height: 57px;
        }

        /* Some padding */
        .icon-upload {
            position: absolute;
            bottom: 12px;
            margin-left: auto;
            margin-right: auto;
            left: 0;
            right: 0;
            text-align: center;
            cursor: pointer;
        }

        .input-upload-image {
            opacity: 0.01;
            position: revert;
            cursor: pointer;
        }
    }


    .description {
        font-size: 14px;
    }

    .add-people {
        --vs-search-input-placeholder-color: #999999;
        --vs-dropdown-option--active-bg: #fffdfd;
        --vs-dropdown-option--active-color: #212529;

        &.mobile {
            --vs-dropdown-option-padding: 0px;
        }

        .v-select,
        .v-select {
            width: 379.09px;
            box-sizing: border-box;
            font-weight: 400;
            font-size: 14px;
        }

        .search-customer {
            ::-webkit-input-placeholder {
                /* Edge */
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
            }

            :-ms-input-placeholder {
                /* Internet Explorer 10-11 */
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
            }

            ::placeholder {
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
            }
        }

        .user-item {
            display: flex;
            height: 53px;
            max-width: 100%;
            background: rgba(240, 176, 29, 0.21);
            border-radius: 26.5px;
            padding: 5px 0px 4px 4px;
            cursor: default;

            .avatar {
                width: 44px;
                height: 44px;

                border: 1px solid #F59300;
            }

            .full-name {
                font-weight: 700;
                font-size: 14px;
                line-height: 17px;
                pointer-events: none;
            }

            .email {
                font-weight: 500;
                font-size: 10px;
                line-height: 12px;
            }

            .username {
                font-weight: 500;
                font-size: 10px;
                line-height: 12px;
            }

        }

        .btn-add-people {
            margin-top: auto;
            margin-bottom: auto;
            margin-right: auto;
            margin-right: 20px;

            &:hover {
                transform: scale(1.5);
                cursor: pointer;
            }
        }
    }

    .amount-customer {
        margin-left: 6.5px;
        font-weight: 600;
        font-size: 14px;
        line-height: 17px;
        color: #F0B01D;
    }

    .btn-submit {
        width: 255.45px;
        height: 45px;
        margin-top: 10px;
    }
}

.vs__dropdown-option {
    padding: 0;
}
</style>

<style  lang="scss">
.custom-content {
    padding: 10px;

    &.mobile {
        padding: 5px;
    }
}

.collaborator-name {
    font-weight: 500;
}

.custom-header {
    display: block !important;
    border-bottom: 0px !important
}
</style>
