import FormButton from '../components/FormButton.vue';

export default {
  title: 'form-button',
  component: FormButton,
  argTypes: {
    variant: {control: {type: 'select', options: ['primary', 'secondary', 'info', 'warning', 'danger', 'success', 'dark', 'light']}},
    type: {control: {type: 'select', options: ['button', 'submit']}},
    size: {control: {type: 'select', options: ['sm', 'md']}}
  }  
};

const Template = (args, { argTypes }) => ({
    components: { FormButton },
    props: Object.keys(argTypes),
    template: '<FormButton v-bind="$props">{{ label }}</FormButton>'
});

const other_args = {
    type: 'button',
    size: 'md',
    loading: false,
    block: false,
    disabled: false,
    loadingWithoutHiddenText: false,
    label: 'Button'
}

//👇 Each story then reuses that template
export const Primary = Template.bind({});
Primary.args = Object.assign({variant: 'primary'}, other_args);

export const Secondary = Template.bind({});
Secondary.args = Object.assign({variant: 'secondary'}, other_args);

export const Success = Template.bind({});
Success.args = Object.assign({variant: 'success'}, other_args);

export const Danger = Template.bind({});
Danger.args = Object.assign({variant: 'danger'}, other_args);

export const Info = Template.bind({});
Info.args = Object.assign({variant: 'info'}, other_args);