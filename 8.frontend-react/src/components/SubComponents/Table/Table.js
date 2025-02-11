
import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import './Table.scss'

export default function Table({ columns, data, isPagination, isSort }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  )

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
{ isSort && 
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.canSort && <i id="sort-icon" className="fa fa-sort"></i>}
                  </span></th>
              ))}
            </tr>
          ))}
        </thead> }
        {!isSort && 
        <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                        ))}
                    </tr>
                ))}
            </thead>
}
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      {isPagination &&
        <div className="pagination">
          <button className="table-navigate" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {/* {'<<'} */}
            <i className="fa fa-angle-double-left"></i>
          </button>{' '}
          <button className="table-navigate" onClick={() => previousPage()} disabled={!canPreviousPage}>
            {/* {'<'} */}
            <i className="fa fa-angle-left"></i>
          </button>{' '}
          <button className="table-navigate" onClick={() => nextPage()} disabled={!canNextPage}>
            {/* {'>'} */}
            <i className="fa fa-angle-right"></i>
          </button>{' '}
          <button className="table-navigate" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {/* {'>>'} */}
            <i className="fa fa-angle-double-right"></i>
          </button>{' '}
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | Go to page:{' '}
            <input className="input-page"
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
            />
          </span>{' '}
          <select className="select-page"
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      }
    </>
  )
}



// export default function Table({ columns, data }) {

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow
//   } = useTable({
//     columns,
//     data
//   },
//     useSortBy
//     );


