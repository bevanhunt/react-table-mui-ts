/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable max-len */
import {
  Button, IconButton, Toolbar, Tooltip,
} from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/CreateOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewColumnsIcon from '@mui/icons-material/ViewColumn';
import classnames from 'classnames';
import React, {
  MouseEvent, MouseEventHandler, PropsWithChildren, ReactElement, useCallback, useState,
} from 'react';
import { TableInstance } from 'react-table';

import { ColumnHidePage } from './ColumnHidePage';
import { FilterPage } from './FilterPage';

export const useStyles = makeStyles(() => createStyles({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftButtons: {},
  rightButtons: {},
  leftIcons: {
    '&:first-of-type': {
      marginLeft: -12,
    },
  },
  rightIcons: {
    padding: 12,
    marginTop: '-6px',
    width: 48,
    height: 48,
    '&:last-of-type': {
      marginRight: -12,
    },
  },
}));

type InstanceActionButton<T extends Record<string, unknown>> = {
  instance: TableInstance<T>
  icon?: JSX.Element
  onClick: any
  enabled?: (instance: TableInstance<T>) => boolean
  label: string
  variant?: 'right' | 'left'
};

type ActionButton = {
  icon?: JSX.Element
  onClick: MouseEventHandler
  enabled?: boolean
  label: string
  variant?: 'right' | 'left'
};

export function InstanceLabeledActionButton<T extends Record<string, unknown>>({
  instance,
  icon,
  onClick,
  label,
  enabled = () => true,
}: InstanceActionButton<T>): ReactElement {
  return (
    <Button variant="contained" color="primary" onClick={onClick(instance)} disabled={!enabled(instance)}>
      {icon}
      {label}
    </Button>
  );
}

export function LabeledActionButton({
  icon, onClick, label, enabled = true,
}: ActionButton): ReactElement {
  return (
    <Button variant="contained" color="primary" onClick={onClick} disabled={!enabled}>
      {icon}
      {label}
    </Button>
  );
}

export function InstanceSmallIconActionButton<T extends Record<string, unknown>>({
  instance,
  icon,
  onClick,
  label,
  enabled = () => true,
  variant,
}: InstanceActionButton<T>): ReactElement {
  const classes = useStyles({});
  return (
    <Tooltip title={label} aria-label={label}>
      <span>
        <IconButton
          className={classnames({
            [classes.rightIcons]: variant === 'right',
            [classes.leftIcons]: variant === 'left',
          })}
          onClick={onClick(instance)}
          disabled={!enabled(instance)}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}

export function SmallIconActionButton({
  icon,
  onClick,
  label,
  enabled = true,
  variant,
}: ActionButton): ReactElement {
  const classes = useStyles({});
  return (
    <Tooltip title={label} aria-label={label}>
      <span>
        <IconButton
          className={classnames({
            [classes.rightIcons]: variant === 'right',
            [classes.leftIcons]: variant === 'left',
          })}
          onClick={onClick}
          disabled={!enabled}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}

type TableToolbarProps<T extends Record<string, unknown>> = {
  instance: TableInstance<T>
  onAdd?: any
  onDelete?: any
  onEdit?: any
};

export function TableToolbar<T extends Record<string, unknown>>({
  instance,
  onAdd,
  onDelete,
  onEdit,
}: PropsWithChildren<TableToolbarProps<T>>): ReactElement | null {
  const { columns } = instance;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const hideableColumns = columns.filter((column) => !(column.id === '_selector'));

  const handleColumnsClick = useCallback(
    (event: MouseEvent) => {
      setAnchorEl(event.currentTarget);
      setColumnsOpen(true);
    },
    [setAnchorEl, setColumnsOpen],
  );

  const handleFilterClick = useCallback(
    (event: MouseEvent) => {
      setAnchorEl(event.currentTarget);
      setFilterOpen(true);
    },
    [setAnchorEl, setFilterOpen],
  );

  const handleClose = useCallback(() => {
    setColumnsOpen(false);
    setFilterOpen(false);
    setAnchorEl(undefined);
  }, []);

  // toolbar with add, edit, delete, filter/search column select.
  return (
    <Toolbar className={classes.toolbar}>
      <div className={classes.leftButtons}>
        {onAdd && (
          <InstanceSmallIconActionButton<T>
            instance={instance}
            icon={<AddIcon />}
            onClick={onAdd}
            label="Add"
            enabled={({ state }: TableInstance<T>) => !state.selectedRowIds || Object.keys(state.selectedRowIds).length === 0}
            variant="left"
          />
        )}
        {onEdit && (
          <InstanceSmallIconActionButton<T>
            instance={instance}
            icon={<CreateIcon />}
            onClick={onEdit}
            label="Edit"
            enabled={({ state }: TableInstance<T>) => state.selectedRowIds && Object.keys(state.selectedRowIds).length === 1}
            variant="left"
          />
        )}
        {onDelete && (
          <InstanceSmallIconActionButton<T>
            instance={instance}
            icon={<DeleteIcon />}
            onClick={onDelete}
            label="Delete"
            enabled={({ state }: TableInstance<T>) => state.selectedRowIds && Object.keys(state.selectedRowIds).length > 0}
            variant="left"
          />
        )}
      </div>
      <div className={classes.rightButtons}>
        <ColumnHidePage<T> instance={instance} onClose={handleClose} show={columnsOpen} anchorEl={anchorEl} />
        <FilterPage<T> instance={instance} onClose={handleClose} show={filterOpen} anchorEl={anchorEl} />
        {hideableColumns.length > 1 && (
          <SmallIconActionButton
            icon={<ViewColumnsIcon />}
            onClick={handleColumnsClick}
            label="Show / hide columns"
            variant="right"
          />
        )}
        <SmallIconActionButton
          icon={<FilterListIcon />}
          onClick={handleFilterClick}
          label="Filter by columns"
          variant="right"
        />
      </div>
    </Toolbar>
  );
}
