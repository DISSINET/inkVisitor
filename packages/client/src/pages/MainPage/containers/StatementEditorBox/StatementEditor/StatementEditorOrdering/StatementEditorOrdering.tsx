import { IEntity, OrderType } from "@shared/types";
import api from "api";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import theme from "Theme/theme";
import { StatementEditorNoOrderTable } from "./StatementEditorNoOrderTable/StatementEditorNoOrderTable";
import { StatementEditorOrderTable } from "./StatementEditorOrderTable/StatementEditorOrderTable";

interface StatementEditorOrdering {
  statementId: string;
  elementsOrders: OrderType[];
  entities: { [key: string]: IEntity };
}
export const StatementEditorOrdering: React.FC<StatementEditorOrdering> = ({
  statementId,
  elementsOrders,
  entities,
}) => {
  const queryClient = useQueryClient();
  const [withOrder, setWithOrder] = useState<OrderType[]>([]);
  const [withoutOrder, setWithoutOrder] = useState<OrderType[]>([]);

  useEffect(() => {
    const elementsWithOrder = elementsOrders.filter((e) => e.order !== false);
    setWithOrder(elementsWithOrder);
    const elementsWithoutOrder = elementsOrders.filter(
      (e) => e.order === false
    );
    setWithoutOrder(elementsWithoutOrder);
  }, [elementsOrders]);

  const orderElementsMutation = useMutation(
    async (elementsWithOrdering: string[]) =>
      await api.statementReorderElements(statementId, elementsWithOrdering),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("statement");
      },
    }
  );

  const addToOrdering = (elementId: string) => {
    orderElementsMutation.mutate([
      ...withOrder.map((e) => e.elementId),
      elementId,
    ]);
  };

  const removeFromOrdering = (elementId: string) => {
    orderElementsMutation.mutate(
      withOrder.map((e) => e.elementId).filter((eId) => eId !== elementId)
    );
  };

  const changeOrder = (elementIdToMove: string, newOrder: number) => {
    let elementIds = withOrder.map((e) => e.elementId);
    // const index = elementIds.indexOf(elementIdToMove);

    elementIds = elementIds.filter((o) => o !== elementIdToMove);
    elementIds.splice(newOrder, 0, elementIdToMove);

    orderElementsMutation.mutate(elementIds);
  };

  return (
    <>
      <StatementEditorOrderTable
        elements={withOrder}
        entities={entities}
        removeFromOrdering={removeFromOrdering}
        changeOrder={changeOrder}
      />
      <p
        style={{
          fontSize: theme.fontSize.xs,
          marginBottom: "0.5rem",
          marginTop: "1.5rem",
        }}
      >
        {"Without order"}
      </p>
      <StatementEditorNoOrderTable
        elements={withoutOrder}
        entities={entities}
        addToOrdering={addToOrdering}
      />
    </>
  );
};
