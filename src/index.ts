import type { App, Component } from 'vue';

import Alert from './components/Alert.vue';
import Badge from './components/Badge.vue';
import Breadcrumbs from './components/Breadcrumbs.vue';
import Button from './components/Button.vue';
import ButtonGroup from './components/ButtonGroup.vue';
import Card from './components/Card.vue';
import Chart from './components/Chart.vue';
import Checkbox from './components/Checkbox.vue';
import CodeLine from './components/CodeLine.vue';
import CodePreview from './components/CodePreview.vue';
import ConfigValue from './components/ConfigValue.vue';
import CopyButton from './components/CopyButton.vue';
import DescriptionItem from './components/DescriptionItem.vue';
import DescriptionList from './components/DescriptionList.vue';
import Dropdown from './components/Dropdown.vue';
import DropdownItem from './components/DropdownItem.vue';
import EmptyState from './components/EmptyState.vue';
import Field from './components/Field.vue';
import FileInput from './components/FileInput.vue';
import FilterBar from './components/FilterBar.vue';
import FormActions from './components/FormActions.vue';
import FormGrid from './components/FormGrid.vue';
import Icon from './components/Icon.vue';
import IconBadge from './components/IconBadge.vue';
import IdCell from './components/IdCell.vue';
import Input from './components/Input.vue';
import KnowledgeSchemaPanel from './components/KnowledgeSchemaPanel.vue';
import Label from './components/Label.vue';
import LabeledCodeBlock from './components/LabeledCodeBlock.vue';
import Link from './components/Link.vue';
import List from './components/List.vue';
import ListIcon from './components/ListIcon.vue';
import ListRow from './components/ListRow.vue';
import Metric from './components/Metric.vue';
import MetricGrid from './components/MetricGrid.vue';
import Modal from './components/Modal.vue';
import NumericCell from './components/NumericCell.vue';
import Pagination from './components/Pagination.vue';
import PageHeading from './components/PageHeading.vue';
import PrimarySubtitleCell from './components/PrimarySubtitleCell.vue';
import Progress from './components/Progress.vue';
import Radio from './components/Radio.vue';
import RadioGroup from './components/RadioGroup.vue';
import ResourceList from './components/ResourceList.vue';
import SearchableSelect from './components/SearchableSelect.vue';
import Select from './components/Select.vue';
import Skeleton from './components/Skeleton.vue';
import StatusBadge from './components/StatusBadge.vue';
import Stepper from './components/Stepper.vue';
import Tab from './components/Tab.vue';
import Table from './components/Table.vue';
import TableRow from './components/TableRow.vue';
import Td from './components/Td.vue';
import Textarea from './components/Textarea.vue';
import Th from './components/Th.vue';
import Toaster from './components/Toaster.vue';
import Toggle from './components/Toggle.vue';

export {
    Alert,
    Badge,
    Breadcrumbs,
    Button,
    ButtonGroup,
    Card,
    Chart,
    Checkbox,
    CodeLine,
    CodePreview,
    ConfigValue,
    CopyButton,
    DescriptionItem,
    DescriptionList,
    Dropdown,
    DropdownItem,
    EmptyState,
    Field,
    FileInput,
    FilterBar,
    FormActions,
    FormGrid,
    Icon,
    IconBadge,
    IdCell,
    Input,
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
    NumericCell,
    Pagination,
    PageHeading,
    PrimarySubtitleCell,
    Progress,
    Radio,
    RadioGroup,
    ResourceList,
    SearchableSelect,
    Select,
    Skeleton,
    StatusBadge,
    Stepper,
    Tab,
    Table,
    TableRow,
    Td,
    Textarea,
    Th,
    Toaster,
    Toggle,
};

export { useToast, push as pushToast } from './composables/useToast';
export type { Toast, ToastType, ToastInput } from './composables/useToast';
export { icons } from './icons';
export type { IconName } from './icons';
export { formControlClasses } from './helpers/formControlClasses';
export { areaChartOptions, chartBaseOptions, cssToken } from './helpers/chartTheme';
export type { SelectOption } from './components/Select.vue';
export type { Step } from './components/Stepper.vue';
export type { BreadcrumbItem } from './components/Breadcrumbs.vue';

/**
 * Every atom keyed by the name it registers under globally. Names are used
 * verbatim in templates (e.g. `<Button>`, `<Card>`) when the plugin is installed.
 */
const components: Record<string, Component> = {
    Alert,
    Badge,
    Breadcrumbs,
    Button,
    ButtonGroup,
    Card,
    Chart,
    Checkbox,
    CodeLine,
    CodePreview,
    ConfigValue,
    CopyButton,
    DescriptionItem,
    DescriptionList,
    Dropdown,
    DropdownItem,
    EmptyState,
    Field,
    FileInput,
    FilterBar,
    FormActions,
    FormGrid,
    Icon,
    IconBadge,
    IdCell,
    Input,
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
    NumericCell,
    Pagination,
    PageHeading,
    PrimarySubtitleCell,
    Progress,
    Radio,
    RadioGroup,
    ResourceList,
    SearchableSelect,
    Select,
    Skeleton,
    StatusBadge,
    Stepper,
    Tab,
    Table,
    TableRow,
    Td,
    Textarea,
    Th,
    Toaster,
    Toggle,
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
