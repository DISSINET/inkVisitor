import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "api";
import { TerritoryTreeNode } from "./TerritoryTreeNode/TerritoryTreeNode";
import { IResponseTree, IResponseUser } from "@shared/types";
import { Button, Loader } from "components";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { setSelectedTerritoryPath } from "redux/features/territoryTree/selectedTerritoryPathSlice";
import { useSearchParams } from "hooks";
import { FaPlus } from "react-icons/fa";
import { ContextMenuNewTerritoryModal } from "./ContextMenuNewTerritoryModal/ContextMenuNewTerritoryModal";
import { rootTerritoryId } from "Theme/constants";
import { UserRoleMode } from "@shared/enums";
import { StyledTreeWrapper } from "./TerritoryTreeBoxStyles";

export const TerritoryTreeBox: React.FC = () => {
  const queryClient = useQueryClient();

  const { status, data, error, isFetching } = useQuery(
    ["tree"],
    async () => {
      const res = await api.treeGet();
      return res.data;
    },
    { enabled: api.isLoggedIn() }
  );
  const userId = localStorage.getItem("userid");

  const {
    status: userStatus,
    data: userData,
    error: userError,
    isFetching: userIsFetching,
  } = useQuery(
    ["user"],
    async () => {
      if (userId) {
        const res = await api.usersGet(userId);
        return res.data;
      }
    },
    { enabled: api.isLoggedIn() }
  );

  const addToFavoritesMutation = useMutation(
    async (favoritedTerritory: string) => {
      if (userId && userData) {
        await api.usersUpdate(userId, {
          storedTerritories: [
            // ...userData.storedTerritories.map(storedTerritory => {"territoryId": storedTerritory.territory.id}),
            { territoryId: favoritedTerritory },
          ],
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tree"]);
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  useEffect(() => {
    console.log(userData?.storedTerritories);
  }, [userData]);

  const userRole = localStorage.getItem("userrole");
  const { territoryId } = useSearchParams();
  const [showCreate, setShowCreate] = useState(false);

  const dispatch = useAppDispatch();
  const selectedTerritoryPath = useAppSelector(
    (state) => state.territoryTree.selectedTerritoryPath
  );

  const searchTree = (
    element: IResponseTree,
    matchingTitle: string
  ): IResponseTree | null => {
    if (element.territory.id === matchingTitle) {
      return element;
    } else if (element.children != null) {
      var i;
      var result = null;
      for (i = 0; result === null && i < element.children.length; i++) {
        result = searchTree(element.children[i], matchingTitle);
      }
      return result;
    }
    return null;
  };

  useEffect(() => {
    if (data) {
      const foundTerritory = searchTree(data, territoryId);
      if (foundTerritory) {
        dispatch(setSelectedTerritoryPath(foundTerritory.path));
      }
    }
  }, [data, territoryId]);

  return (
    <>
      {userRole === UserRoleMode.Admin && (
        <Button
          label="new territory"
          icon={<FaPlus />}
          onClick={() => setShowCreate(true)}
        />
      )}

      <StyledTreeWrapper>
        {data && (
          <TerritoryTreeNode
            right={data.right}
            territory={data.territory}
            children={data.children}
            lvl={data.lvl}
            statementsCount={data.statementsCount}
            initExpandedNodes={selectedTerritoryPath}
            empty={data.empty}
            // storedTerritories={userData?.storedTerritories?.map((territory) =>
            //   console.log(territory?.territory?.id)
            // )}
            addToFavoritesMutation={addToFavoritesMutation}
          />
        )}
      </StyledTreeWrapper>

      {showCreate && (
        <ContextMenuNewTerritoryModal
          onClose={() => setShowCreate(false)}
          territoryActantId={rootTerritoryId}
        />
      )}
      <Loader show={isFetching} />
    </>
  );
};
