import { certaintyDict } from "@shared/dictionaries";
import { RelationEnums } from "@shared/enums";
import { EntityTooltip as EntityTooltipNamespace } from "@shared/types";
import api from "api";
import { LetterIcon, Loader, Tooltip } from "components";
import React, { ReactElement, useState } from "react";
import { AiOutlineTag } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { BsCardText } from "react-icons/bs";
import { ImListNumbered } from "react-icons/im";
import { useQuery } from "react-query";
import { EventType, PopupPosition } from "reactjs-popup/dist/types";
import { Colors } from "types";
import { EntityTooltipRelationTreeTable } from "./EntityTooltipRelationTreeTable/EntityTooltipRelationTreeTable";
import {
  StyledDetail,
  StyledIconWrap,
  StyledLabel,
  StyledLetterIconWrap,
  StyledLoaderWrap,
  StyledRelations,
  StyledRelationTypeBlock,
  StyledRow,
  StyledTooltipSeparator,
} from "./EntityTooltipStyles";

interface EntityTooltip {
  // trigger
  children: ReactElement;
  // entity
  entityId: string;
  label?: string;
  detail?: string;
  text?: string;
  itemsCount?: number;
  // settings
  position?: PopupPosition | PopupPosition[];
  on?: EventType | EventType[];
  noArrow?: boolean;
  color?: typeof Colors[number];
  disabled?: boolean;
  offsetX?: number;
  offsetY?: number;
  onOpen?: () => void;
  onClose?: () => void;
}
export const EntityTooltip: React.FC<EntityTooltip> = ({
  // trigger
  children,
  // entity
  entityId,
  label,
  detail,
  text,
  itemsCount,
  // settings
  position,
  on,
  noArrow,
  color,
  disabled,
  offsetX,
  offsetY,
  onOpen,
  onClose,
}) => {
  const [tooltipOpened, setTooltipOpened] = useState(false);

  const { data: tooltipData, isFetching } = useQuery(
    ["tooltip", entityId, tooltipOpened],
    async () => {
      const res = await api.tooltipGet(entityId);
      return res.data;
    },
    {
      enabled: api.isLoggedIn() && !!entityId && tooltipOpened,
    }
  );

  const renderEntityInfo = () => (
    <>
      {(text || detail || label) && (
        <>
          <StyledRow>
            <StyledIconWrap>
              <AiOutlineTag />
            </StyledIconWrap>
            <StyledLabel>{label}</StyledLabel>
          </StyledRow>
          {text && (
            <StyledRow>
              <StyledIconWrap>{<BsCardText />}</StyledIconWrap>
              <StyledDetail>{text}</StyledDetail>
            </StyledRow>
          )}
          {detail && (
            <StyledRow>
              <StyledIconWrap>
                <BiCommentDetail />
              </StyledIconWrap>

              <StyledDetail>{detail}</StyledDetail>
            </StyledRow>
          )}
          {itemsCount !== undefined && (
            <StyledRow>
              <StyledIconWrap>
                <ImListNumbered />
              </StyledIconWrap>
              <StyledDetail>{itemsCount}</StyledDetail>
            </StyledRow>
          )}
        </>
      )}
    </>
  );

  const renderRelations = (tooltipData: EntityTooltipNamespace.IResponse) => {
    const {
      actionEventEquivalent,
      identifications,
      superclassTrees,
      superordinateLocationTrees,
      synonymCloud,
      entities,
    } = tooltipData;

    return (
      <StyledRelations>
        {/* actionEventEquivalent - Node */}
        {actionEventEquivalent.length > 0 && (
          <>
            <StyledLetterIconWrap>
              <LetterIcon
                color="white"
                letter={RelationEnums.Type.ActionEventEquivalent}
              />
            </StyledLetterIconWrap>
            <StyledRelationTypeBlock>
              <EntityTooltipRelationTreeTable
                relationTreeArray={actionEventEquivalent}
                entities={entities}
              />
            </StyledRelationTypeBlock>
          </>
        )}
        {/* identifications - [] */}
        {identifications.length > 0 && (
          <>
            <StyledLetterIconWrap>
              <LetterIcon
                color="white"
                letter={RelationEnums.Type.Identification}
              />
            </StyledLetterIconWrap>
            <StyledRelationTypeBlock>
              {identifications.map((identification, key) => {
                const entity = entities[identification.entityId];
                // TODO: show class in text
                return (
                  <React.Fragment key={key}>
                    {`${entity.label} (`}
                    {/* <div style={{ textTransform: "uppercase" }}> */}
                    {certaintyDict[identification.certainty].label}
                    {/* </div> */}
                    {`)${key !== identifications.length - 1 ? ", " : ""}`}
                  </React.Fragment>
                );
              })}
            </StyledRelationTypeBlock>
          </>
        )}
        {/* superclassTrees - Node */}
        {superclassTrees.length > 0 && (
          <>
            <StyledLetterIconWrap>
              <LetterIcon
                color="white"
                letter={RelationEnums.Type.Superclass}
              />
            </StyledLetterIconWrap>
            {/* Render tree table */}
            <EntityTooltipRelationTreeTable
              relationTreeArray={superclassTrees}
              entities={entities}
            />
          </>
        )}
        {/* superordinateLocationTrees - Node */}
        {superordinateLocationTrees.length > 0 && (
          <>
            <StyledLetterIconWrap>
              <LetterIcon
                color="white"
                letter={RelationEnums.Type.SuperordinateLocation}
              />
            </StyledLetterIconWrap>
            <StyledRelationTypeBlock>
              <EntityTooltipRelationTreeTable
                relationTreeArray={superordinateLocationTrees}
                entities={entities}
              />
            </StyledRelationTypeBlock>
          </>
        )}
        {/* synonymCloud - string[] */}
        {synonymCloud && synonymCloud.length > 0 && (
          <>
            <StyledLetterIconWrap>
              <LetterIcon color="white" letter={RelationEnums.Type.Synonym} />
            </StyledLetterIconWrap>
            <StyledRelationTypeBlock>
              {synonymCloud.map((synonym, key) => {
                const entity = entities[synonym];
                return (
                  <React.Fragment key={key}>
                    {`${entity.label}${
                      key !== synonymCloud.length - 1 ? ", " : ""
                    }`}
                  </React.Fragment>
                );
              })}
            </StyledRelationTypeBlock>
          </>
        )}
        {/* TODO: add new relations */}
      </StyledRelations>
    );
  };

  const renderContent = () => (
    <>
      {renderEntityInfo()}
      {tooltipData ? (
        renderRelations(tooltipData)
      ) : (
        <StyledLoaderWrap>
          <Loader size={16} inverted show />
        </StyledLoaderWrap>
      )}
    </>
  );

  return (
    <Tooltip
      content={renderContent()}
      position={position}
      on={on}
      noArrow={noArrow}
      color={color}
      disabled={disabled}
      offsetX={offsetX}
      offsetY={offsetY}
      onOpen={() => setTooltipOpened(true)}
      onClose={() => setTooltipOpened(false)}
    >
      <StyledTooltipSeparator>{children}</StyledTooltipSeparator>
    </Tooltip>
  );
};
