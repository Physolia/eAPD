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
  Dropdown,
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

const SelectColumnFilter = ({
    column: { filterValue, setFilter, preFilteredRows, id, Header }
  }) => {
    const options = React.useMemo(() => {
      const opts = new Set();
      preFilteredRows.forEach(row => {
        opts.add(row.values[id]);
      });
      return [...opts.values()];
    }, [id, preFilteredRows]);
  
    return (
      <Dropdown
        name="dropdownFilter"
        label={Header}
        value={filterValue}
        options={[]}
        onChange={e => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Dropdown>
    );
  };
  
  SelectColumnFilter.propTypes = {
    column: PropTypes.array
  };
  
  SelectColumnFilter.defaultProps = {
    column: []
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
        accessor: 'stateId',
        Filter: SelectColumnFilter,
        filter: 'includes'
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
    useGlobalFilter,
    useSortBy
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
        <div className="ds-u-display--flex ds-u-justify-content--between" style={{maxWidth: '20rem'}}>
          {headerGroups[0].headers.find(item => item.Header === 'State').render('Filter')}
          <GlobalFilter
             globalFilter={globalFilter}
             setGlobalFilter={setGlobalFilter}
          />
        </div>
        <Table {...getTableProps()} borderless className="all-users-table">
        <TableHead>
           {headerGroups.map(headerGroup => (
             <TableRow {...headerGroup.getHeaderGroupProps()}>
               {headerGroup.headers.map(column => (
                 <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                   {column.render('Header')}
                   <SortIndicator canSort={column.canSort} isSorted={column.isSorted} isSortedDesc={column.isSortedDesc} />
                 </TableCell>
               ))}
             </TableRow>
            ))}
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
                  {row.subRows.map((subRow, i) => {
                    prepareRow(subRow);
                    console.log("subRow", subRow);
                    if (i === 0) {
                      return null;
                    }
                    return (
                      <Fragment key={subRow.id}>
                        <tr {...subRow.getRowProps()}>
                          {subRow.cells.map(cell => {
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
