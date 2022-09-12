<template>
    <validation-observer ref="announcementForm" v-slot="{handleSubmit}">
        <b-form @submit.prevent="handleSubmit(onSubmit)">
            <b-row>
                <b-col cols=12 xl=3 lg=3>
                    <div class="thumbnail">
                        <validation-provider 
                            rules="ext:jpg,jpeg,png|size:3072" 
                            name="thumbnail" 
                            ref="thumbnail" 
                            v-slot="{errors, valid}"
                        >
                            <form-image-upload v-model="formData.thumbnail" :previewUrl="formData.thumbnail_url" :state="$isValid(errors, valid)"/>
                            <div class="small text-danger text-center text-break">{{ errors[0] }}</div>
                        </validation-provider>
                    </div>
                </b-col>
                <b-col cols=12 xl=9 lg=9 :class="{'pt-3': $device.mobile === true}">
                    <b-row>
                        <b-col cols=12>
                            <validation-provider rules="required|max:255" name="title" ref="title" v-slot="{errors, valid}">
                                <b-form-group label="Title" :invalid-feedback="errors[0]" label-class="label-required">
                                    <b-form-input placeholder="Enter title..." v-model="formData.title" :state="$isValid(errors, valid)"/>
                                </b-form-group>
                            </validation-provider>
                        </b-col>
                        <b-col cols=12 xl=6 lg=6>
                            <validation-provider rules="required" name="expired_at" ref="expired_at" v-slot="{errors, valid}">
                                <form-group
                                    mode="datepicker"
                                    label="Expired at"
                                    v-model="formData.expired_at"
                                    :error="errors[0]"
                                    :state="$isValid(errors, valid)"
                                    required
                                />
                            </validation-provider>
                        </b-col>
                        <b-col cols=12 xl=6 lg=6>
                            <validation-provider rules="ext:pdf" name="files" ref="files" v-slot="{errors, valid}">
                                <b-form-group label="File (PDF)" :invalid-feedback="errors[0]">
                                    <b-form-file class="pdf" placeholder="Choose a file..." v-model="formData.files" :state="$isValid(errors, valid)"/>
                                </b-form-group>
                            </validation-provider>
                        </b-col>            
                        <b-col cols=12>
                            <b-form-checkbox class="mb-2" v-model="formData.send_summary_point" :value="true" :unchecked-value="false">
                                Summary point
                            </b-form-checkbox>                               
                        </b-col>      
                        <b-col cols=12 xl=6 lg=6>              
                            <validation-provider rules="required" name="summary_point_from" ref="summary_point_from" v-slot="{errors, valid}" v-if="formData.send_summary_point">
                                <form-group
                                    mode="datepicker"
                                    label="From"
                                    v-model="formData.summary_point_from"
                                    :max="formData.summary_point_to"
                                    :state="$isValid(errors, valid)"
                                    :error="errors[0]"
                                    required
                                />
                            </validation-provider>
                        </b-col>
                        <b-col cols=12 xl=6 lg=6 v-if="formData.send_summary_point">
                            <validation-provider rules="required" name="summary_point_to" ref="summary_point_to" v-slot="{errors, valid}">
                                <form-group
                                    mode="datepicker"
                                    label="To"
                                    v-model="formData.summary_point_to"
                                    :min="formData.summary_point_from"
                                    :state="$isValid(errors, valid)"
                                    :error="errors[0]"
                                    required
                                />
                            </validation-provider>
                        </b-col>                             
                        <b-col cols=12>
                            <validation-provider rules="required" name="description" ref="description" v-slot="{errors, valid}">
                                <b-form-group label="Description" :invalid-feedback="errors[0]" label-class="label-required">
                                    <b-form-textarea rows="5" placeholder="Enter description..." v-model="formData.description" :state="$isValid(errors, valid)"/>
                                </b-form-group>
                            </validation-provider>
                        </b-col>     
                        <b-col cols=12 v-if="formData.send_summary_point">
                            <div class="mb-1" style="font-weight: 500">Preview</div>
                            <div class="table-responsive" style="max-height: 500px; overflow-y: auto">
                                <table class="table table-bordered table-center">
                                    <thead>
                                        <tr>
                                            <th style="width:5%;" rowspan="2">STT</th>
                                            <th rowspan="2">Họ tên nhân viên</th>
                                            <th>Phần cộng</th>
                                            <th colspan="5">Phần trừ</th>
                                            <th rowspan="2">Còn lại</th>
                                        </tr>
                                        <tr>
                                            <th>Hoàn thành đúng/sớm hơn tiến độ <br/>(+30%)</th>
                                            <th>Đi làm trễ quá 10p <br/>(-2đ)</th>
                                            <th>Nghỉ không phép <br/>(-3đ)</th>
                                            <th>Nghỉ có phép, xin về sớm sau 15h <br/>(-1đ)</th>
                                            <th>Nghỉ trễ liên tục quá 3 ngày <br/>(-5đ)</th>
                                            <th>Trễ deadline <br/>(-100% số điểm)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(emp, idx) in preview_data" :key="idx">
                                            <td>{{ idx + 1 }}</td>
                                            <td>{{ emp.fullname }}</td>
                                            <td>{{ emp.issue_completed }}</td>
                                            <td>{{ emp.late_10_minutes }}</td>
                                            <td>{{ emp.unpaid_leave }}</td>
                                            <td>{{ emp.paid_leave + emp.leave_soon + emp.forgot_checkout }}</td>
                                            <td>{{ emp.late_10_minutes_2 }}</td>
                                            <td>{{ emp.issue_delayed }}</td>
                                            <td>{{ emp.total }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </b-col>                           
                        <b-col cols=12>
                            <b-row class="align-items-center">
                                <b-col cols=12 xl=4 lg=4>
                                    <b-form-checkbox v-model="formData.high_priority" :value="true" :unchecked-value="false">
                                        High Priority
                                    </b-form-checkbox>       
                                </b-col>      
                                <b-col cols=12 xl=8 lg=8>        
                                    <div class="float-right">
                                        <form-button 
                                            type="submit" 
                                            variant="primary" 
                                            style="min-width: 250px" 
                                            :loading="isSubmitting" 
                                            :disabled="isSubmitting"
                                            loading-without-hidden-text
                                        >
                                            SAVE
                                        </form-button>
                                    </div>
                                </b-col>
                            </b-row>
                        </b-col>                 
                    </b-row>
                </b-col>
            </b-row>
        </b-form>
    </validation-observer>
</template>

<script>
    import moment from 'moment'

    export default {
        name: 'FormAnnouncement',

        props: {
            isSubmitting: {
                type: Boolean,
                default: false
            },

            data: {
                type: [Array, Object],
                default: null
            }
        },

        data: () => ({
            fetchingPreview: false,
            preview_data: [],
            formData: {
                thumbnail: null,
                thumbnail_url: null,
                upload_type: 'announcements',
                title: '',
                description: '',
                files: null,
                high_priority: false,
                expired_at: '',
                send_summary_point: false,
                summary_point_from: moment().format('YYYY-MM-DD'),
                summary_point_to: moment().format('YYYY-MM-DD'),
            }
        }),

        watch: {
            data(newval) {
                if(newval) {
                    this.initFormData()
                }
            },

            async 'formData.summary_point_from'(newval) {
                if(newval) {
                    await this.fetchPreviewData()
                }
            },

            async 'formData.summary_point_to'(newval) {
                if(newval) {
                    await this.fetchPreviewData()
                }
            },
        },

        async mounted() {
            if(!this.formData.expired_at) {
                this.formData.expired_at = this.$mm().format('YYYY-MM-DD')
            }

            if(this.data) {
                this.initFormData()
            }

            await this.fetchPreviewData()
        },

        methods: {
            initFormData() {
                Object.keys(this.formData).forEach(key => {
                    this.formData[key] = this.data[key]
                })

                this.formData.thumbnail = null
                this.formData.files = null
            },

            async onSubmit() {
                const formData = Object.assign({}, this.formData)
                this.$delete(formData, 'thumbnail_url')
                this.$emit('submit', {formData: this.$objToFormData(formData), refs: this.$refs})
            },

            async fetchPreviewData() {
                if(this.fetchingPreview) return

                try {
                    this.fetchingPreview = true
                    const {summary_point_from , summary_point_to} = this.formData
                    const { data } = await this.$http.get('employee/point-summary', {params: {from: summary_point_from, to: summary_point_to}})

                    if(!data.error) {
                        this.preview_data = data.data
                    }
                } catch (err) {
                    console.log(err)
                } finally {
                    this.fetchingPreview = false
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
.thumbnail {
    min-width: 185px;
    height: 238px;
    border-radius: 10px;
    overflow: hidden;
}

.table-center {
    font-size: 12px;

    tr td, tr th {
        text-align: center;
        vertical-align: middle;
    }
}
</style>