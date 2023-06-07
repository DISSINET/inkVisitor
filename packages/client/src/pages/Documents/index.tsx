import { IDocument, IResponseDocument, IResponseEntity } from "@shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "api";
import { Loader, Submit } from "components";
import React, { ChangeEvent, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DocumentModal } from "../../components/advanced/DocumentModal/DocumentModal";
import { DocumentRow } from "./DocumentRow/DocumentRow";
import {
  StyledBoxWrap,
  StyledContent,
  StyledGrid,
  StyledHeading,
  StyledInputWrap,
} from "./DocumentsPageStyles";

type DocumentWithResource = {
  document: IResponseDocument;
  resource: false | IResponseEntity;
};

export const DocumentsPage: React.FC = ({}) => {
  const queryClient = useQueryClient();

  const {
    data: documents,
    error,
    isFetching,
  } = useQuery(
    ["documents"],
    async () => {
      const res = await api.documentsGet({});
      return res.data;
    },
    {
      enabled: api.isLoggedIn(),
    }
  );

  const {
    data: resources,
    error: resourcesError,
    isFetching: resourcesIsFetching,
  } = useQuery(
    ["resourcesWithDocuments"],
    async () => {
      const res = await api.entitiesSearch({
        resourceHasDocument: true,
      });
      return res.data;
    },
    {
      enabled: api.isLoggedIn(),
    }
  );

  const documentsWithResources: DocumentWithResource[] = useMemo(() => {
    return documents
      ? documents.map((document) => {
          const resource =
            resources &&
            resources.find(
              (resource) => resource.data.documentId === document.id
            );
          return { document, resource: resource ?? false };
        })
      : [];
  }, [resources, documents]);

  const uploadDocumentMutation = useMutation(
    async (doc: IDocument) => api.documentUpload(doc),
    {
      onSuccess: (variables, data) => {
        queryClient.invalidateQueries(["documents"]);
      },
    }
  );

  const updateDocumentMutation = useMutation(
    async (data: { id: string; doc: Partial<IDocument> }) =>
      api.documentUpdate(data.id, data.doc),
    {
      onSuccess: (variables, data) => {
        setEditMode(false);
        queryClient.invalidateQueries(["documents"]);
      },
    }
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (text) {
          handleUpload(file.name, text as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleUpload = (filename: string, text: string) => {
    const document: IDocument = {
      id: uuidv4(),
      title: filename.substring(0, filename.lastIndexOf(".")) || filename,
      content: text,
    };
    uploadDocumentMutation.mutate(document);
  };

  const [openedDocumentId, setOpenedDocumentId] = useState<string | false>(
    false
  );

  const handleDocumentClick = (id: string) => {
    setOpenedDocumentId(id);
  };

  const handleModalClose = () => {
    setOpenedDocumentId(false);
  };

  const documentDeleteMutation = useMutation(
    async (id: string) => await api.documentDelete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["documents"]);
        setDocToDelete(false);
      },
    }
  );

  const [docToDelete, setDocToDelete] = useState<string | false>(false);
  const [editMode, setEditMode] = useState<false | number>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <StyledContent>
        <StyledBoxWrap>
          <div>
            <StyledHeading>Documents</StyledHeading>
            <StyledGrid>
              {documentsWithResources.map(
                (documentWithResource: DocumentWithResource, key: number) => {
                  return (
                    <DocumentRow
                      key={key}
                      document={documentWithResource.document}
                      resource={documentWithResource.resource}
                      handleDocumentClick={handleDocumentClick}
                      setDocToDelete={setDocToDelete}
                      updateDocumentMutation={updateDocumentMutation}
                      editMode={editMode === key}
                      setEditMode={() => setEditMode(key)}
                      cancelEditMode={() => setEditMode(false)}
                    />
                  );
                }
              )}
            </StyledGrid>
          </div>
          <StyledInputWrap onClick={() => inputRef.current?.click()}>
            Upload document
            <input
              ref={inputRef}
              type="file"
              accept=".txt"
              title="x"
              onChange={handleFileChange}
              hidden
            />
          </StyledInputWrap>

          <Loader show={resourcesIsFetching} size={50} />
        </StyledBoxWrap>
      </StyledContent>

      {openedDocumentId && (
        <DocumentModal
          documentId={openedDocumentId}
          onClose={handleModalClose}
        />
      )}

      <Submit
        title="Delete document"
        text="Do you really want to delete this document?"
        show={docToDelete !== false}
        onSubmit={() =>
          docToDelete && documentDeleteMutation.mutate(docToDelete)
        }
        onCancel={() => setDocToDelete(false)}
      />
    </>
  );
};
