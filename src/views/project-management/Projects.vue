<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <b-container fluid>
        <b-row class="d-flex justify-content-between">
            <b-col md="10">
                <form-button variant="outline-warning text-warning" type="submit" :disabled="isConfirming"
                    :loading="isConfirming" @click="$bvModal.show('bv-modal-create-project')">
                    Create
                </form-button>
            </b-col>
            <b-col>
                <Search class="ml-auto" />
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <Projects>
                    <b-img slot="icon" class="project-image" src="https://picsum.photos/200/300" rounded
                        alt="Rounded image">
                    </b-img>
                </Projects>
            </b-col>
        </b-row>
        <b-modal id="bv-modal-create-project" hide-footer size="xl" hide-header-close>
            <template #modal-title>
                CREATE PROJECT
                <QIcon icon="carbon:close-filled" class="close-modal float-right close-modal-custom" color="#fa4032"
                    width="47" height="47" @click="$bvModal.hide('bv-modal-create-project')" />
            </template>
            <div class="d-block">

                <validation-observer ref="profileForm" v-slot="{ handleSubmit }">
                    <b-form @submit.prevent="handleSubmit(onSubmit)">
                        <b-row>
                            <b-col md="2">

                                <b-img src="https://picsum.photos/200/300" class="project-image" rounded
                                    alt="Rounded image">
                                </b-img>
                                <div class="upload-image">
                                    <QIcon icon="ic:twotone-drive-folder-upload" class="icon-upload" color="#f0b01d"
                                        width="40" height="31" />
                                           <!-- <b-form-file class="input-upload-image" :model="image" accept="image/*"></b-form-file> -->
                                </div>
                            </b-col>
                            <b-col md="8" class="project-info">
                                <b-row>
                                    <b-col>
                                        <b-form-group label="Project name" label-for="input-1">
                                            <b-form-input placeholder="Project name..." v-model="project_name" trim>
                                            </b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col>
                                        <b-form-group label="Status" label-for="input-1">
                                            <b-form-radio-group id="radio-group-2" v-model="status_selected"
                                                name="radio-sub-component">
                                                <b-form-radio value="active" size="lg">Active</b-form-radio>
                                                <b-form-radio value="inactive" size="lg">Inactive</b-form-radio>
                                            </b-form-radio-group>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col>
                                        <b-form-group label="Description" label-for="input-1">
                                            <b-form-textarea id="textarea-large" size="lg" placeholder="Description">
                                            </b-form-textarea>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
                        <b-row class="add-people">
                            <b-col md="6">
                                <b-form-group label="Collaborators" label-for="input-1">
                                    <div class="d-flex">
                                        <b-select2 v-model="customer_selected" class="search-customer"
                                            placeholder="Search by employee ID or email" :options="list_customer"
                                            label="full_name" multiple>
                                        </b-select2>
                                        <form-button @click="addPeople" variant="success text-white" type="submit"
                                            :disabled="isConfirming" :loading="isConfirming" class="btn-add-people">
                                            Add people
                                        </form-button>
                                    </div>
                                </b-form-group>
                            </b-col>
                            <b-col md="12">
                                <b-row>
                                    <b-col md="3" v-for="(item, index) in list_people" :key="index">
                                        <UserItem :user="item" @removePeople="removePeople" />
                                    </b-col>
                                </b-row>
                            </b-col>
                        </b-row>
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
            status_selected: 'active',
            list_customer: [],
            list_people: [],
            customer_selected: [],
            isConfirming: false,
            project_name: ''
        }
    },
    methods: {
        async fetchCustomerList() {
            try {
                const { data } = await this.$http.get('employee/list-customer')
                if (!data.error) {
                    this.list_customer = data.data
                }
            } catch (err) {
                console.log(err)
            }
        },
        addPeople() {
            const array = this.customer_selected;
            for (let key in this.customer_selected) {
                this.upsert(this.list_people, array[key])
            }
            this.customer_selected = []
        },
        upsert(array, item) { // (1)
            const i = array.findIndex(_item => _item.id === item.id);
            if (i > -1) array[i] = item; // (2)
            else array.push(item);
        },
        removePeople(id) {
            const array = this.list_people;
            // eslint-disable-next-line no-undef
            this.list_people = array.filter(function (c) {
                return id != c.id
            });
        }
    },
    mounted() {
        this.fetchCustomerList();
    }
}
</script>
<style lang="scss" scoped>
#bv-modal-create-project {
    background: #FFFFFF;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
    border-radius: 29px;
    height: 604px;

    .modal-header {
        .close-modal-custom {}
    }


    .project-image {
        width: 185px;
        height: 185px;
        border-radius: 10px;

    }

    .upload-image {
        position: absolute;
        bottom: 21px;
        background: rgb(0, 0, 0);
        color: #f1f1f1;
        width: 185px;
        padding: 20px;
        height: 10px;
        z-index: 1088;
        .input-upload-image{

        }

    }

    /* Some padding */
    .icon-upload {
        position: absolute;
        bottom: 10px;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        text-align: center;
    }

    .project-info {
        margin-left: 57px;
    }

    .add-people {

        .v-select,
        .v-select * {
            width: 379.09px;
            box-sizing: border-box;
            font-weight: 400;
            font-size: 14px;
        }

        .vs__open-indicator {
            display: none;
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

        .btn-add-people {
            font-style: normal;
            font-weight: 700;
            font-size: 16px;
            line-height: 20px;
            margin-left: 22px;
            border-radius: 10px;
        }
    }


}
</style>