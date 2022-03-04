import { IEntity, IProp } from "@shared/types";
import api from "api";
import React, { useCallback } from "react";
import { useQuery } from "react-query";
import { ItemTypes } from "types";
import { FirstLevelPropGroup } from "./FirstLevelPropGroup/FirstLevelPropGroup";
import { PropGroupRow } from "./PropGroupRow/PropGroupRow";
import { StyledGrid, StyledListHeaderColumn } from "./PropGroupStyles";
import { SecondLevelPropGroup } from "./SecondLevelPropGroup/SecondLevelPropGroup";
import { ThirdLevelPropGroup } from "./ThirdLevelPropGroup/ThirdLevelPropGroup";

interface IPropGroup {
  originId: string;
  entities: { [key: string]: IEntity };
  props: IProp[];
  territoryId: string;

  updateProp: (propId: string, changes: any) => void;
  removeProp: (propId: string) => void;
  addProp: (originId: string) => void;
  movePropDown: (propId: string) => void;
  movePropUp: (propId: string) => void;
  movePropToIndex: (propId: string, oldIndex: number, newIndex: number) => void;

  userCanEdit: boolean;
  openDetailOnCreate: boolean;
}

export const PropGroup: React.FC<IPropGroup> = ({
  originId,
  entities,
  props,
  territoryId,

  updateProp,
  removeProp,
  addProp,
  movePropDown,
  movePropUp,
  movePropToIndex,

  userCanEdit,
  openDetailOnCreate = false,
}) => {
  // territory query
  const {
    status,
    data: territoryActants,
    error,
    isFetching,
  } = useQuery(
    ["territoryActants", territoryId],
    async () => {
      if (territoryId) {
        const res = await api.entityIdsInTerritory(territoryId);
        return res.data;
      } else {
        return [];
      }
    },
    {
      initialData: [],
      enabled: !!territoryId && api.isLoggedIn(),
    }
  );

  const renderFirsLevelPropRow = useCallback(
    (
      prop1: IProp,
      pi1: number,
      moveProp: (dragIndex: number, hoverIndex: number) => void
    ) => {
      return (
        <React.Fragment key={prop1.id}>
          <PropGroupRow
            id={prop1.id}
            index={pi1}
            itemType={ItemTypes.PROP_ROW1}
            parentId={originId}
            prop={prop1}
            entities={entities}
            level={1}
            order={pi1}
            firstRowinGroup={pi1 === 0}
            lastRowinGroup={pi1 === props.length - 1}
            updateProp={updateProp}
            removeProp={removeProp}
            addProp={addProp}
            movePropDown={movePropDown}
            movePropUp={movePropUp}
            userCanEdit={userCanEdit}
            territoryActants={territoryActants || []}
            openDetailOnCreate={openDetailOnCreate}
            moveProp={moveProp}
            movePropToIndex={movePropToIndex}
          />
          {/* 2nd level */}
          <SecondLevelPropGroup
            prop1={prop1}
            renderSecondLevelPropRow={renderSecondLevelPropRow}
            secondLevelProps={prop1.children}
          />
        </React.Fragment>
      );
    },
    [entities]
  );

  const renderSecondLevelPropRow = useCallback(
    (
      prop2: IProp,
      pi2: number,
      prop1: IProp,
      moveProp: (dragIndex: number, hoverIndex: number) => void
    ) => {
      return (
        <React.Fragment key={prop2.id}>
          <PropGroupRow
            id={prop2.id}
            index={pi2}
            itemType={ItemTypes.PROP_ROW2}
            parentId={prop1.id}
            prop={prop2}
            entities={entities}
            level={2}
            order={pi2}
            firstRowinGroup={pi2 === 0}
            lastRowinGroup={pi2 === prop1.children.length - 1}
            lastInGroup={pi2 === prop1.children.length - 1}
            updateProp={updateProp}
            removeProp={removeProp}
            addProp={addProp}
            movePropDown={movePropDown}
            movePropUp={movePropUp}
            userCanEdit={userCanEdit}
            territoryActants={territoryActants || []}
            openDetailOnCreate={openDetailOnCreate}
            moveProp={moveProp}
            movePropToIndex={movePropToIndex}
          />
          {/* 3rd level */}
          <ThirdLevelPropGroup
            prop1={prop1}
            pi2={pi2}
            prop2={prop2}
            renderThirdLevelPropRow={renderThirdLevelPropRow}
            thirdLevelProps={prop2.children}
          />
        </React.Fragment>
      );
    },
    [entities]
  );

  const renderThirdLevelPropRow = useCallback(
    (
      prop3: IProp,
      pi3: number,
      prop1: IProp,
      prop2: IProp,
      pi2: number,
      moveProp: (dragIndex: number, hoverIndex: number) => void
    ) => {
      return (
        <PropGroupRow
          key={prop3.id + "|" + pi3}
          id={prop3.id}
          index={pi3}
          itemType={ItemTypes.PROP_ROW3}
          parentId={prop2.id}
          prop={prop3}
          entities={entities}
          level={3}
          order={pi3}
          firstRowinGroup={pi3 === 0}
          lastRowinGroup={pi3 === prop1.children.length - 1}
          lastInGroup={pi3 === prop2.children.length - 1}
          updateProp={updateProp}
          removeProp={removeProp}
          addProp={addProp}
          movePropDown={movePropDown}
          movePropUp={movePropUp}
          userCanEdit={userCanEdit}
          territoryActants={territoryActants || []}
          openDetailOnCreate={openDetailOnCreate}
          moveProp={moveProp}
          movePropToIndex={movePropToIndex}
        />
      );
    },
    [entities]
  );

  return props.length > 0 ? (
    <tr>
      <td colSpan={4}>
        <React.Fragment key={originId}>
          <StyledGrid>
            {/* Header */}
            <StyledListHeaderColumn>Type</StyledListHeaderColumn>
            <StyledListHeaderColumn>Value</StyledListHeaderColumn>
            <StyledListHeaderColumn></StyledListHeaderColumn>
          </StyledGrid>
          {/* Rows */}
          <FirstLevelPropGroup
            props={props}
            renderFirsLevelPropRow={renderFirsLevelPropRow}
          />
        </React.Fragment>
      </td>
    </tr>
  ) : (
    <tr />
  );
};
