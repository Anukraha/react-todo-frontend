import React from 'react';
import { useTable } from 'react-table';

const EmployeeTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'emp_name',
      },
      {
        Header: 'Mobile',
        accessor: 'mobile',
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'Completed Tasks',
        accessor: 'task_no',
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value, row }) => (row.values.task_no >= 3 ? 'Completed' : 'Ongoing'),
      },
      {
        Header: 'Department',
        accessor: 'department.department',
      },
    ],
    []
  );
  
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className="table-container">
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
