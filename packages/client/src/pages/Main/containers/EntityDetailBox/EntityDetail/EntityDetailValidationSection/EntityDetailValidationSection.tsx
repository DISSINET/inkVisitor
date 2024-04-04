import React from "react";
import {
  StyledBlockSeparator,
  StyledDetailSectionHeader,
  StyledValidationList,
} from "../EntityDetailStyles";
import {
  EProtocolTieType,
  ITerritoryValidation,
} from "@shared/types/territory";
import { Button } from "components";
import { FaPlus } from "react-icons/fa";
import { deepCopy } from "utils/utils";
import { EntityDetailValidation } from "./EntityDetailValidation";
import { IEntity, IResponseGeneric } from "@shared/types";
import { UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const initValidation: ITerritoryValidation = {
  detail: "",
  entityClasses: [],
  classifications: [],
  allowedEntities: [],
  allowedClasses: [],
  propType: [],
  tieType: EProtocolTieType.Property,
};

interface EntityDetailValidationSection {
  validations?: ITerritoryValidation[];
  entities: Record<string, IEntity>;
  updateEntityMutation: UseMutationResult<
    AxiosResponse<IResponseGeneric<any>, any>,
    Error,
    any,
    unknown
  >;
  userCanEdit: boolean;
  isInsideTemplate: boolean;
  territoryParentId: string | undefined;
}
export const EntityDetailValidationSection: React.FC<
  EntityDetailValidationSection
> = ({
  validations,
  entities,
  updateEntityMutation,
  userCanEdit,
  isInsideTemplate,
  territoryParentId,
}) => {
  const initValidationRule = () => {
    updateEntityMutation.mutate({
      data: {
        validations: validations
          ? [...validations, initValidation]
          : [initValidation],
      },
    });
  };
  const removeValidationRule = (indexToRemove: number) => {
    updateEntityMutation.mutate({
      data: {
        validations: validations?.filter((_, index) => index !== indexToRemove),
      },
    });
  };

  return (
    <>
      <StyledDetailSectionHeader>
        Validation rules
        {userCanEdit && (
          <span style={{ marginLeft: "1rem" }}>
            <Button
              color="primary"
              label="new validation rule"
              icon={<FaPlus />}
              onClick={initValidationRule}
            />
          </span>
        )}
      </StyledDetailSectionHeader>

      {validations && (
        <StyledValidationList>
          {(validations as ITerritoryValidation[]).map((validation, key) => {
            return (
              <React.Fragment key={key}>
                <EntityDetailValidation
                  key={key}
                  validation={validation}
                  entities={entities}
                  updateValidationRule={(
                    changes: Partial<ITerritoryValidation>
                  ) => {
                    const validationsCopy = deepCopy(
                      validations as ITerritoryValidation[]
                    );
                    if (validationsCopy[key]) {
                      const updatedObject: ITerritoryValidation = {
                        ...validationsCopy[key],
                        ...changes,
                      };
                      const newArray = [
                        ...validationsCopy.slice(0, key),
                        updatedObject,
                        ...validationsCopy.slice(key + 1),
                      ];
                      updateEntityMutation.mutate({
                        data: {
                          validations: newArray,
                        },
                      });
                    }
                  }}
                  removeValidationRule={() => removeValidationRule(key)}
                  isInsideTemplate={isInsideTemplate}
                  territoryParentId={territoryParentId}
                />
                {key !== validations.length - 1 && <StyledBlockSeparator />}
              </React.Fragment>
            );
          })}
        </StyledValidationList>
      )}
    </>
  );
};