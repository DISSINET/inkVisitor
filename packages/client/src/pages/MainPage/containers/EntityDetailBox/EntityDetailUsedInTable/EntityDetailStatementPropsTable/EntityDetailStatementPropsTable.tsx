import { IEntity } from "@shared/types";
import { IResponseUsedInStatementProps } from "@shared/types/response-detail";
import { Table } from "components";
import { useSearchParams } from "hooks";
import { EntityTag } from "pages/MainPage/containers/EntityTag/EntityTag";
import React, { useMemo } from "react";
import { Cell, Column } from "react-table";
import {
  StyledShortenedText,
  StyledTableTextGridCell,
} from "../EntityDetailUsedInTableStyles";

interface EntityDetailStatementPropsTable {
  title: { singular: string; plural: string };
  entities: { [key: string]: IEntity };
  useCases: IResponseUsedInStatementProps[];
  perPage?: number;
}
export const EntityDetailStatementPropsTable: React.FC<
  EntityDetailStatementPropsTable
> = ({ title, entities, useCases, perPage = 5 }) => {
  const data = useMemo(() => (useCases ? useCases : []), [useCases]);

  const renderEntityTag = (entity: IEntity) => {
    return (
      <StyledTableTextGridCell>
        <EntityTag fullWidth actant={entity} />
      </StyledTableTextGridCell>
    );
  };
  const columns: Column<{}>[] = React.useMemo(
    () => [
      {
        Header: "Origin",
        accesor: "data",
        Cell: ({ row }: Cell) => {
          const useCase = row.original as IResponseUsedInStatementProps;
          const entityId = useCase.originId;
          const entity = entityId ? entities[entityId] : false;
          return <>{entity && renderEntityTag(entity)}</>;
        },
      },
      {
        Header: "Type",
        Cell: ({ row }: Cell) => {
          const useCase = row.original as IResponseUsedInStatementProps;
          const entityId = useCase.typeId;
          const entity = entityId ? entities[entityId] : false;
          return <>{entity && renderEntityTag(entity)}</>;
        },
      },
      {
        Header: "Value",
        Cell: ({ row }: Cell) => {
          const useCase = row.original as IResponseUsedInStatementProps;
          const entityId = useCase.valueId;
          const entity = entityId ? entities[entityId] : false;
          return <>{entity && renderEntityTag(entity)}</>;
        },
      },
    ],
    [entities]
  );

  return (
    <>
      <Table
        columns={columns}
        data={data}
        entityTitle={title}
        perPage={perPage}
      />
    </>
  );
};
