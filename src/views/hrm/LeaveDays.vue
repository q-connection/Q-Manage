<template>
<div class="page-content" :class="{hrm: inHrmRoutes === true}">
    <b-container fluid>
        <b-row>
            <b-col cols=12>
                <div class="d-flex align-items-center justify-content-between">
                    <h5 class="mb-0">Statistics</h5>
                    <form-group
                        mode="datepicker"
                        placeholder="Select Year"
                        v-model="year"
                        date-format="YYYY"
                        :options="{type: 'year', dateTextFormat: 'YYYY'}"
                    />
                </div>
                <table class="table-leave-days table table-bordered table-hover mb-4">
                    <thead>
                        <tr>
                            <th rowspan="2">STT</th>
                            <th rowspan="2">Tên nhân viên</th>
                            <th colspan="12">Tháng làm việc</th>
                            <th rowspan="2">Số ngày nghỉ trong năm</th>
                            <th rowspan="2">Tiêu chuẩn phép</th>
                            <th rowspan="2">Phép năm cũ</th>
                            <th rowspan="2">Phép còn lại</th>
                            <th rowspan="2">HDLD</th>
                            <th rowspan="2">Năm ký</th>
                        </tr>
                        <tr>
                            <th>1</th>
                            <th>2</th>
                            <th>3</th>
                            <th>4</th>
                            <th>5</th>
                            <th>6</th>
                            <th>7</th>
                            <th>8</th>
                            <th>9</th>
                            <th>10</th>
                            <th>11</th>
                            <th>12</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(emp, index) in statistics" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ emp.fullname }}</td>
                            <td :class="{'bg-danger': !isMonthValid(emp, 1)}">{{ emp.jan }}</td>
                            <td :class="{'bg-danger': !isMonthValid(emp, 2)}">{{ emp.feb }}</td>
                            <td :class="{'bg-danger': !isMonthValid(emp, 3)}">{{ emp.mar }}</td>
                            <td :class="{'bg-danger': !isMonthValid(emp, 4)}">{{ emp.apr }}</td>
                            <td :class="{'bg-danger': !isMonthValid(emp, 5)}">{{ emp.may }}</td>
                            <td :class="{'bg-danger': !isMonthValid(emp, 6)}">{{ emp.jun }}</td>
                            <td :class="{'bg-danger': !isMonthValid(emp, 7)}">{{ emp.jul }}</td>
                            <td :class="{'bg-danger': !isMonthValid(emp, 8)}">{{ emp.aug }}</td>
                            <td :class="{'bg-danger': !isMonthValid(emp, 9)}">{{ emp.sep }}</td>
                            <td :class="{'bg-danger': !isMonthValid(emp, 10)}">{{ emp.oct }}</td>
                            <td :class="{'bg-danger': !isMonthValid(emp, 11)}">{{ emp.nov }}</td>
                            <td :class="{'bg-danger': !isMonthValid(emp, 12)}">{{ emp.dec }}</td>
                            <td>{{ emp.total }}</td>
                            <td>{{ calcValidDays(emp) }}</td>
                            <td>{{ emp.old_leave_days }}</td>
                            <td>{{ parseFloat(emp.available_leave_days) + parseFloat(emp.old_leave_days) }}</td>
                            <td>
                                <div class="font-weight-bold" v-if="emp.contract_type == 'official'">Official</div>
                                <div class="font-weight-bold" v-if="emp.contract_type == 'freelancer'">Freelancer</div>
                                <div class="font-weight-bold" v-if="emp.contract_type == 'probation'">Probation</div>                                
                            </td>
                            <td>
                                <div class="font-weight-bold">{{ emp.contract_date }}</div>                             
                            </td>
                        </tr>
                        <tr v-if="statistics.length <= 0">
                            <td colspan="18">Không có dữ liệu.</td>
                        </tr>
                        <tr v-else>
                            <th colspan="2">Tổng cộng</th>
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.jan)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.feb)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.mar)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.apr)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.may)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.jun)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.jul)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.aug)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.sep)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.oct)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.nov)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.dec)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.total)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => calcValidDays(item)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.old_leave_days)) }}</td>                         
                            <td>{{ $lodash.sumBy(statistics, item => parseFloat(item.available_leave_days) + parseFloat(item.old_leave_days)) }}</td>      
                            <td></td>                   
                            <td></td>                   
                        </tr>
                    </tbody>
                </table>
            </b-col>
            <b-col cols=12>
                <TableLeaveDays for-hrm/>
            </b-col>
        </b-row>
    </b-container>
</div>
</template>

<script>
    import TableLeaveDays from '@/components/leave-days/Table.vue'
    import moment from 'moment'

    export default {
        name: 'HrmLeaveDays',
        components: {TableLeaveDays},
        data: () => ({
            statistics: [],
            year: moment().year()
        }),
        watch: {
            async year() {
                await this.fetchStatistics()
            }
        },
        async mounted() {
            await this.fetchStatistics()
        },
        methods: {
            async fetchStatistics() {
                try {
                    const { data } = await this.$http.get('annual-leave/statistics', {params: {year: this.year}})

                    if(!data.error) {
                        this.statistics = data.data
                    }
                } catch (err) {
                    console.log(err)
                }
            },

            calcValidDays(emp) {
                if(!emp.contract_date) return 0
                const contract_date = this.$mm(emp.contract_date)

                if(parseInt(contract_date.format('YYYY')) != parseInt(this.year)) {
                    return 12;
                } 

                return 12 - parseInt(contract_date.format('MM'))
            },

            isMonthValid(emp, month) {
                if(!emp.contract_date) return false
                const contract_date = this.$mm(emp.contract_date)

                if(parseInt(contract_date.format('YYYY')) == parseInt(this.year)) {
                    return parseInt(contract_date.format('M')) >= month
                }                

                if(parseInt(contract_date.format('YYYY')) > parseInt(this.year)) {
                    return false
                }

                return true
            }
        }
    }
</script>

<style lang="scss" scoped>
.table-leave-days {
    th, td {
        vertical-align: middle;
        text-align: center;
    }

    thead {
        th {
            background-color: var(--primary);
            color: #fff
        }
    }
}
</style>