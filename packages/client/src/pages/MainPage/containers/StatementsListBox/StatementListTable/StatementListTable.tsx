import React, { useCallback, useEffect, useState } from "react";
import { Column, useTable, useExpanded, Row } from "react-table";
import update from "immutability-helper";
import { StyledTable, StyledTHead, StyledTh } from "./StatementListTableStyles";
import { StatementListRow } from "./StatementListRow";
import { IActant } from "@shared/types";

interface StatementListTable {
  data: {}[];
  columns: Column<{}>[];
  handleRowClick?: Function;
  moveEndRow: Function;
  actants: IActant[];
}
export const StatementListTable: React.FC<StatementListTable> = ({
  data,
  columns,
  handleRowClick = () => {},
  moveEndRow,
  actants,
}) => {
  const [records, setRecords] = useState<{}[]>([]);
  useEffect(() => {
    setRecords(data);
  }, [data]);

  const getRowId = useCallback((row) => {
    return row.id;
  }, []);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
  } = useTable(
    {
      columns,
      data: records,
      getRowId,
      initialState: {
        hiddenColumns: ["id"],
      },
    },
    useExpanded
  );

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragRecord = records[dragIndex];
      setRecords(
        update(records, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRecord],
          ],
        })
      );
    },
    [records]
  );

  return (
    <StyledTable {...getTableProps()}>
      <StyledTHead>
        {headerGroups.map((headerGroup, key) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={key}>
            <th></th>
            {headerGroup.headers.map((column, key) =>
              key < 6 ? (
                <StyledTh {...column.getHeaderProps()} key={key}>
                  {column.render("Header")}
                </StyledTh>
              ) : (
                <th key={key}></th>
              )
            )}
          </tr>
        ))}
      </StyledTHead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row: Row, i: number) => {
          prepareRow(row);
          return (
            <StatementListRow
              actants={actants}
              index={i}
              handleClick={handleRowClick}
              row={row}
              moveRow={moveRow}
              moveEndRow={moveEndRow}
              {...row.getRowProps()}
              visibleColumns={visibleColumns}
            />
          );
        })}
      </tbody>
    </StyledTable>
  );
};
