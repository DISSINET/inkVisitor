import {
  operatorDict,
  partitivityDict,
  virtualityDict,
} from "@shared/dictionaries";
import { EntityEnums } from "@shared/enums";
import {
  IEntity,
  IProp,
  IResponseStatement,
  IStatementActant,
  IStatementData,
} from "@shared/types";
import { excludedSuggesterEntities } from "Theme/constants";
import {
  AttributeIcon,
  BundleButtonGroup,
  Button,
  ButtonGroup,
} from "components";
import Dropdown, {
  ElvlButtonGroup,
  EntityDropzone,
  EntitySuggester,
  EntityTag,
  LogicButtonGroup,
  PositionButtonGroup,
} from "components/advanced";
import { useSearchParams } from "hooks";
import { TooltipAttributes } from "pages/Main/containers";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
} from "react-dnd";
import { FaGripVertical, FaPlus, FaTrashAlt } from "react-icons/fa";
import { TbSettingsAutomation, TbSettingsFilled } from "react-icons/tb";
import { setDraggedActantRow } from "redux/features/rowDnd/draggedActantRowSlice";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import {
  DragItem,
  DraggedActantRowItem,
  DraggedPropRowCategory,
  FilteredActantObject,
  ItemTypes,
} from "types";
import { dndHoverFn } from "utils/utils";
import { PropGroup } from "../../../PropGroup/PropGroup";
import { StatementEditorActantClassification } from "./StatementEditorActantClassification/StatementEditorActantClassification";
import { StatementEditorActantIdentification } from "./StatementEditorActantIdentification/StatementEditorActantIdentification";
import {
  StyledBorderLeft,
  StyledCI,
  StyledCIHeading,
  StyledExpandedRow,
  StyledFlexStart,
  StyledGrid,
  StyledGridColumn,
  StyledRow,
  StyledSuggesterWrap,
  StyledTagWrapper,
} from "./StatementEditorActantTableStyles";
import { ThemeContext } from "styled-components";

interface StatementEditorActantTableRow {
  filteredActant: FilteredActantObject;
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  userCanEdit?: boolean;
  updateOrderFn: () => void;
  addProp: (originId: string) => void;
  updateProp: (propId: string, changes: Partial<IProp>) => void;
  removeProp: (propId: string) => void;
  movePropToIndex: (propId: string, oldIndex: number, newIndex: number) => void;
  statement: IResponseStatement;
  classEntitiesActant: EntityEnums.Class[];
  territoryParentId?: string;
  addClassification: (originId: string) => void;
  addIdentification: (originId: string) => void;
  territoryActants?: string[];
  hasOrder?: boolean;

  handleDataAttributeChange: (
    changes: Partial<IStatementData>,
    instantUpdate?: boolean
  ) => void;
}

export const StatementEditorActantTableRow: React.FC<
  StatementEditorActantTableRow
> = ({
  filteredActant,
  index,
  moveRow,
  statement,
  userCanEdit = false,
  updateOrderFn,
  classEntitiesActant,
  addProp,
  updateProp,
  removeProp,
  movePropToIndex,
  territoryParentId,
  addClassification,
  addIdentification,
  territoryActants,
  hasOrder,

  handleDataAttributeChange,
}) => {
  const isInsideTemplate = statement.isTemplate || false;
  const { statementId, territoryId } = useSearchParams();
  const {
    actant,
    sActant,
  }: {
    actant?: IEntity;
    sActant: IStatementActant;
  } = filteredActant.data;
  const dispatch = useAppDispatch();
  const draggedActantRow: DraggedActantRowItem = useAppSelector(
    (state) => state.rowDnd.draggedActantRow
  );

  const dropRef = useRef<HTMLTableRowElement>(null);
  const dragRef = useRef<HTMLTableCellElement>(null);

  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.ACTANT_ROW,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      dndHoverFn(item, index, monitor, dropRef, moveRow);
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.ACTANT_ROW,
    item: {
      index,
      id: filteredActant.id.toString(),
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item: DragItem | undefined, monitor: DragSourceMonitor) => {
      if (item) updateOrderFn();
    },
  });

  const opacity = isDragging ? 0.2 : 1;

  preview(drop(dropRef));
  drag(dragRef);

  useEffect(() => {
    if (isDragging) {
      dispatch(
        setDraggedActantRow({ category: DraggedPropRowCategory.ACTANT })
      );
      const boxContentEditor = document.getElementById(`box-content-editor`);
      const actantTable = document.getElementById(`actant-section`);
      if (boxContentEditor) {
        boxContentEditor.scrollTo({
          behavior: "smooth",
          top: actantTable ? actantTable.offsetTop - 30 : 0,
        });
      }
    } else {
      dispatch(setDraggedActantRow({}));
    }
  }, [isDragging]);

  const updateActant = (
    statementActantId: string,
    changes: Partial<IStatementActant>,
    instantUpdate?: boolean
  ) => {
    if (statement && statementActantId) {
      const updatedActants = statement.data.actants.map((a) =>
        a.id === statementActantId ? { ...a, ...changes } : a
      );
      handleDataAttributeChange({ actants: updatedActants }, instantUpdate);
    }
  };

  const removeActant = (statementActantId: string, instantUpdate?: boolean) => {
    if (statement) {
      const updatedActants = statement.data.actants.filter(
        (a) => a.id !== statementActantId
      );
      handleDataAttributeChange({ actants: updatedActants }, instantUpdate);
    }
  };

  const renderActantCell = () => {
    return actant ? (
      <StyledTagWrapper>
        <EntityDropzone
          onSelected={(newSelectedId: string) => {
            updateActant(
              sActant.id,
              {
                entityId: newSelectedId,
              },
              true
            );
          }}
          categoryTypes={classEntitiesActant}
          excludedEntityClasses={excludedSuggesterEntities}
          isInsideTemplate={isInsideTemplate}
          territoryParentId={territoryParentId}
          excludedActantIds={[actant.id]}
          disabled={!userCanEdit}
        >
          <EntityTag
            entity={actant}
            fullWidth
            unlinkButton={
              userCanEdit && {
                onClick: () => {
                  updateActant(sActant.id, {
                    entityId: "",
                  });
                },
              }
            }
            elvlButtonGroup={
              <ElvlButtonGroup
                value={sActant.elvl}
                onChange={(elvl) =>
                  updateActant(sActant.id, {
                    elvl: elvl,
                  })
                }
                disabled={!userCanEdit}
              />
            }
          />
        </EntityDropzone>
      </StyledTagWrapper>
    ) : (
      <StyledSuggesterWrap>
        <EntitySuggester
          onSelected={(newSelectedId: string) => {
            updateActant(
              sActant.id,
              {
                entityId: newSelectedId,
              },
              true
            );
          }}
          categoryTypes={classEntitiesActant}
          openDetailOnCreate
          excludedEntityClasses={excludedSuggesterEntities}
          isInsideTemplate={isInsideTemplate}
          territoryParentId={territoryParentId}
          territoryActants={territoryActants}
          placeholder={"add actant"}
          isInsideStatement
          disabled={!userCanEdit}
        />
      </StyledSuggesterWrap>
    );
  };

  const renderPositionCell = () => {
    return (
      <PositionButtonGroup
        border
        value={sActant.position}
        onChange={(position) =>
          updateActant(sActant.id, {
            position: position,
          })
        }
        disabled={!userCanEdit}
      />
    );
  };

  const renderAttributesCell = () => {
    const { entityId: propOriginId, id: propRowId } = sActant;

    return (
      <ButtonGroup $noMarginRight $height={19}>
        {userCanEdit && (
          <Button
            key="a"
            icon={<FaPlus />}
            noIconMargin
            label="p"
            color="primary"
            inverted
            tooltipLabel="add new prop"
            onClick={() => {
              addProp(propRowId);
            }}
          />
        )}
        {userCanEdit && (
          <Button
            key="c"
            icon={<FaPlus />}
            noIconMargin
            label="c"
            color="primary"
            inverted
            tooltipLabel="add classification"
            onClick={() => {
              addClassification(propRowId);
            }}
          />
        )}
        {userCanEdit && (
          <Button
            key="i"
            icon={<FaPlus />}
            noIconMargin
            label="i"
            color="primary"
            inverted
            tooltipLabel="add identification"
            onClick={() => {
              addIdentification(propRowId);
            }}
          />
        )}
        {sActant.logic == "2" && (
          <Button
            key="neg"
            tooltipLabel="Negative logic"
            color="danger"
            inverted
            noBorder
            icon={<AttributeIcon attributeName={"negation"} />}
          />
        )}
      </ButtonGroup>
    );
  };

  const renderPropGroup = useCallback(
    (originId: string, props: IProp[], category: DraggedPropRowCategory) => {
      const originActant = statement.entities[originId];

      if (props.length > 0) {
        return (
          <PropGroup
            boxEntity={statement}
            originId={originActant ? originActant.id : ""}
            entities={statement.entities}
            props={props}
            territoryId={territoryId}
            updateProp={updateProp}
            removeProp={removeProp}
            addProp={addProp}
            movePropToIndex={movePropToIndex}
            userCanEdit={userCanEdit}
            openDetailOnCreate
            category={category}
            isInsideTemplate={isInsideTemplate}
            territoryParentId={territoryParentId}
            disableSpareRow
          />
        );
      }
    },
    [statement]
  );

  const isDraggingActant =
    draggedActantRow.category &&
    draggedActantRow.category === DraggedPropRowCategory.ACTANT;

  const [isExpanded, setIsExpanded] = useState(false);

  const { classifications, identifications } = filteredActant.data.sActant;

  const themeContext = useContext(ThemeContext);

  return (
    <StyledRow
      key={index}
      $marginBottom={classifications.length > 0 || identifications.length > 0}
    >
      <StyledFlexStart ref={dropRef}>
        {/* Order */}
        {userCanEdit && hasOrder ? (
          <StyledGridColumn ref={dragRef} style={{ cursor: "move" }}>
            <FaGripVertical
              style={{ marginTop: "0.3rem" }}
              color={themeContext?.color.black}
            />
          </StyledGridColumn>
        ) : (
          <StyledGridColumn />
        )}

        <StyledBorderLeft $borderColor="actant" $marginBottom>
          <StyledGrid
            style={{ opacity }}
            $hasActant={!!filteredActant.data.actant}
          >
            <StyledGridColumn>{renderActantCell()}</StyledGridColumn>
            <StyledGridColumn>
              {
                <LogicButtonGroup
                  border
                  value={filteredActant.data.sActant.logic}
                  onChange={(logic) =>
                    updateActant(filteredActant.data.sActant.id, {
                      logic: logic,
                    })
                  }
                  disabled={!userCanEdit}
                />
              }
            </StyledGridColumn>
            <StyledGridColumn>{renderPositionCell()}</StyledGridColumn>
            <StyledGridColumn>{renderAttributesCell()}</StyledGridColumn>
            <StyledGridColumn>
              <Button
                inverted
                onClick={() => setIsExpanded(!isExpanded)}
                icon={
                  isExpanded ? (
                    <TbSettingsFilled size={16} />
                  ) : (
                    <TbSettingsAutomation
                      size={16}
                      style={{ transform: "rotate(90deg)" }}
                    />
                  )
                }
                tooltipContent={
                  <TooltipAttributes
                    data={{
                      elvl: sActant.elvl,
                      logic: sActant.logic,
                      virtuality: sActant.virtuality,
                      partitivity: sActant.partitivity,
                      bundleOperator: sActant.bundleOperator,
                      bundleStart: sActant.bundleStart,
                      bundleEnd: sActant.bundleEnd,
                    }}
                  />
                }
              />
            </StyledGridColumn>
            <StyledGridColumn>
              {userCanEdit && (
                <Button
                  key="d"
                  icon={<FaTrashAlt />}
                  color="plain"
                  inverted
                  tooltipLabel="remove actant row"
                  onClick={() => {
                    removeActant(filteredActant.data.sActant.id);
                  }}
                />
              )}
            </StyledGridColumn>
          </StyledGrid>

          {/* Expanded Row */}
          {isExpanded && !isDraggingActant && (
            <StyledExpandedRow>
              <div>
                <Dropdown.Single.Basic
                  width={90}
                  placeholder="virtuality"
                  tooltipLabel="virtuality"
                  icon={<AttributeIcon attributeName="virtuality" />}
                  disabled={!userCanEdit}
                  options={virtualityDict}
                  value={sActant.virtuality}
                  onChange={(newValue) => {
                    updateActant(sActant.id, {
                      virtuality: newValue,
                    });
                  }}
                />
              </div>
              <div>
                <Dropdown.Single.Basic
                  width={120}
                  placeholder="partitivity"
                  tooltipLabel="partitivity"
                  icon={<AttributeIcon attributeName="partitivity" />}
                  disabled={!userCanEdit}
                  options={partitivityDict}
                  value={sActant.partitivity}
                  onChange={(newValue) => {
                    updateActant(sActant.id, {
                      partitivity: newValue,
                    });
                  }}
                />
              </div>
              <div>
                <Dropdown.Single.Basic
                  width={70}
                  placeholder="logical operator"
                  tooltipLabel="logical operator"
                  icon={<AttributeIcon attributeName="bundleOperator" />}
                  disabled={!userCanEdit}
                  options={operatorDict}
                  value={sActant.bundleOperator}
                  onChange={(newValue) => {
                    updateActant(sActant.id, {
                      bundleOperator: newValue,
                    });
                  }}
                />
              </div>
              <div>
                <BundleButtonGroup
                  bundleStart={sActant.bundleStart}
                  onBundleStartChange={(bundleStart) =>
                    updateActant(sActant.id, {
                      bundleStart: bundleStart,
                    })
                  }
                  bundleEnd={sActant.bundleEnd}
                  onBundleEndChange={(bundleEnd) =>
                    updateActant(sActant.id, {
                      bundleEnd: bundleEnd,
                    })
                  }
                  disabled={!userCanEdit}
                />
              </div>
            </StyledExpandedRow>
          )}
        </StyledBorderLeft>
      </StyledFlexStart>

      {/* Prop group */}
      {!isDraggingActant &&
        renderPropGroup(
          filteredActant.data.sActant.entityId,
          filteredActant.data.sActant.props,
          DraggedPropRowCategory.ACTANT
        )}

      {/* CI */}
      {!isDraggingActant && (
        <>
          {/* Classifications */}
          {classifications.length > 0 && (
            <StyledCI>
              <StyledCIHeading>Classifications:</StyledCIHeading>
              {classifications.length > 0 &&
                classifications.map((classification, key) => (
                  <StatementEditorActantClassification
                    key={key}
                    classifications={classifications}
                    classification={classification}
                    sActant={filteredActant.data.sActant}
                    statement={statement}
                    territoryParentId={territoryParentId}
                    isInsideTemplate={isInsideTemplate}
                    updateActant={updateActant}
                    userCanEdit={userCanEdit}
                    territoryActants={territoryActants}
                  />
                ))}
            </StyledCI>
          )}

          {/* Identifications */}
          {identifications.length > 0 && (
            <StyledCI>
              <StyledCIHeading>Identifications:</StyledCIHeading>
              {identifications.length > 0 &&
                identifications.map((identification, key) => (
                  <StatementEditorActantIdentification
                    key={key}
                    identification={identification}
                    identifications={identifications}
                    sActant={filteredActant.data.sActant}
                    statement={statement}
                    territoryParentId={territoryParentId}
                    isInsideTemplate={isInsideTemplate}
                    updateActant={updateActant}
                    userCanEdit={userCanEdit}
                    classEntitiesActant={classEntitiesActant}
                    territoryActants={territoryActants}
                  />
                ))}
            </StyledCI>
          )}
        </>
      )}
    </StyledRow>
  );
};
