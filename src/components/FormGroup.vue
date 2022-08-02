<template>
    <b-form-group 
        :label="label" 
        :invalid-feedback="error" 
        :state="state"
        :label-class="{
            'font-weight-medium label-required': required === true
        }"
    >
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
        <b-select2
            :name="name"
            :value="value" 
            :placeholder="placeholder"
            :readonly="readonly"
            :options="options"
            :state="stateToString"
            :reduce="config.reduce"
            :searchable="config.searchable"
            :selectable="config.selectable"
            :clearable="config.clearable"
            :loading="loading"
            :required="required"
            :class="customClass"
            @input="$emit('input', $event)"
            v-if="mode == 'select'"        
        />
        <b-form-datepicker 
            v-if="mode == 'datepicker'"
            :value="value" 
            :state="state"
            :readonly="readonly"
            :date-format-options="{year: 'numeric', month: 'numeric', day: 'numeric'}"
            locale="vi"         
            :required="required"   
            :class="customClass"
            @input="$emit('input', $event)"
        />
        <b-form-file 
            v-if="mode == 'file'"
            :class="customClass"
            :name="name"
            :value="value" 
            :state="state"
            :accept="accept"
            :placeholder="placeholder" 
            :required="required"
            @input="$emit('input', $event)"
        />        
    </b-form-group>   
</template>

<script>
    export default {
        props: {
            type: String,
            accept: String,
            label: String,
            name: String,
            placeholder: String,
            state: Boolean,
            error: String,
            readonly: Boolean,
            loading: Boolean,
            required: Boolean,
            value: [String, Number, File],
            options: [Array, Object],
            customClass: String,
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
            },
        },

        computed: {
            stateToString() {
                return this.state === null ? false : (new Boolean(this.state)).toString()
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>