import FormButtonIcon from '../components/FormButtonIcon.vue';

export default {
  title: 'form-button-icon',
  component: FormButtonIcon,
  argTypes: {
    variant: {control: {type: 'select', options: ['primary', 'secondary', 'info', 'warning', 'danger', 'success', 'dark', 'light']}},
    type: {control: {type: 'select', options: ['button', 'submit']}},
    size: {control: {type: 'select', options: ['sm', 'md']}},
    fill: {control: {type: 'select', options: ['clear', 'bg-primary', 'bg-secondary', 'bg-light', 'bg-info', 'bg-success', 'bg-danger', 'bg-warning']}},
  }  
};

const Template = (args, { argTypes }) => ({
    components: { FormButtonIcon },
    props: Object.keys(argTypes),
    template: '<FormButtonIcon v-bind="$props"></FormButtonIcon>'
});

const other_args = {
    icon: 'ant-design:home-filled',
    type: 'button',
    size: 'md',
    fill: 'clear',
    loading: false,
    disabled: false,
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