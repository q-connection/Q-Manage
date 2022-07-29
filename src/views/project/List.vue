<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <b-container fluid>
        <b-row>
            <b-col class="title-page">
                Projects
            </b-col>
        </b-row>
        <div class="d-flex">
            <!-- sm="12" md="12" lg="10"  -->
            <form-button variant="outline-warning text-warning btn-open-modal " :class="{ mobile: $layout == 'mobile' }"
                type="submit" :disabled="isConfirming" :loading="isConfirming"
                @click="$bvModal.show('bv-modal-create-project')">
                Create
            </form-button>
            <Search @searchData="searchData" class="ml-auto" :class="{ 'd-none': $layout == 'mobile' }" />
        </div>
        <b-row>
            <b-col>
                <Projects is-show-pagination is-show-issues is-show-image :key-search="key_search"/>
            </b-col>
        </b-row>
        <b-modal id="bv-modal-create-project" header-class="custom-header" content-class="custom-content" hide-footer
            size="xl" hide-header-close>
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
                            <b-col md="3" sm="12" class="project-image">
                                <b-img :src="urlImage" width="185" height="185" rounded alt="Rounded image">
                                </b-img>
                                <div class="upload-image">
                                    <QIcon icon="ic:twotone-drive-folder-upload" class="icon-upload" color="yellow"
                                        width="40" height="31" />
                                    <b-form-file class="input-upload-image" @change="onFileChange"
                                        v-model="formData.thumbnail" accept="image/*">
                                    </b-form-file>
                                </div>
                                <div>
                                    <validation-provider rules="ext:jpg,jpeg,png|size:3072" name="thumbnail"
                                        ref="thumbnail" v-slot="{ errors, valid }">
                                        <input type="hidden" v-model="formData.thumbnail"
                                            :state="$isValid(errors, valid)" />
                                        <div class="small text-danger text-break">{{ errors[0] }}</div>
                                    </validation-provider>
                                </div>
                            </b-col>
                            <b-col md="9" sm="12">
                                <b-row md="8" sm="12">
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
                                        <b-form-group label="Status" label-class="label-required">
                                            <b-form-radio-group id="radio-group-2" v-model="formData.status"
                                                name="radio-sub-component">
                                                <b-form-radio value="published" size="lg">Active</b-form-radio>
                                                <b-form-radio value="draft" size="lg">Inactive</b-form-radio>
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
                                        <b-select2 v-model="customer_selected" class="search-customer"
                                            placeholder="Search by employee ID or email" :options="list_customer"
                                            :filter-by="customerFilter" label="full_name">
                                            <template v-slot:option="option">
                                                <slot name="option-data" class="option-data" v-bind="option">
                                                    <div class="user-item">
                                                        <b-img src="https://picsum.photos/200" class="avatar"
                                                            rounded="circle" alt="Circle image"></b-img>
                                                        <b-col class="info">
                                                            <div class="full-name">
                                                                {{ option?.full_name }}
                                                            </div>
                                                            <div class="email">
                                                                {{ option?.email }}
                                                            </div>
                                                            <div class="username">
                                                                {{ option?.username }}
                                                            </div>
                                                        </b-col>
                                                        <div @click="addPeople(option)"
                                                            class="btn-add-people align-items-center">
                                                            <QIcon icon="fluent:add-circle-16-filled" color="#197130"
                                                                width="22" height="22" />
                                                        </div>
                                                    </div>
                                                </slot>
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
                                <b-row v-if="!$device.mobile">
                                    <b-col md="3" v-for="(item, index) in formData.list_customer_selected" :key="index">
                                        <UserItem :user="item" @removePeople="removePeople" />
                                    </b-col>
                                </b-row>
                                <b-row v-else class="flex-nowrap overflow-auto">
                                    <div v-for="(item, index) in formData.list_customer_selected" :key="index">
                                        <UserItem :user="item" @removePeople="removePeople" />
                                    </div>
                                </b-row>
                            </b-col>
                        </b-row>
                        <slot name="submitContent">
                            <div class="d-flex justify-content-end"
                                :class="{ 'justify-content-end': $device.mobile === true }">
                                <form-button class="btn-submit" size="lg" type="submit" variant="primary"
                                    :disabled="!$hasPermission('project.create') || isSubmitting"
                                    :loading="isSubmitting" loading-without-hidden-text>
                                    SAVE
                                </form-button>
                            </div>
                        </slot>
                    </b-form>
                </validation-observer>
            </div>
        </b-modal>
    </b-container>
</template>

<script>
import Projects from '@/components/Projects.vue';
import Search from '@/components/Search.vue';
import UserItem from '@/components/project/UserItem.vue';
export default {
    components: { Projects, Search, UserItem },
    data() {
        return {
            list_customer: [],
            key_search: '',
            customer_selected: '',
            isConfirming: false,
            isSubmitting: false,
            urlImage: '/images/default-user-avatar.png',
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
                thumbnail: '/images/default-user-avatar.png',

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
    methods: {
        async fetchCustomerList() {
            try {
                const { data } = await this.$http.get(`employee/list-customer`)
                if (!data.error) {
                    this.list_customer = data.data
                }
            } catch (err) {
                console.log(err)
            }
        },
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

                const { data } = await this.$http.post('projects', formData)
                if (!data.error) {
                    this.$showAlert({ type: 'success', message: 'Create Project successfully!' })
                    this.$refs.refCreateProject.reset()
                    this.formData.list_customer_selected = []
                    this.formData.form_customer_selected = []
                    this.formData.thumbnail = '/images/default-user-avatar.png'
                    this.urlImage = '/images/default-user-avatar.png'

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
        searchData(val) {
            this.key_search = val
        }
    },
    async mounted() {
        await this.fetchCustomerList();
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
        height: 185px;
        border-radius: 10px;
        object-fit: cover;

        .upload-image {
            position: absolute;
            bottom: 0px;
            background: rgba(240, 176, 29, 0.35);
            width: 185px;
            padding: 20px;
            height: 10px;
        }

        /* Some padding */
        .icon-upload {
            position: absolute;
            bottom: 5px;
            margin-left: auto;
            margin-right: auto;
            left: 0;
            right: 0;
            text-align: center;
            // background-color: #f0b01d;
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
        --vs-dropdown-option--active-bg: #fff;

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
            width: 339px;
            height: 53px;
            background: rgba(240, 176, 29, 0.21);
            border-radius: 26.5px;
            padding: 5px 0px 4px 4px;

            &:not(last-of-type, first-of-type) {
                margin-right: 25px;
            }

            .avatar {
                width: 44px;
                height: 44px;

                border: 1px solid #F59300;
            }

            .full-name {
                font-weight: 700;
                font-size: 14px;
                line-height: 17px;
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
        }
    }

    .btn-submit {
        width: 255.45px;
        height: 45px;
        margin-top: 10px;
    }
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
