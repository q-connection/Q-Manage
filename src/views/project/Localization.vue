<template>
    <project-layout>
        <b-row>
            <b-col cols=12 xl=3 lg=3>
                <wiki-sidebar/>
            </b-col>
            <b-col cols=12 xl=9 lg=9>
                <b-card>
                    <input class="d-none" ref="importFile" type="file" accept=".xlsx, .xls, .csv" @change="onImport">
                    <b-row class="mb-3 pb-1 border-bottom">
                        <b-col cols=12 xl=8 lg=8>
                            <b-form-input
                                placeholder="Search..."
                                v-model="queryParams.search"
                            />
                        </b-col>
                        <b-col cols=12 xl=4 lg=4>
                            <custom-select
                                label=""
                                mode="select"
                                :config="screenConfig"
                                v-model="queryParams.feature_id"
                                @selected="onSelected"
                            >
                                <template slot="creation" slot-scope="{reset, search}">
                                    <FormLocalization :reset="reset" :name="search"/>
                                </template>
                            </custom-select>
                        </b-col>
                    </b-row>
                    <div class="d-flex justify-content-between align-items-center mb-3 px-1">
                        <div class="font-weight-bold">
                            {{ localization.label || 'N/A' }}
                        </div>
                        <div class="d-flex">
                            <form-button
                                class="mr-2 p-2"
                                variant="outline-success"
                                size="sm"
                                @click="$refs.importFile.click()"
                            >
                                Import
                            </form-button>
                            <a
                                class="p-2 btn btn-outline-danger btn-sm"
                                size="sm"
                                :href="exportUrl"
                                target="_blank"
                            >
                                Export
                            </a>
                        </div>
                    </div>
                    <div class="table-responsive" style="max-height: 500px; overflow-y: auto">
                        <table class="table table-bordered table-localization">
                            <thead>
                                <tr>
                                    <th width="32%" class="text-center align-middle" style="height: 30px">
                                        Key
                                    </th>
                                    <th width="32%" class="text-center align-middle" style="height: 30px">
                                        VI
                                    </th>
                                    <th width="32%" class="text-center align-middle" style="height: 30px">
                                        EN
                                    </th>
                                    <th width="4%" class="text-center align-middle" style="height: 30px"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in strings" :key="index">
                                    <template v-if="editing.includes(item.id)">
                                        <td>
                                            <b-form-input v-model="item.value_record.key"/>
                                        </td>
                                        <td>
                                            <b-form-input v-model="item.value_record.vi"/>
                                        </td>
                                        <td>
                                            <b-form-input v-model="item.value_record.en"/>
                                        </td>
                                        <td class="text-center">
                                            <form-button
                                                variant="white"
                                                class="localization-button-save"
                                                :disabled="saving.includes(item.id)"
                                                :loading="saving.includes(item.id)"
                                                @click="saveString(item)"
                                            >
                                                <span class="text-success h3 mb-0">
                                                    <q-icon icon="entypo:save"/>
                                                </span>
                                            </form-button>
                                        </td>
                                    </template>
                                    <template v-else>
                                        <td>{{ item.value_record['key'] }}</td>
                                        <td>{{ item.value_record['vi'] }}</td>
                                        <td>{{ item.value_record['en'] }}</td>
                                        <td>
                                            <b-dropdown class="localization-dropdown" variant="link" toggle-class="text-decoration-none" no-caret>
                                                <template #button-content>
                                                    <span class="h3 mb-0 text-dark">
                                                        <q-icon icon="fluent:more-circle-20-regular"/>
                                                    </span>
                                                </template>   
                                                <b-dropdown-item href="javascript:;" @click="editString(item.id)">
                                                    Edit
                                                </b-dropdown-item>                                         
                                                <b-dropdown-item href="javascript:;" @click="deleteString(item)">
                                                    <span class="text-danger">
                                                        Delete
                                                    </span>
                                                </b-dropdown-item>                                         
                                            </b-dropdown>
                                        </td>
                                    </template>
                                </tr>
                                <tr v-if="strings.length <= 0">
                                    <td colspan="4">
                                        <div class="text-center">
                                            No records to show.
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </project-layout>
</template>

<script>
    import WikiSidebar from '@/components/wiki/Sidebar.vue'
    import ProjectLayout from '@/components/project/Layout.vue'
    import FormLocalization from '@/components/wiki/FormLocalization.vue'

    export default {
        name: 'LocalizationPage',
        components: {ProjectLayout, WikiSidebar, FormLocalization},
        data: () => ({
            timer: null,
            editing: [],
            saving: [],
            localization: {},
            strings: [],
            queryParams: {
                search: '',
                feature_id: ''
            }
        }),
        computed: {
            screenConfig() {
                return {
                    server_side: true,
                    auto_select_first: true,
                    permission: 'localization-string',
                    endpoint: 'localization_features',
                    params: {
                        project_id: this.$route.params.id
                    },
                    resolveData: data => ({
                        label: data.name,
                        value: data.id,
                        style: 'font-size: 14px; font-weight: bold'
                    })
                }
            },
            
            exportUrl() {
                return `${process.env.VUE_APP_API_ENDPOINT}/feature_values/export/${this.queryParams.feature_id}`
            }
        },

        watch: {
            async 'queryParams.feature_id'() {
                await this.fetchStrings()
            },
            
            'queryParams.search'() {
                clearTimeout(this.timer)
                this.timer = setTimeout(async () => {
                    await this.fetchStrings()
                }, 750)
            }
        },

        methods: {
            onSelected(opt) {
                this.localization = opt
            },

            editString(id) {
                this.editing.push(id)
            },

            async fetchStrings() {
                try {
                    const { data } = await this.$http.get('feature_values', {params: this.queryParams})

                    if(!data.error) {
                        this.strings = data.data
                    }
                } catch (err) {
                    console.log(err)
                }
            },

            async saveString(item) {
                try {
                    this.saving.push(item.id)
                    await this.$http.put('feature_values/' + item.id, {value: item.value_record})
                    this.$toast.success(`Updated string <b>${item.value_record.key}</b>`, {
                        position: 'bottom-right'
                    })                    
                } catch (err) {
                    console.log(err)
                } finally {
                    const savingIdx = this.saving.findIndex(x => x == item.id)
                    const editingIdx = this.editing.findIndex(x => x == item.id)

                    if(savingIdx !== -1) {
                        this.$delete(this.saving, savingIdx)
                    }

                    if(editingIdx !== -1) {
                        this.$delete(this.editing, editingIdx)
                    }
                }
            },

            async onImport(e) {
                const file = e.target.files[0]

                if(!this.queryParams.feature_id) {
                    this.$showAlert({
                        type: 'danger',
                        title: 'Oops',
                        message: 'Please select or create new screen to import strings.'
                    })

                    e.target.value = ''
                    return                    
                }
        
                if(!['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type)) {
                    this.$showAlert({
                        type: 'danger',
                        title: 'Oops',
                        message: 'Only allow excel files: .xls, .xlsx.'
                    })

                    e.target.value = ''
                    return
                }

                const loading = this.$toast.info('Uploading...', {position: 'bottom-right'})

                try {
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('feature_id', this.queryParams.feature_id)

                    const { data } = await this.$http.post('feature_values', formData)

                    if(!data.error) {
                        this.$showAlert({
                            type: 'success',
                            title: 'Congratulations!',
                            message: 'Uploaded strings file successfully.'
                        })

                        await this.fetchStrings()
                    } else {
                        e.target.value = ''
                        this.$showAlert({
                            type: 'danger',
                            title: 'Oops',
                            message: data.message
                        })                        
                    }
                } catch (err) {
                    e.target.value = ''
                    console.log(err)

                    if(err.response && err.response.data) {
                        this.$showAlert({
                            type: 'danger',
                            title: 'Oops',
                            message: err.response.data.message
                        })
                    }
                } finally {
                    loading.dismiss()
                }
            },

            async deleteString(str) {
                const loading = this.$toast.error(`Deleting <b>${str.value_record.key}</b>`, {position: 'bottom-right', duration: 0})

                try {
                    const { data } = await this.$http.delete('feature_values/'+str.id)

                    if(!data.error) {
                        this.$toast.success(`Deleted string <b>${str.value_record.key}</b>`, {
                            position: 'bottom-right'
                        })

                        const idx = this.strings.findIndex(x => x.id == str.id)

                        if(idx !== -1) {
                            this.$delete(this.strings, idx)
                        }
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    loading.dismiss()
                }
            }
        },
    }
</script>

<style lang="scss" scoped>
.table-localization {
    thead {
        tr {
            th {
                background-color: #FFF8E9;
                border: 1px solid #F0B01D
            }
        }
    }

    tbody {
        tr {
            td {
                min-height: 30px;
                background-color: #fff;
                border: 1px solid #F0B01D;
                padding: 12px;
                vertical-align: middle;             
            }
        }
    }
}
</style>
<style lang="scss">
.localization-dropdown {
    .btn {
        min-width: auto;
        min-height: auto;
        padding: 0
    }  
}

.localization-button-save {
    min-width: auto;
    min-height: auto;
    padding: 0;
    text-align: center;

    .spinner-grow {
        color: #333 !important
    }
}  
</style>