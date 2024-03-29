import {
  CheckBoxState,
  ElementProps,
  GridCheckBoxProps,
  GridIconButton,
  GridMenuProps,
  LibraryAdapter,
  TreeNodeType,
  VirtualTreeNode,
} from "@ezgrid/grid-core";
import {
  AddCircle,
  ArrowBack,
  ArrowForward,
  Cancel,
  DeleteOutline,
  DoneOutline,
  Edit,
  FileCopy,
  EditAttributes,
  ExpandLess,
  ExpandMore,
  CloudDownload as FileDownload,
  Search as FilterAlt,
  FilterList,
  FirstPage,
  GridOn as GridView,
  LastPage,
  PictureAsPdf,
  RemoveCircle,
  Undo as RestartAlt,
  Save,
  Settings,
  UnfoldLess,
  UnfoldMore,
  BarChart,
  ControlPoint
} from "@material-ui/icons";
import {
  Checkbox,
  Divider,
  IconButton,
  List,
  MenuItem,
  Select,
  TextField,
  Theme,
  Button
} from "@material-ui/core";
import { MuiPickersUtilsProvider, DatePicker as MuiDatePicker } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment'


import { createElement, ReactNode, Ref } from "react";
export const generateIcon = (icon: ReactNode, { onClick, disabled, title, className, style }: any, textAndIcon?: boolean) =>
  textAndIcon ? <Button color="primary" key={className} size="small" onClick={onClick} disabled={disabled} title={title} style={style} variant="outlined" startIcon={icon}>
    {title}
  </Button> :
    <IconButton color="primary" key={className} size="small" onClick={onClick} disabled={disabled} title={title} style={style}>
      {icon}
    </IconButton>;

export const materialNodePropsFunction =
  (theme: Theme) => (node: VirtualTreeNode, props: ElementProps) => {
    if (node.type === TreeNodeType.Grid) {
      return {
        ...props,
        style: {
          ...props.style,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
      };
    } else if (node.type === TreeNodeType.Row) {
      if (props.className.indexOf("active-row") >= 0) {
        return {
          ...props,
          style: {
            ...props.style,
            backgroundColor: theme.palette.action.focus,
            color: theme.palette.text.primary,
          },
        };
      } else if (props.className.indexOf("selected-row") >= 0) {
        return {
          ...props,
          style: {
            ...props.style,
            backgroundColor: theme.palette.action.selected,
            color: theme.palette.text.primary,
          },
        };
      }
    }
    return props;
  };
export const materialAdapter: LibraryAdapter = {
  createElementFromNode: (
    node: VirtualTreeNode,
    props: Record<string, unknown>,
    children: unknown
  ): unknown => {
    let propsToApply = props;
    if (node.key.indexOf("remove-circle-icon") >= 0) {
      return generateIcon(<RemoveCircle />, props);
    } else if (node.key.indexOf("add-circle-icon") >= 0) {
      return generateIcon(<AddCircle />, props);
    } else if (node.key.indexOf("expand-one-icon") >= 0) {
      return generateIcon(<ExpandMore />, props);
    } else if (node.key.indexOf("collapse-one-icon") >= 0) {
      return generateIcon(<ExpandLess />, props);
    }
    return createElement(
      "div",
      propsToApply,
      children as string | (ReactNode | ReactNode[])[]
    );
  },
  createSelectField: (props): unknown => {
    const { onChange, ref, style, options, value, fullWidth } = props;
    if (options?.length === 0) return null;

    return (
      <Select
        onChange={(e) => {
          onChange?.(e.target.value as string | number);
        }}
        style={style}
        inputRef={ref as Ref<any>}
        value={value}
        variant="standard"
        fullWidth={fullWidth === false ? false : true}
      >
        {(options || []).map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    );
  },
  createDateField: (props): unknown => {
    const { onChange, value } = props;
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <MuiDatePicker
          autoOk
          disableToolbar
          format={'ddd, MMM D'}
          InputProps={{
            disableUnderline: true,
          }}
          onChange={(data) => onChange?.(data?.toDate())}
          value={value}
          variant="inline"
        />
      </MuiPickersUtilsProvider>
    );
  },

  createTextField: (props): unknown => {
    const { onChange, placeholder, attributes, ref, style, readOnly, onClick, ...rest } = props;
    return <TextField onChange={(e) => {
      onChange?.(e.target.value);
    }} inputProps={{ readOnly, onClick, placeholder }} style={style} inputRef={ref as Ref<any>} variant="standard" {...attributes} {...rest} />;
  },
  createTextArea: (props): unknown => {
    const { onChange, placeholder, ref, style, readOnly, onClick, rows, attributes, ...rest } = props;
    return <TextField onChange={(e) => {
      onChange?.(e.target.value);
    }} inputProps={{ readOnly, onClick, placeholder }} style={style} inputRef={ref as Ref<any>} variant="standard" multiline rows={rows || 4}  {...attributes}  {...rest} />;
  },

  createCheckBox: (props: GridCheckBoxProps) => {
    const { onChange, value, ref } = props;
    return (
      <Checkbox
        inputRef={ref as Ref<HTMLInputElement>}
        onChange={(e, checked) => {
          onChange?.(checked);
        }}
        checked={value === true}
      />
    );
  },
  createMenu: (props: GridMenuProps) => {
    const { options } = props;
    const cell = {
      rowIdentifier: props.rowPosition?.uniqueIdentifier || "",
      columnIdentifier: props.columnPosition?.column?.uniqueIdentifier || "",
    };
    return (
      <List key="menu">
        {options?.map((item, idx) =>
          item ? (
            <MenuItem key={idx} onClick={() => item.onClick(cell)}>
              {item.label}
            </MenuItem>
          ) : (
            <Divider key={idx} />
          )
        )}
      </List>
    );
  },
  createTriStateCheckbox: (props): unknown => {
    const { onChange, value, allowIndeterminate } = props;
    return (
      <Checkbox
        onClick={(e) => {
          if (allowIndeterminate) {
            if (value === CheckBoxState.INDETERMINATE) {
              onChange(CheckBoxState.CHECKED);
            } else if (value === CheckBoxState.UNCHECKED) {
              onChange(CheckBoxState.INDETERMINATE);
            } else {
              onChange(CheckBoxState.UNCHECKED);
            }
          } else {
            onChange(
              value !== CheckBoxState.CHECKED
                ? CheckBoxState.CHECKED
                : CheckBoxState.UNCHECKED
            );
          }
          e.stopPropagation();
        }}
        checked={
          value === CheckBoxState.INDETERMINATE
            ? false
            : value === CheckBoxState.CHECKED
        }
        indeterminate={value === CheckBoxState.INDETERMINATE}
        color="primary"
      />
    );
  },
  createIconButton: (icon: GridIconButton, { props }, textAndIcon?: boolean): unknown => {
    
    if (icon === GridIconButton.PageFirst) {
      return generateIcon(<FirstPage />, props, textAndIcon);
  } else if (icon === GridIconButton.PagePrevious) {
      return generateIcon(<ArrowBack />, props, textAndIcon);
  } else if (icon === GridIconButton.PageNext) {
      return generateIcon(<ArrowForward />, props, textAndIcon);
  } else if (icon === GridIconButton.PageLast) {
      return generateIcon(<LastPage />, props, textAndIcon);
  } else if (icon === GridIconButton.Settings) {
      return generateIcon(<Settings />, props, textAndIcon);
  } else if (icon === GridIconButton.SettingsSave) {
      return generateIcon(<Save />, props, textAndIcon);
  } else if (icon === GridIconButton.FilterBuilder) {
      return generateIcon(<FilterList />, props, textAndIcon);
  } else if (icon === GridIconButton.ChartBuilder) {
      return generateIcon(<BarChart />, props, textAndIcon);
  } else if (icon === GridIconButton.SettingsManage) {
      return generateIcon(<GridView />, props, textAndIcon);
  } else if (icon === GridIconButton.ExpandOne) {
      return generateIcon(<ExpandMore />, props, textAndIcon);
  } else if (icon === GridIconButton.ExpandAll) {
      return generateIcon(<UnfoldMore />, props, textAndIcon);
  } else if (icon === GridIconButton.CollapseOne) {
      return generateIcon(<ExpandLess />, props, textAndIcon);
  } else if (icon === GridIconButton.CollapseAll) {
      return generateIcon(<UnfoldLess />, props, textAndIcon);
  } else if (icon === GridIconButton.Pdf) {
      return generateIcon(<PictureAsPdf />, props, textAndIcon);
  } else if (icon === GridIconButton.Excel) {
      return generateIcon(<FileDownload />, props, textAndIcon);
  } else if (icon === GridIconButton.Cancel) {
      return generateIcon(<Cancel />, props, textAndIcon);
  } else if (icon === GridIconButton.Reset) {
      return generateIcon(<RestartAlt />, props, textAndIcon);
  } else if (icon === GridIconButton.Delete) {
      return generateIcon(<DeleteOutline />, props, textAndIcon);
  } else if (icon === GridIconButton.Ok || icon === GridIconButton.Apply) {
      return generateIcon(<DoneOutline />, props, textAndIcon);
  } else if (icon === GridIconButton.Filter) {
      return generateIcon(<FilterAlt />, props, textAndIcon);
  } else if (icon === GridIconButton.Edit) {
      return generateIcon(<Edit />, props, textAndIcon);
  } else if (icon === GridIconButton.BulkEdit) {
      return generateIcon(<EditAttributes />, props, textAndIcon);
  } else if (icon === GridIconButton.Plus) {
      return generateIcon(<AddCircle />, props, textAndIcon);
  } else if (icon === GridIconButton.Minus) {
      return generateIcon(<RemoveCircle />, props, textAndIcon);
  } else if (icon === GridIconButton.Copy) {
      return generateIcon(<FileCopy />, props, textAndIcon);
  } else if (icon === GridIconButton.Paste) {
      return generateIcon(<ControlPoint />, props, textAndIcon);
  }

    return { props };
  },
};
