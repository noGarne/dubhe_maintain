import Vue from 'vue'
import { 
    Button, 
    ButtonGroup,
    Table, 
    TableColumn, 
    Message, 
    Dialog, 
    MessageBox,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Form,
    FormItem,
    Input,
    Popover,
    Tooltip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
	Autocomplete,
    Tabs,
    TabPane,
    Collapse,
    CollapseItem,
    Scrollbar,
    Checkbox,
    CheckboxGroup,
    Select,
    DatePicker,
    Slider,
    Option,
    Cascader,
    Loading,
    Radio,
    RadioGroup,
    RadioButton,
    Notification,
	ColorPicker,
    Container,
    Header,
    Main,
    Transfer,
    TimePicker,
    Aside,
    Calendar,
    Footer,
    Tree,
    Pagination,
    Card,
    Progress,
    Switch,
    Badge,
} from 'element-ui'
// import elementUi from 'element-ui'

Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(ColorPicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Dropdown);
Vue.use(DropdownItem);
Vue.use(DropdownMenu);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Scrollbar);
Vue.use(Slider);
Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Transfer);
Vue.use(Aside);
Vue.use(Footer);
Vue.use(Calendar);
Vue.use(Pagination);
Vue.use(Tree);
Vue.use(Card);
Vue.use(Progress);
Vue.use(Switch);
Vue.use(Badge);
Vue.use(Autocomplete);


Vue.use(Loading.directive);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;
