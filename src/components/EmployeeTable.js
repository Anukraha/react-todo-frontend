import React from 'react';
import { useTable } from 'react-table';

const EmployeeTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'emp_name', // corresponds to currentEmployee.emp_name
      },
      {
        Header: 'Mobile',
        accessor: 'mobile', // corresponds to currentEmployee.mobile
      },
      {
        Header: 'Address',
        accessor: 'address', // corresponds to currentEmployee.address
      },
      {
        Header: 'Status',
        accessor: 'status', // corresponds to currentEmployee.status
        Cell: ({ value }) => (value ? value : 'Ongoing'), // Display 'Ongoing' if value is falsy
      },
      {
        Header: 'Department',
        accessor: 'department.department', // assumes the 'data' array contains 'department' property
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

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
                      textOverflow: 'ellipsis', // Optionally adds an ellipsis (...) when the content overflows
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
