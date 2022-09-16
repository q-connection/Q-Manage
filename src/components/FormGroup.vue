<template>
    <b-form-group 
        :label="label" 
        :invalid-feedback="error" 
        :state="state"
        :description="description"
        :label-class="{
            'font-weight-medium label-required': required === true
        }"
    >
        <template #description>
            <slot name="description"></slot>
        </template>
        <template #label>
            <slot name="label"></slot>
        </template>
        <b-form-input
            :name="name"
            :type="type"
            :value="value" 
            :readonly="readonly" 
            :state="state"
            :placeholder="placeholder"
            :loading="loading"
            :required="required"
            :class="customClass"
            @input="$emit('input', $event)"
            v-if="mode == 'input'"
        /> 
        <b-form-textarea
            :name="name"
            :type="type"
            :value="value" 
            :readonly="readonly" 
            :state="state"
            :placeholder="placeholder"
            :loading="loading"
            :required="required"
            :class="customClass"
            :rows="rows"
            @input="$emit('input', $event)"
            v-if="mode == 'textarea'"
        /> 
        <b-select2
            :name="name"
            :value="value" 
            :placeholder="placeholder"
            :readonly="readonly"
            :options="options"
            :state="stateToString"
            :loading="loading"
            :required="required"
            :class="customClass"
            :multiple="multiple"
            :disabled="disabled"
            @input="$emit('input', $event)"
            v-bind="config"
            v-if="mode == 'select'"        
        />
        <b-form-datepicker2 
            v-if="mode == 'datepicker'"
            :value="value" 
            :state="state"
            :readonly="readonly"
            :required="required"   
            :class="customClass"
            @input="$emit('input', $event)"
            :placeholder="placeholder || 'Select date'"
            value-type="format"
            title-format="DD/MM/YYYY"
            :disabled-date="disableDates"
            :editable="false"
            :clearable="false"
            :renderInputText="val => $mm(val).isValid() ? $mm(val).format(options?.dateTextFormat || 'DD/MM/YYYY') : ''"
            v-bind="options"
        >
            <template #icon-calendar>
                <q-icon icon="ant-design:calendar-filled"/>
            </template>
        </b-form-datepicker2>
        <b-form-file 
            v-if="mode == 'file'"
            :class="customClass"
            :name="name"
            :value="value" 
            :state="state"
            :accept="accept"
            :placeholder="placeholder" 
            :required="required"
            :multiple="multiple"
            @input="$emit('input', $event)"
        />      
        <div class="color-picker" v-if="mode == 'color'">
            <div class="pr-2">
                <b-button variant="primary" @click="$emit('input', colors[0])">
                    <span class="h5 p-0 m-0" style="line-height: 0">
                        <q-icon icon="bx:refresh"/>
                    </span>
                </b-button>
            </div>
            <div class="color-picker--input">
                <b-form-input
                    :name="name"
                    :type="type"
                    :value="value" 
                    :state="state"
                    :placeholder="placeholder"
                    :loading="loading"
                    :required="required"
                    :class="customClass"
                    @input="$emit('input', $event)"
                    readonly
                    @click="colorActive = !colorActive"
                />   
                <div class="color-picker--input__wrapper" :class="{active: colorActive}">
                    <div class="color-picker--input__wrapper-content">
                        <div class="small font-weight-bold mt-1">Choose from default colors:</div>
                        <div class="colors mt-1">
                            <div class="colors-item" v-for="(color, index) in colors" :key="index" @click="$emit('input', color)">
                                <div class="colors-item--box" :style="{backgroundColor: color}"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>          
        </div>
    </b-form-group>
</template>

<script>
    export default {
        props: {
            type: String,
            accept: String,
            label: String,
            description: String,
            name: String,
            placeholder: String,
            error: String,
            rows: String,
            min: [String, Number, Date],
            max: [String, Number, Date],
            readonly: Boolean,
            loading: Boolean,
            required: Boolean,
            value: [String, Number, File, Array, Date],
            options: [Array, Object],
            customClass: String,
            state: {
                default: null
            },
            multiple: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            config: {
                type: Object,
                default: () => ({
                    reduce: item => item.value,
                    clearable: false
                })
            },
            mode: {
                type: String,
                default: 'input'
            }
        },

        data: () => ({
            colorActive: false
        }),

        computed: {
            stateToString() {
                return this.state === null ? false : (new Boolean(this.state)).toString()
            },

            colors() {
                return [
                    '#A72218',
                    '#C84B25',
                    '#F3CC45',
                    '#3E882D',
                    '#2D6973',
                    '#3A74D4',
                    '#2151C5',
                    '#4C1DDE',
                    '#DD9A97',
                    '#F2D2C6',
                    '#FCF2C5',
                    '#C8DFC8',
                    '#C4D9DB',
                    '#CADDF3',
                    '#C3D3EF',
                    '#D1C5F5'
                ]
            }          
        },
        methods: {
            disableDates(date) {
                if(this.min) {
                    const min = this.$mm(this.min).toDate()

                    return date < min
                }          

                if(this.max) {
                    const max = this.$mm(this.max).toDate()

                    return date > max                 
                }

                return false
            }              
        }
    }
</script>

<style lang="scss" scoped>
.color-picker {
    display: flex;
    width: 100%;
    
    .btn {
        height: 100%;
        min-width: 28px;
        transition: .35s    ;
    }

    .color-picker--input {
        .form-control {
            width: 100%;
            cursor: pointer;
        }

        .color-picker--input__wrapper {
            position: relative;
            overflow: hidden;

            .color-picker--input__wrapper-content {
                position: relative;
                overflow: hidden;         
                height: 0px;
                transform: translateY(-100%);
                transition: .35s;
            }

            .colors {
                display: flex;
                flex-wrap: wrap;
                -ms-flex-wrap: wrap;

                .colors-item {
                    padding: 4px;
                    cursor: pointer;

                    .colors-item--box {
                        width: 18px;
                        height: 18px;
                        border-radius: 5px;
                    }
                }
            }

            &.active {
                .color-picker--input__wrapper-content {
                    height: 80px;
                    transform: translateY(0);
                }
            }
        }
    }
}
</style>