
import React from "react";
import { useTable } from "react-table";
import './Table.scss'
export default function Table({ columns, data , removeClient}) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data
  });

  const onRowClick = (state, rowInfo, column, instance) => {
    return {
        onClick: e => {
            console.log('A Td Element was clicked!')
            console.log('it produced this event:', e)
            console.log('It was in this column:', column)
            console.log('It was in this row:', rowInfo)
            console.log('It was in this table instance:', instance)
        }
    }
}

  return (
    <table {...getTableProps()} >
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th id={column.render("Header")} {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()} 
                
                >
                  {cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}