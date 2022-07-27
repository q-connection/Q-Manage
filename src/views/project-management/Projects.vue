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
                        alt="Rounded image"></b-img>
                </Projects>
            </b-col>
        </b-row>
        <b-modal id="bv-modal-create-project" hide-footer size="xl" hide-header-close>
            <template #modal-title>
                CREATE PROJECT
                <QIcon icon="carbon:close-filled" class="close-modal float-right" color="#fa4032" width="47" height="47"
                    @click="$bvModal.hide('bv-modal-create-project')" />
            </template>
            <div class="d-block">

                <validation-observer ref="profileForm" v-slot="{ handleSubmit }">
                    <b-form @submit.prevent="handleSubmit(onSubmit)">
                        <b-row>
                            <b-col md="3">
                                <b-img src="https://picsum.photos/200/300" class="project-image" rounded
                                    alt="Rounded image">
                                </b-img>
                            </b-col>
                            <b-col md="9">
                                <b-row>
                                    <b-col>
                                        <b-form-group label="Project name" label-for="input-1">
                                            <b-form-input placeholder="Project name..." v-model="name" :state="state"
                                                trim>
                                            </b-form-input>
                                        </b-form-group>
                                    </b-col>
                                    <b-col>
                                        <b-form-group label="Status" label-for="input-1">
                                            <b-form-radio-group id="radio-group-2" v-model="status_selected"
                                                :aria-describedby="ariaDescribedby" name="radio-sub-component">
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
                                        <b-select2 class="search-customer" placeholder="Search by employee ID or email"
                                         :options="listCustomer"    multiple >
                                         <div>{{option}}</div>
                                              {{ option }}
                                             </b-select2>
                                        <form-button variant="success text-white" type="submit" :disabled="isConfirming"
                                            :loading="isConfirming" class="btn-add-people">
                                            Add people
                                        </form-button>
                                    </div>
                                </b-form-group>
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
export default {
    components: { Projects, Search },
    data() {
        return {
            status_selected: 'active',
            listCustomer: [],
        }
    },
    methods: {
        async fetchCustomerList() {
            try {
                const { data } = await this.$http.get('employee/list-customer')
                console.log('data',data)
                if (!data.error) {
                    this.listCustomer = data.data
                }
            } catch (err) {
                console.log(err)
            }
        }
    },
    mounted(){
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

    .project-image {
        width: 185px;
        height: 185px;
        border-radius: 10px;
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