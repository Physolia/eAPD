/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React, { Fragment, useState, useMemo, useEffect } from 'react';

import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  useAsyncDebounce
} from 'react-table';
  
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField
} from '@cmsgov/design-system';

const makeRow = record => {
  return {
    id: record.id,
    name: record.displayName,
    email: record.email,
    phone: record.primaryPhone,
    stateId: record.stateId,
    status: record.status,
    role: record.role,
    actions: record.affiliationId,
    subRows: record.affiliations
  };
};
  
const makeData = payload => {
  return payload.map(record => {
    return {
      ...makeRow(record)
    };
  });
};
  
const GlobalFilter = ({
  globalFilter,
  setGlobalFilter,
}) => {
  const [value, setValue] = React.useState(globalFilter)
  
  const onChange = useAsyncDebounce(val => {
    setGlobalFilter(val || undefined)
  }, 200)

  return (
    <span>
      <TextField
        name="globalFilter"
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        label="Search"
      />
    </span>
  );
};

GlobalFilter.propTypes = {
  globalFilter: PropTypes.func.isRequired,
  setGlobalFilter: PropTypes.func.isRequired
};

const SortIndicator = ({ canSort, isSorted, isSortedDesc }) => {
    if (canSort) {
      if (isSorted) {
        if (isSortedDesc) {
          return ' ▾';
        }
        return ' ▴';
      }
      return ' ⬍';
    }
    return '';   
  };

const ManageAllUsersTable = ({
  tab,
  affiliations,
  isFetching,
  actions,
  currentUser
}) => {
  const [tableData, setTableData] = useState([]);
  
  useEffect(() => {
    setTableData(affiliations);
  }, [isFetching]);
  
  
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Phone',
        accessor: 'phone',
        disableSortBy: true
      },
      {
        Header: 'State',
        accessor: 'stateId'
      },
      {
        Header: 'Role',
        accessor: 'role'
      },
      {
        Header: 'Status',
        accessor: 'status'
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        disableSortBy: true
      },
    ],
    []
  );
  
  const data = useMemo(() => makeData(tableData), [tableData]);
  
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter },
    setGlobalFilter
  } = useTable(
    { 
     columns, 
     data
    },
    useFilters,
    useGlobalFilter
  );
    
  const { id: currentUserId, activities: currentUserActivities } = currentUser;
  
  const showActions = affiliation => {
    return (
      currentUserId !== affiliation.userId &&
      currentUserActivities.indexOf('edit-affiliations') !== -1
    );
  };
  
  const AffiliationFirstRow = ({ primaryAffiliation, affiliation, booger }) => {
    return (
      <TableRow className={primaryAffiliation.subRows.length > 1 ? "all-users-table--first-row-multi" : ""} key={affiliation.id}>
        <TableCell component='th' style= {{ 'verticalAlign': 'top' }} rowSpan={primaryAffiliation.subRows.length}>{primaryAffiliation.name}</TableCell>
        <TableCell component='td' style= {{ 'verticalAlign': 'top' }} rowSpan={primaryAffiliation.subRows.length}>{primaryAffiliation.email}</TableCell>
        <TableCell component='td' style= {{ 'verticalAlign': 'top' }} rowSpan={primaryAffiliation.subRows.length}>{primaryAffiliation.phone}</TableCell>
        <TableCell className="all-users-table--state">{affiliation.stateId.toUpperCase()}</TableCell>
        {tab === 'active' ? <TableCell className="all-users-table--role">{affiliation.role}</TableCell> : null}
        {tab === 'inactive' ? <TableCell className="all-users-table--status">{affiliation.status}</TableCell> : null}
        <TableCell className="all-users-table--actions">
          <AffiliationActions primaryAffiliation={primaryAffiliation} affiliation={affiliation} />
        </TableCell>
      </TableRow>
    )
  }
  
  const AffiliationRow = ({ primaryAffiliation, affiliation }) => {
    return (
      <TableRow className={primaryAffiliation.subRows.length > 1 ? "all-users-table--row-multi" : ""} key={affiliation.id}>
        <TableCell className="all-users-table--state">{affiliation.stateId.toUpperCase()}</TableCell>
        {tab === 'active' ? <TableCell className="all-users-table--role">{affiliation.role}</TableCell> : null}
        {tab === 'inactive' ? <TableCell className="all-users-table--status">{affiliation.status}</TableCell> : null}
        <TableCell className="all-users-table--actions">
          <AffiliationActions primaryAffiliation={primaryAffiliation} affiliation={affiliation} />
        </TableCell>
      </TableRow>
    )
  }

  const AffiliationActions = ({ primaryAffiliation, affiliation }) => {
    // Only show revoked for the active tab
    let displayedActions;
    if (tab !== 'active') {
      displayedActions = [...actions];
    }
    if (tab === 'active') {
      displayedActions = [actions[1]];
    }
    return (
      <div className="ds-u-display--flex" data-primary-affiliation-id={primaryAffiliation.id} data-id={affiliation.id} data-state={affiliation.stateId} >
        {showActions(primaryAffiliation) && (
          displayedActions            
        )}
       </div>
    )
  }
  
  return (
    <Fragment>
      {isFetching && <p>Loading...</p>}
      {!isFetching && affiliations.length === 0 && (
        <p>No users on this tab at this time</p>
      )}
      {!isFetching && affiliations.length > 0 && (
        <div>
        <div className="ds-u-display--flex ds-u-justify-content--between" style={{maxWidth: '30rem'}}>
          <GlobalFilter
             globalFilter={globalFilter}
             setGlobalFilter={setGlobalFilter}
          />
        </div>
        <Table {...getTableProps()} borderless className="all-users-table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>State</TableCell>
              {tab === 'active' ? <TableCell>Role</TableCell> : null}
              {tab === 'inactive' ? <TableCell>Status</TableCell> : null}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              console.log("row", row);
              return (
                <Fragment key={row.id}>
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                  </tr>
                {row.subRows.map((row, i) => {
                  prepareRow(row);
                  console.log("subRow", row)
                  if (i === 0) {
                    return null;
                  }
                  return (
                    <Fragment key={row.id}>
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                          return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        })}
                      </tr>
                    </Fragment>
                  )
                })}
                </Fragment>                
              )
            })}
          </TableBody>
        </Table>
        </div>
      )}
    </Fragment>
  );
};

ManageAllUsersTable.propTypes = {
  tab: PropTypes.string.isRequired,
  affiliations: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  actions: PropTypes.array,
  currentUser: PropTypes.object.isRequired
};

ManageAllUsersTable.defaultProps = {
  actions: ''
};

export default ManageAllUsersTable;
