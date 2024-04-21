import { EntityEnums, UserEnums } from "@shared/enums";
import {
  IEntity,
  IResource,
  IResponseGeneric,
  IResponseStatement,
  IStatement,
} from "@shared/types";
import { UseMutationResult, useQuery } from "@tanstack/react-query";
import api from "api";
import { AxiosResponse } from "axios";
import { Loader } from "components";
import { EntitySuggester, EntityTag } from "components/advanced";
import TextAnnotator from "components/advanced/Annotator/Annotator";
import AnnotatorProvider from "components/advanced/Annotator/AnnotatorProvider";
import React, { useMemo, useState } from "react";
import { TiDocumentText } from "react-icons/ti";
import { CellProps } from "react-table";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { StyledDocumentTag } from "../StatementLitBoxStyles";

type CellType = CellProps<IResponseStatement>;

interface StatementListTextAnnotator {
  statements: IResponseStatement[];
  handleRowClick?: (rowId: string) => void;
  actantsUpdateMutation: UseMutationResult<
    AxiosResponse<IResponseGeneric>,
    unknown,
    {
      statementId: string;
      data: {};
    },
    unknown
  >;
  entities: { [key: string]: IEntity };
  right: UserEnums.RoleMode;

  cloneStatementMutation: UseMutationResult<
    AxiosResponse<IResponseGeneric<any>>,
    unknown,
    string,
    unknown
  >;
  setStatementToDelete: React.Dispatch<
    React.SetStateAction<IStatement | undefined>
  >;
  setShowSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  addStatementAtCertainIndex: (index: number) => Promise<void>;

  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
}

export const StatementListTextAnnotator: React.FC<
  StatementListTextAnnotator
> = ({
  statements,
  handleRowClick = () => {},
  actantsUpdateMutation,
  entities,
  right,

  cloneStatementMutation,
  setStatementToDelete,
  setShowSubmit,
  addStatementAtCertainIndex,

  selectedRows,
  setSelectedRows,
}) => {
  const dispatch = useAppDispatch();

  const {
    data: resources,
    error: resourcesError,
    isFetching: resourcesIsFetching,
  } = useQuery({
    queryKey: ["resourcesWithDocuments"],
    queryFn: async () => {
      const res = await api.entitiesSearch({
        resourceHasDocument: true,
      });
      return res.data;
    },
    enabled: api.isLoggedIn(),
  });

  const [selectedResource, setSelectedResource] = useState<IResource | false>(
    false
  );

  const selectedDocumentId = useMemo<string | false>(() => {
    if (selectedResource && selectedResource.data.documentId) {
      return selectedResource.data.documentId;
    }
    return false;
  }, [selectedResource]);

  const {
    data: selectedDocument,
    error: selectedDocumentError,
    isFetching: selectedDocumentIsFetching,
  } = useQuery({
    queryKey: ["document", selectedDocumentId],
    queryFn: async () => {
      if (selectedDocumentId !== false) {
        const res = await api.documentGet(selectedDocumentId);
        return res.data;
      }
      return false;
    },
    enabled: api.isLoggedIn() && selectedDocumentId !== false,
  });

  const panelWidths: number[] = useAppSelector(
    (state) => state.layout.panelWidths
  );

  return (
    <div>
      <div style={{ alignItems: "center" }}>
        <div style={{}}>
          {selectedResource
            ? "selected resource"
            : "select resource with document"}{" "}
        </div>
        {!selectedResource && (
          <EntitySuggester
            disableCreate={false}
            categoryTypes={[EntityEnums.Class.Resource]}
            preSuggestions={resources?.filter((res, ri) => ri < 10)}
            onPicked={(entity) => {
              setSelectedResource(entity as IResource);
            }}
          />
        )}
        {selectedResource && (
          <EntityTag
            entity={selectedResource}
            unlinkButton={{
              onClick: () => {
                setSelectedResource(false);
              },
            }}
          />
        )}

        {!selectedDocumentIsFetching && <Loader />}
        {!selectedDocumentIsFetching && selectedDocument && (
          <StyledDocumentTag>
            <TiDocumentText style={{ marginRight: "2px" }} />
            {selectedDocument?.title}
          </StyledDocumentTag>
        )}
        {!selectedDocumentIsFetching &&
          selectedResource !== false &&
          selectedResource.data.documentId === undefined && (
            <span>
              <i>This Resource does not have any document</i>
            </span>
          )}
      </div>
      <div style={{ marginTop: "2px" }}>
        <AnnotatorProvider>
          {selectedDocument && (
            <TextAnnotator
              width={panelWidths[1]}
              displayLineNumbers={true}
              height={500}
              initialText={selectedDocument ? selectedDocument.content : ""}
            />
          )}
        </AnnotatorProvider>
      </div>
    </div>
  );
};