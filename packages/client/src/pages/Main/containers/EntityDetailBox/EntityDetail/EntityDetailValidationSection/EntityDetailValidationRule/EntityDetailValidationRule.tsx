import { entitiesDict } from "@shared/dictionaries";
import { classesAll } from "@shared/dictionaries/entity";
import { EntityEnums } from "@shared/enums";
import { IEntity } from "@shared/types";
import {
  EProtocolTieType,
  ITerritoryValidation,
} from "@shared/types/territory";
import { Button, Input } from "components";
import Dropdown, {
  AttributeButtonGroup,
  EntitySuggester,
  EntityTag,
} from "components/advanced";
import React, { useMemo } from "react";
import { FaTrashAlt } from "react-icons/fa";
import {
  StyledBorderLeft,
  StyledFlexList,
  StyledGrid,
  StyledLabel,
} from "./EntityDetailValidationRuleStyles";
import { EntityDetailValidationText } from "./EntityDetailValidationText/EntityDetailValidationText";

interface EntityDetailValidationRule {
  validation: ITerritoryValidation;
  entities: Record<string, IEntity>;
  updateValidationRule: (changes: Partial<ITerritoryValidation>) => void;
  removeValidationRule: () => void;
  isInsideTemplate: boolean;
  territoryParentId: string | undefined;
  userCanEdit: boolean;
}
export const EntityDetailValidationRule: React.FC<
  EntityDetailValidationRule
> = ({
  validation,
  entities,
  updateValidationRule,
  removeValidationRule,
  isInsideTemplate,
  territoryParentId,
  userCanEdit,
}) => {
  const {
    detail,
    entityClasses,
    classifications,
    tieType,
    propType,
    allowedClasses,
    allowedEntities,
  } = validation;

  const disabledEntityClassesSection = useMemo<boolean>(() => {
    return allowedEntities !== undefined && allowedEntities.length > 0;
  }, [allowedEntities]);

  const allowedEntitiesClasses = useMemo<EntityEnums.Class[]>(() => {
    if (tieType === EProtocolTieType.Classification) {
      return [EntityEnums.Class.Concept];
    }
    if (tieType === EProtocolTieType.Reference) {
      return [EntityEnums.Class.Resource];
    }
    return classesAll;
  }, [tieType]);

  return (
    <StyledBorderLeft>
      <div
        style={{
          display: "flex",
          width: "100%",
          paddingTop: "0.2rem",
          paddingBottom: "1.5rem",
        }}
      >
        <EntityDetailValidationText
          validation={validation}
          entities={entities}
        />
      </div>
      <StyledGrid>
        {/* Entity classes */}
        <StyledLabel>Entity types</StyledLabel>
        <Dropdown.Multi.Entity
          width="full"
          value={entityClasses}
          onChange={(values) => updateValidationRule({ entityClasses: values })}
          options={entitiesDict}
          disabled={!userCanEdit}
        />

        {/* Classifications */}
        <StyledLabel>..classified as</StyledLabel>
        <StyledFlexList>
          {classifications.map((classification, key) => (
            <EntityTag
              key={key}
              flexListMargin
              entity={entities[classification]}
              unlinkButton={
                userCanEdit && {
                  onClick: () =>
                    updateValidationRule({
                      classifications: classifications.filter(
                        (c) => c !== classification
                      ),
                    }),
                }
              }
            />
          ))}
          {!(!userCanEdit && classifications.length > 0) && (
            <EntitySuggester
              excludedActantIds={classifications}
              categoryTypes={[EntityEnums.Class.Concept]}
              onPicked={(entity) =>
                updateValidationRule({
                  classifications: [...classifications, entity.id],
                })
              }
              disabled={!userCanEdit}
            />
          )}
        </StyledFlexList>

        {/* Tie type */}
        <StyledLabel>Tie type</StyledLabel>
        <AttributeButtonGroup
          disabled={!userCanEdit}
          noMargin
          options={[
            {
              longValue: EProtocolTieType.Property,
              shortValue: EProtocolTieType.Property,
              onClick: () =>
                updateValidationRule({ tieType: EProtocolTieType.Property }),
              selected: tieType === EProtocolTieType.Property,
            },
            {
              longValue: EProtocolTieType.Classification,
              shortValue: EProtocolTieType.Classification,
              onClick: () =>
                updateValidationRule({
                  tieType: EProtocolTieType.Classification,
                  propType: [],
                  allowedClasses: [],
                  allowedEntities: [],
                }),
              selected: tieType === EProtocolTieType.Classification,
            },
            {
              longValue: EProtocolTieType.Reference,
              shortValue: EProtocolTieType.Reference,
              onClick: () =>
                updateValidationRule({
                  tieType: EProtocolTieType.Reference,
                  propType: [],
                  allowedClasses: [],
                  allowedEntities: [],
                }),
              selected: tieType === EProtocolTieType.Reference,
            },
          ]}
        />

        {/* Prop type */}
        {tieType === EProtocolTieType.Property && (
          <>
            <StyledLabel>Prop type</StyledLabel>
            <StyledFlexList>
              {propType?.map((entityId, key) => (
                <EntityTag
                  key={key}
                  flexListMargin
                  entity={entities[entityId]}
                  unlinkButton={
                    userCanEdit && {
                      onClick: () =>
                        updateValidationRule({
                          propType: propType?.filter(
                            (pTiD) => pTiD !== entityId
                          ),
                        }),
                    }
                  }
                />
              ))}
              {!(!userCanEdit && propType && propType.length > 0) && (
                <EntitySuggester
                  categoryTypes={[EntityEnums.Class.Concept]}
                  excludedActantIds={propType}
                  onPicked={(entity) =>
                    updateValidationRule({
                      propType: [...(propType || []), entity.id],
                    })
                  }
                  disabled={!userCanEdit}
                />
              )}
            </StyledFlexList>
          </>
        )}

        {/* Allowed classes */}
        {tieType === EProtocolTieType.Property && (
          <>
            <StyledLabel>Allowed E types</StyledLabel>
            <Dropdown.Multi.Entity
              width="full"
              value={allowedClasses || []}
              onChange={(values) =>
                updateValidationRule({ allowedClasses: values })
              }
              options={entitiesDict}
              disabled={disabledEntityClassesSection || !userCanEdit}
            />
          </>
        )}

        {/* Allowed entities */}
        <StyledLabel>
          {tieType === EProtocolTieType.Classification && "Allowed Concepts"}
          {tieType === EProtocolTieType.Reference && "Allowed Resources"}
          {tieType === EProtocolTieType.Property && "Allowed E values"}
        </StyledLabel>
        <StyledFlexList>
          {allowedEntities?.map((entityId, key) => (
            <EntityTag
              key={key}
              flexListMargin
              entity={entities[entityId]}
              unlinkButton={
                userCanEdit && {
                  onClick: () =>
                    updateValidationRule({
                      allowedEntities: allowedEntities.filter(
                        (aE) => aE !== entityId
                      ),
                    }),
                }
              }
            />
          ))}
          {!(!userCanEdit && allowedEntities && allowedEntities.length > 0) && (
            <EntitySuggester
              categoryTypes={allowedEntitiesClasses}
              excludedActantIds={allowedEntities}
              onPicked={(entity) => {
                updateValidationRule({
                  allowedEntities: [...(allowedEntities || []), entity.id],
                  allowedClasses: [],
                });
              }}
              isInsideTemplate={isInsideTemplate}
              territoryParentId={territoryParentId}
              disabled={!userCanEdit}
            />
          )}
        </StyledFlexList>

        {/* Detail */}
        <StyledLabel>Detail / Notes</StyledLabel>
        <Input
          width="full"
          value={detail}
          onChangeFn={(value) => updateValidationRule({ detail: value })}
          disabled={!userCanEdit}
        />
      </StyledGrid>
      {userCanEdit && (
        <div
          style={{
            paddingTop: "1.5rem",
            paddingBottom: ".5rem",
          }}
        >
          <Button
            color="danger"
            icon={<FaTrashAlt />}
            onClick={removeValidationRule}
            inverted
            label="remove validation rule"
          />
        </div>
      )}
    </StyledBorderLeft>
  );
};