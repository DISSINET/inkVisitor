import { EntityEnums, UserEnums } from "@shared/enums";
import { IEntity } from "@shared/types";
import api from "api";
import { ButtonGroup, Button } from "components";
import { EntityTag } from "components/advanced";
import { DEntity } from "constructors";
import { useSearchParams } from "hooks";
import React from "react";
import { FaClone, FaTrashAlt, FaRecycle, FaEdit } from "react-icons/fa";
import { GrClone } from "react-icons/gr";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import {
  StyledActantHeaderRow,
  StyledTagWrap,
} from "./EntityDetailHeaderRowStyles";

interface EntityDetailHeaderRow {
  entity: IEntity;
  userCanEdit: boolean;
  mayBeRemoved?: boolean;
  setShowRemoveSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateTemplateModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export const EntityDetailHeaderRow: React.FC<EntityDetailHeaderRow> = ({
  entity,
  userCanEdit,
  mayBeRemoved,
  setShowRemoveSubmit,
  setCreateTemplateModal,
}) => {
  const queryClient = useQueryClient();

  const { setStatementId, setTerritoryId, appendDetailId } = useSearchParams();

  const duplicateEntityMutation = useMutation(
    async (newEntity: IEntity) => {
      await api.entityCreate(newEntity);
    },
    {
      onSuccess: (data, variables) => {
        appendDetailId(variables.id);
        toast.info(`Entity duplicated!`);
        queryClient.invalidateQueries("templates");
        if (variables.class === EntityEnums.Class.Territory) {
          queryClient.invalidateQueries("tree");
        }
      },
      onError: () => {
        toast.error(`Error: Entity not duplicated!`);
      },
    }
  );

  const duplicateEntity = (entityToDuplicate: IEntity) => {
    const newEntity = DEntity(
      entityToDuplicate,
      localStorage.getItem("userrole") as UserEnums.Role
    );
    duplicateEntityMutation.mutate(newEntity);
  };

  return (
    <StyledActantHeaderRow>
      <StyledTagWrap>
        <EntityTag entity={entity} tooltipText={entity.data.text} fullWidth />
      </StyledTagWrap>
      <ButtonGroup style={{ marginTop: "1rem" }}>
        {entity.class !== EntityEnums.Class.Statement && userCanEdit && (
          <Button
            icon={<FaClone size={14} />}
            color="primary"
            tooltipLabel="duplicate entity"
            inverted
            onClick={() => {
              duplicateEntity(entity);
            }}
          />
        )}
        {userCanEdit && (
          <Button
            color="primary"
            icon={<FaTrashAlt />}
            disabled={!mayBeRemoved}
            tooltipLabel={
              mayBeRemoved
                ? "remove entity"
                : "entity cannot be removed while it is linked elsewhere"
            }
            inverted
            onClick={() => {
              if (mayBeRemoved) {
                setShowRemoveSubmit(true);
              }
            }}
          />
        )}
        {userCanEdit && (
          <Button
            key="template"
            icon={<GrClone size={14} />}
            tooltipLabel={`create template from ${
              entity.isTemplate ? "template" : "entity"
            }`}
            inverted
            color="primary"
            onClick={() => {
              setCreateTemplateModal(true);
            }}
          />
        )}
        <Button
          key="refresh"
          icon={<FaRecycle size={14} />}
          tooltipLabel="refresh entity data"
          inverted
          color="primary"
          onClick={() => {
            queryClient.invalidateQueries(["entity"]);
          }}
        />
        {entity.class === EntityEnums.Class.Statement && (
          <Button
            key="edit"
            icon={<FaEdit size={14} />}
            tooltipLabel="open statement in editor"
            inverted
            color="primary"
            onClick={() => {
              setStatementId(entity.id);
              if (!entity.isTemplate) {
                setTerritoryId(entity.data.territory.id);
              }
            }}
          />
        )}
      </ButtonGroup>
    </StyledActantHeaderRow>
  );
};
