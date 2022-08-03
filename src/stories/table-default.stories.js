import TableDefault from './templates/TableDefault.vue';

export default {
  title: 'table-default',
  component: TableDefault 
};

const Template = (args, { argTypes }) => ({
    components: { TableDefault },
    props: Object.keys(argTypes),
    template: '<TableDefault v-bind="$props"></TableDefault>'
});

export const Default= Template.bind({});

const mockupColumns = [
    {label: 'ID', name: 'id'},
    {label: 'First name', name: 'first_name'},
    {label: 'Last name', name: 'last_name'},
    {label: 'Phone', name: 'phone'},
    {label: 'Email', name: 'email'},
    {label: 'Action', name: 'action'},
];

const mockupData = [
    {id: 1, first_name: 'John', last_name: 'Doe', phone: '0123456789', email: 'john_doe@example.com'},
    {id: 2, first_name: 'Justin', last_name: 'Bieber', phone: '0123456789', email: 'jb@example.com'},
    {id: 3, first_name: 'Paul', last_name: 'Walker', phone: '0123456789', email: 'paul_walker@example.com'},
    {id: 4, first_name: 'Test', last_name: 'User', phone: '0987654321', email: 'testtest@example.com'},
    {id: 5, first_name: 'Lee', last_name: 'Min Ho', phone: '0123456789', email: 'lee.minho@example.com'},
]

Default.args = {
    columns: mockupColumns,
    tableData: mockupData,
    config: {
        url: null,
        per_page: 10
    },
    showColumns: true,
    responsive: true,
    hover: false,
    selectable: false,
    searchable: false
}