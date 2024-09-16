import React, { useContext, useEffect, useMemo, useState } from "react";

import { EntityEnums } from "@shared/enums";
import { IEntity, IResponseQuery, IResponseQueryEntity } from "@shared/types";
import { Explore } from "@shared/types/query";
import { Button, ButtonGroup, Checkbox, Input } from "components";
import Dropdown, { EntitySuggester, EntityTag } from "components/advanced";
import { FaTrashAlt } from "react-icons/fa";
import { MdOutlineEdit } from "react-icons/md";
import { TbColumnInsertRight } from "react-icons/tb";
import { v4 as uuidv4 } from "uuid";
import { ExploreAction, ExploreActionType } from "../state";
import {
  StyledEmpty,
  StyledGrid,
  StyledGridColumn,
  StyledGridHeader,
  StyledNewColumn,
  StyledNewColumnGrid,
  StyledNewColumnLabel,
  StyledNewColumnValue,
  StyledTableHeader,
} from "./ExplorerTableStyles";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
import { classesAll } from "@shared/dictionaries/entity";
import {
  LuChevronFirst,
  LuChevronLast,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

const initialNewColumn: Explore.IExploreColumn = {
  id: uuidv4(),
  name: "",
  type: Explore.EExploreColumnType.EPV,
  editable: false,
  params: {},
};
interface ExplorerTable {
  state: Explore.IExplore;
  dispatch: React.Dispatch<ExploreAction>;
  data: IResponseQuery | undefined;
  isQueryFetching: boolean;
  queryError: Error | null;
}
export const ExplorerTable: React.FC<ExplorerTable> = ({
  state,
  dispatch,
  data,
  isQueryFetching,
  queryError,
}) => {
  const { entities: incomingEntities, total: incomingTotal } = data ?? {
    entities: [],
    total: 0,
  };
  const { columns, filters, limit, offset, sort, view } = state;

  const [entities, setEntities] = useState<IResponseQueryEntity[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!isQueryFetching) {
      setEntities(incomingEntities);
      setTotal(incomingTotal);
    }
  }, [incomingEntities, total, isQueryFetching]);

  const [columnName, setColumnName] = useState(initialNewColumn.name);
  const [columnType, setColumnType] = useState(initialNewColumn.type);
  const [editable, setEditable] = useState<boolean>(initialNewColumn?.editable);

  const [propertyType, setPropertyType] = useState<IEntity | undefined>(
    undefined
  );
  const propertyTypeId = useMemo<string>(() => {
    return propertyType?.id || "";
  }, [propertyType]);

  const [isNewColumnDisplayed, setIsNewColumnDisplayed] = useState(true);

  const getNewColumn = (): Explore.IExploreColumn => {
    return {
      id: uuidv4(),
      name: columnName.length
        ? columnName
        : Explore.EExploreColumnTypeLabels[columnType],
      type: columnType,
      editable: editable,
      params: { propertyType: propertyTypeId },
    };
  };

  const handleClearLocalState = () => {
    setColumnName(initialNewColumn.name);
    setColumnType(initialNewColumn.type);
    setEditable(initialNewColumn.editable);
    setPropertyType(undefined);
  };

  const handleCreateColumn = () => {
    dispatch({
      type: ExploreActionType.addColumn,
      payload: getNewColumn(),
    });
    handleClearLocalState();
    // setShowNewColumn(false);
  };

  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const handleFirstPage = () => {
    dispatch({ type: ExploreActionType.setOffset, payload: 0 });
  };

  const handleLastPage = () => {
    const lastPageOffset = Math.floor((total - 1) / limit) * limit;
    dispatch({ type: ExploreActionType.setOffset, payload: lastPageOffset });
  };

  const handleNextPage = () => {
    if (offset + limit < total) {
      dispatch({ type: ExploreActionType.setOffset, payload: offset + limit });
    }
  };

  const handlePreviousPage = () => {
    if (offset - limit >= 0) {
      dispatch({ type: ExploreActionType.setOffset, payload: offset - limit });
    }
  };

  const handleChangeLimit = (newLimit: number) => {
    dispatch({ type: ExploreActionType.setLimit, payload: newLimit });
    dispatch({ type: ExploreActionType.setOffset, payload: 0 });
  };

  const startRecord = offset + 1;
  const endRecord = Math.min(offset + limit, total);
  const pageNumber = Math.floor(offset / limit + 1);
  const canGoToPreviousPage = offset > 0;
  const canGoToNextPage = offset + limit < total;

  const toggleSortDirection = (columnId: string) => {
    if (sort && sort.columnId === columnId) {
      if (sort.direction === "asc") return "desc";
      if (sort.direction === "desc") return undefined; // No sort
    }
    return "asc";
  };

  return (
    <div style={{ padding: "1rem" }}>
      <StyledTableHeader>
        <div>
          <span
            style={{ marginRight: "1rem" }}
          >{`page ${pageNumber} of ${totalPages}`}</span>
          <span
            style={{ marginRight: "1rem" }}
          >{`records ${startRecord}-${endRecord} of ${total}`}</span>
          {state.limit < total && (
            <span
              style={{
                display: "inline-grid",
                gap: "0.5rem",
                gridTemplateColumns: "repeat(4,auto)",
                marginRight: "1rem",
              }}
            >
              <Button
                onClick={handleFirstPage}
                disabled={!canGoToPreviousPage}
                icon={<LuChevronFirst size={13} />}
                inverted
                color="greyer"
                radiusLeft
                radiusRight
              />
              <Button
                onClick={handlePreviousPage}
                disabled={!canGoToPreviousPage}
                icon={<LuChevronLeft size={13} />}
                inverted
                color="greyer"
                radiusLeft
                radiusRight
              />
              <Button
                onClick={handleNextPage}
                disabled={!canGoToNextPage}
                icon={<LuChevronRight size={13} />}
                inverted
                color="greyer"
                radiusLeft
                radiusRight
              />
              <Button
                onClick={handleLastPage}
                disabled={!canGoToNextPage}
                icon={<LuChevronLast size={13} />}
                inverted
                color="greyer"
                radiusLeft
                radiusRight
              />
            </span>
          )}
          <Dropdown.Single.Basic
            width={50}
            value={limit.toString()}
            options={[5, 10, 20, 50, 100].map((number) => {
              return {
                value: number.toString(),
                label: number.toString(),
              };
            })}
            onChange={(value) => handleChangeLimit(Number(value))}
          />
        </div>
        <div>
          <Button
            icon={<TbColumnInsertRight size={17} />}
            label="new column"
            color={isNewColumnDisplayed ? "info" : "primary"}
            onClick={() => setIsNewColumnDisplayed(!isNewColumnDisplayed)}
          />
        </div>
      </StyledTableHeader>

      <div style={{ display: "flex", overflow: "auto" }}>
        <StyledGrid $columns={columns.length + 1}>
          {/* HEADER */}
          <StyledGridHeader>{/* entities */}</StyledGridHeader>
          {columns.map((column, key) => {
            return (
              <StyledGridHeader key={key}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {column.editable && (
                    <MdOutlineEdit
                      size={14}
                      style={{ marginRight: "0.3rem" }}
                    />
                  )}
                  {column.name}
                  {/* SORT */}
                  {/* <span style={{ marginLeft: "0.5rem" }}>
                    <Button
                      noBorder
                      noBackground
                      inverted
                      icon={
                        sort && sort.columnId === column.id ? (
                          sort.direction === "asc" ? (
                            <FaSortUp color={"white"} />
                          ) : sort.direction === "desc" ? (
                            <FaSortDown color={"white"} />
                          ) : (
                            <FaSort color={"white"} />
                          )
                        ) : (
                          <FaSort color={"white"} />
                        )
                      }
                      onClick={() => {
                        const newDirection = toggleSortDirection(column.id);
                        dispatch({
                          type: ExploreActionType.sort,
                          payload:
                            newDirection === undefined
                              ? undefined
                              : {
                                  columnId: column.id,
                                  direction: newDirection,
                                },
                        });
                      }}
                      tooltipLabel="sort"
                    />
                  </span> */}
                  <span style={{ marginLeft: "0.5rem" }}>
                    <Button
                      noBorder
                      noBackground
                      inverted
                      icon={<FaTrashAlt color={"white"} />}
                      onClick={() =>
                        dispatch({
                          type: ExploreActionType.removeColumn,
                          payload: { id: column.id },
                        })
                      }
                      tooltipLabel="remove column"
                    />
                  </span>
                </div>
              </StyledGridHeader>
            );
          })}

          {entities.map((record, key) => {
            return (
              // ROW
              <div style={{ display: "contents" }} key={key}>
                <StyledGridColumn>
                  <span>
                    <EntityTag entity={record.entity} />
                  </span>
                </StyledGridColumn>
                {columns.map((column, key) => {
                  return (
                    <StyledGridColumn key={key}>
                      {record.columnData[column.id] ? (
                        (record.columnData[column.id] as Array<IEntity>).map(
                          (entity, key) => {
                            return (
                              <React.Fragment key={key}>
                                <span style={{ marginBottom: "0.3rem" }}>
                                  <EntityTag
                                    entity={entity}
                                    unlinkButton={{
                                      onClick: () => {
                                        // TODO: unlink on BE
                                      },
                                    }}
                                  />
                                </span>
                              </React.Fragment>
                            );
                          }
                        )
                      ) : (
                        <StyledEmpty>{"empty"}</StyledEmpty>
                      )}

                      {column.editable && (
                        <EntitySuggester
                          categoryTypes={classesAll}
                          onPicked={(entity) => {
                            // TODO: add to explore state
                          }}
                        />
                      )}
                    </StyledGridColumn>
                  );
                })}
              </div>
            );
          })}
        </StyledGrid>
        {isNewColumnDisplayed && (
          <StyledNewColumn>
            <StyledGridHeader $greyBackground>
              <span style={{ display: "flex", alignItems: "center" }}>
                <TbColumnInsertRight size={17} />
                <p style={{ marginLeft: "0.5rem" }}>New column</p>
              </span>
            </StyledGridHeader>
            <StyledNewColumnGrid>
              <StyledNewColumnLabel>Column name</StyledNewColumnLabel>
              <StyledNewColumnValue>
                <Input
                  width="full"
                  value={columnName}
                  onChangeFn={(value) => setColumnName(value)}
                  changeOnType
                />
              </StyledNewColumnValue>
              <StyledNewColumnLabel>Column type</StyledNewColumnLabel>
              <StyledNewColumnValue>
                <Dropdown.Single.Basic
                  width="full"
                  value={columnType}
                  options={Object.keys(Explore.EExploreColumnType)
                    .map(
                      (key) =>
                        Explore.EExploreColumnType[
                          key as keyof typeof Explore.EExploreColumnType
                        ]
                    )
                    .map((value) => {
                      return {
                        value: value,
                        label: Explore.EExploreColumnTypeLabels[value],
                        isDisabled:
                          Explore.EExploreColumnTypeDisabled[value].disabled,
                      };
                    })}
                  onChange={(value) => setColumnType(value)}
                />
              </StyledNewColumnValue>
              {columnType === Explore.EExploreColumnType.EPV && (
                <>
                  <StyledNewColumnLabel>Property type</StyledNewColumnLabel>
                  <StyledNewColumnValue>
                    {propertyType ? (
                      <EntityTag
                        fullWidth
                        entity={propertyType}
                        unlinkButton={{
                          onClick: () => setPropertyType(undefined),
                        }}
                      />
                    ) : (
                      <EntitySuggester
                        categoryTypes={[EntityEnums.Class.Concept]}
                        onPicked={(entity) => setPropertyType(entity)}
                      />
                    )}
                  </StyledNewColumnValue>
                </>
              )}
              <StyledNewColumnLabel>
                <MdOutlineEdit size={14} style={{ marginRight: "0.3rem" }} />
                Editable
              </StyledNewColumnLabel>
              <StyledNewColumnValue>
                <Checkbox
                  value={editable}
                  onChangeFn={(value) => setEditable(value)}
                />
              </StyledNewColumnValue>
            </StyledNewColumnGrid>

            <span
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <ButtonGroup style={{ marginLeft: "1rem", marginTop: "1rem" }}>
                <Button
                  color="warning"
                  label="cancel"
                  onClick={() => setIsNewColumnDisplayed(false)}
                />
                <Button
                  label="create column"
                  onClick={handleCreateColumn}
                  disabled={
                    !columnName.length ||
                    (columnType === Explore.EExploreColumnType.EPV &&
                      !propertyTypeId)
                  }
                />
              </ButtonGroup>
            </span>
          </StyledNewColumn>
        )}
      </div>
    </div>
  );
};
