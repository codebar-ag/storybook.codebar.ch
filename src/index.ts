import type { App, Component } from 'vue';

import Accordion from './components/molecules/Accordion.vue';
import AccordionItem from './components/molecules/AccordionItem.vue';
import Alert from './components/molecules/Alert.vue';
import AuthLayout from './components/layouts/AuthLayout.vue';
import Avatar from './components/atoms/Avatar.vue';
import Badge from './components/atoms/Badge.vue';
import Breadcrumbs from './components/molecules/Breadcrumbs.vue';
import Button from './components/atoms/Button.vue';
import ButtonGroup from './components/molecules/ButtonGroup.vue';
import AppShell from './components/layouts/AppShell.vue';
import Card from './components/molecules/Card.vue';
import Chart from './components/organisms/Chart.vue';
import Checkbox from './components/atoms/Checkbox.vue';
import CodeLine from './components/molecules/CodeLine.vue';
import CodePreview from './components/organisms/CodePreview.vue';
import Combobox from './components/molecules/Combobox.vue';
import ConfigValue from './components/organisms/ConfigValue.vue';
import CopyButton from './components/molecules/CopyButton.vue';
import DataTable from './components/organisms/DataTable.vue';
import DescriptionItem from './components/molecules/DescriptionItem.vue';
import Drawer from './components/organisms/Drawer.vue';
import DescriptionList from './components/molecules/DescriptionList.vue';
import Divider from './components/atoms/Divider.vue';
import Dropdown from './components/molecules/Dropdown.vue';
import DropdownItem from './components/molecules/DropdownItem.vue';
import EmptyState from './components/molecules/EmptyState.vue';
import ErrorLayout from './components/layouts/ErrorLayout.vue';
import Field from './components/molecules/Field.vue';
import FileInput from './components/molecules/FileInput.vue';
import FilterBar from './components/molecules/FilterBar.vue';
import FormActions from './components/molecules/FormActions.vue';
import FormGrid from './components/molecules/FormGrid.vue';
import Icon from './components/atoms/Icon.vue';
import IconBadge from './components/atoms/IconBadge.vue';
import IdCell from './components/atoms/IdCell.vue';
import Input from './components/atoms/Input.vue';
import InputNumber from './components/molecules/InputNumber.vue';
import Kbd from './components/atoms/Kbd.vue';
import KnowledgeSchemaPanel from './components/organisms/KnowledgeSchemaPanel.vue';
import Label from './components/atoms/Label.vue';
import LabeledCodeBlock from './components/molecules/LabeledCodeBlock.vue';
import Link from './components/atoms/Link.vue';
import List from './components/molecules/List.vue';
import ListIcon from './components/atoms/ListIcon.vue';
import ListRow from './components/molecules/ListRow.vue';
import Metric from './components/atoms/Metric.vue';
import MetricGrid from './components/organisms/MetricGrid.vue';
import Modal from './components/organisms/Modal.vue';
import Navbar from './components/organisms/Navbar.vue';
import NumericCell from './components/atoms/NumericCell.vue';
import PasswordInput from './components/molecules/PasswordInput.vue';
import PinInput from './components/molecules/PinInput.vue';
import Pagination from './components/molecules/Pagination.vue';
import PageHeading from './components/molecules/PageHeading.vue';
import Popover from './components/molecules/Popover.vue';
import PrimarySubtitleCell from './components/atoms/PrimarySubtitleCell.vue';
import Progress from './components/atoms/Progress.vue';
import Radio from './components/atoms/Radio.vue';
import RadioGroup from './components/molecules/RadioGroup.vue';
import ResourceList from './components/organisms/ResourceList.vue';
import SearchableSelect from './components/molecules/SearchableSelect.vue';
import Select from './components/atoms/Select.vue';
import Sidebar from './components/organisms/Sidebar.vue';
import SidebarGroup from './components/organisms/SidebarGroup.vue';
import SidebarItem from './components/organisms/SidebarItem.vue';
import Skeleton from './components/atoms/Skeleton.vue';
import Spinner from './components/atoms/Spinner.vue';
import StatusBadge from './components/atoms/StatusBadge.vue';
import Stepper from './components/molecules/Stepper.vue';
import Tab from './components/atoms/Tab.vue';
import Tabs from './components/molecules/Tabs.vue';
import Table from './components/organisms/Table.vue';
import TableRow from './components/molecules/TableRow.vue';
import Td from './components/atoms/Td.vue';
import Textarea from './components/atoms/Textarea.vue';
import Th from './components/atoms/Th.vue';
import Toaster from './components/organisms/Toaster.vue';
import Tooltip from './components/molecules/Tooltip.vue';
import Toggle from './components/atoms/Toggle.vue';

export {
    Accordion,
    AccordionItem,
    Alert,
    AppShell,
    AuthLayout,
    Avatar,
    Badge,
    Breadcrumbs,
    Button,
    ButtonGroup,
    Card,
    Chart,
    Checkbox,
    CodeLine,
    CodePreview,
    Combobox,
    ConfigValue,
    CopyButton,
    DataTable,
    DescriptionItem,
    DescriptionList,
    Divider,
    Drawer,
    Dropdown,
    DropdownItem,
    EmptyState,
    ErrorLayout,
    Field,
    FileInput,
    FilterBar,
    FormActions,
    FormGrid,
    Icon,
    IconBadge,
    IdCell,
    Input,
    InputNumber,
    Kbd,
    KnowledgeSchemaPanel,
    Label,
    LabeledCodeBlock,
    Link,
    List,
    ListIcon,
    ListRow,
    Metric,
    MetricGrid,
    Modal,
    Navbar,
    NumericCell,
    PageHeading,
    Pagination,
    PasswordInput,
    PinInput,
    Popover,
    PrimarySubtitleCell,
    Progress,
    Radio,
    RadioGroup,
    ResourceList,
    SearchableSelect,
    Select,
    Sidebar,
    SidebarGroup,
    SidebarItem,
    Skeleton,
    Spinner,
    StatusBadge,
    Stepper,
    Tab,
    Table,
    TableRow,
    Tabs,
    Td,
    Textarea,
    Th,
    Toaster,
    Toggle,
    Tooltip,
};

// Naming alias — `Switch` is the conventional name for this control; Toggle
// stays the canonical export.
export { default as Switch } from './components/atoms/Toggle.vue';

export { useToast, push as pushToast } from './composables/useToast';
export type { Toast, ToastType, ToastInput } from './composables/useToast';
export { useRootAttrs } from './composables/useRootAttrs';
export { useFieldA11y } from './composables/useFieldA11y';
export { usePasswordManagerAttrs } from './composables/usePasswordManagerAttrs';
export { useClickOutside } from './composables/useClickOutside';
export { useEscapeKey } from './composables/useEscapeKey';
export { useFocusTrap } from './composables/useFocusTrap';
export { useScrollLock } from './composables/useScrollLock';
export { useControllable } from './composables/useControllable';
export { useSort } from './composables/useSort';
export type { SortState, SortDir } from './composables/useSort';
export { useSelection } from './composables/useSelection';
export type { RowKey } from './composables/useSelection';
export { usePagination } from './composables/usePagination';
export { useListNavigation } from './composables/useListNavigation';
export { useFormErrors } from './composables/useFormErrors';
export { icons } from './icons';
export type { IconName } from './icons';
export { cx } from './helpers/cx';
export { resolveTone } from './helpers/tone';
export type { Tone, LegacyTone } from './helpers/tone';
export { formControlClasses } from './helpers/formControlClasses';
export { areaChartOptions, chartBaseOptions, cssToken } from './helpers/chartTheme';
export type { SelectOption } from './components/atoms/Select.vue';
export type { Step } from './components/molecules/Stepper.vue';
export type { BreadcrumbItem } from './components/molecules/Breadcrumbs.vue';
export type { TabItem } from './components/molecules/Tabs.vue';
export type { DataTableColumn } from './components/organisms/dataTable.types';

/**
 * Every atom keyed by the name it registers under globally. Names are used
 * verbatim in templates (e.g. `<Button>`, `<Card>`) when the plugin is installed.
 */
const components: Record<string, Component> = {
    Accordion,
    AccordionItem,
    Alert,
    AppShell,
    AuthLayout,
    Avatar,
    Badge,
    Breadcrumbs,
    Button,
    ButtonGroup,
    Card,
    Chart,
    Checkbox,
    CodeLine,
    CodePreview,
    Combobox,
    ConfigValue,
    CopyButton,
    DataTable,
    DescriptionItem,
    DescriptionList,
    Divider,
    Drawer,
    Dropdown,
    DropdownItem,
    EmptyState,
    ErrorLayout,
    Field,
    FileInput,
    FilterBar,
    FormActions,
    FormGrid,
    Icon,
    IconBadge,
    IdCell,
    Input,
    InputNumber,
    Kbd,
    KnowledgeSchemaPanel,
    Label,
    LabeledCodeBlock,
    Link,
    List,
    ListIcon,
    ListRow,
    Metric,
    MetricGrid,
    Modal,
    Navbar,
    NumericCell,
    PageHeading,
    Pagination,
    PasswordInput,
    PinInput,
    Popover,
    PrimarySubtitleCell,
    Progress,
    Radio,
    RadioGroup,
    ResourceList,
    SearchableSelect,
    Select,
    Sidebar,
    SidebarGroup,
    SidebarItem,
    Skeleton,
    Spinner,
    StatusBadge,
    Stepper,
    Tab,
    Table,
    TableRow,
    Tabs,
    Td,
    Textarea,
    Th,
    Toaster,
    Toggle,
    Tooltip,
    // Alias registration so templates can use <Switch> interchangeably.
    Switch: Toggle,
};

/**
 * Vue plugin that registers every flows atom globally, so Inertia pages can use
 * `<Button>`, `<Card>`, … without per-file imports:
 *
 *     import { Flows } from '@codebar-ag/storybook';
 *     createApp(...).use(Flows);
 */
export const Flows = {
    install(app: App): void {
        for (const [name, component] of Object.entries(components)) {
            app.component(name, component);
        }
    },
};

export default Flows;
