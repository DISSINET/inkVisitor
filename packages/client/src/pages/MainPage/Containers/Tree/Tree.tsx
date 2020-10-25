import React from "react";

import { Tag, Button } from "components";
import { Entities } from "types";
import { ResponseTerritoryI } from "@shared/types/response-territory";
import { TerritoryI } from "@shared/types";

interface Tree {
  territory?: ResponseTerritoryI;
  fetchTerritory: (id: string, token?: string) => void;
  setActiveStatementId: (id: string) => void;
  token?: string;
}

export const Tree: React.FC<Tree> = ({
  territory,
  fetchTerritory,
  setActiveStatementId,
  token,
}) => {
  const territoryParent = territory && (territory.data.parent as string);

  return (
    <div>
      <div className="flex flex-col mt-1">
        <div className="mb-1">
          <h3 className="font-bold">{"Selected territory: "}</h3>
          <Tag
            propId={territory?.id}
            category={Entities.T.id}
            color={Entities.T.color}
            label={territory?.data.label}
          />
        </div>
        {territoryParent && (
          <div className="">
            <h3>{"Parent territory: "}</h3>
            <Tag
              category={Entities.T.id}
              color={Entities.T.color}
              label={territoryParent && territoryParent}
              button={
                territoryParent &&
                territoryParent.length > 0 && (
                  <Button
                    onClick={() => {
                      fetchTerritory(territoryParent, token && token);
                      setActiveStatementId("");
                    }}
                    label="<"
                  />
                )
              }
            />
          </div>
        )}
      </div>
      <div className="flex flex-col mt-1">
        {territory && territory.children && territory.children.length > 0 && (
          <h3>{"Children territories: "}</h3>
        )}
        {territory &&
          territory.children.map((child: TerritoryI, key) => {
            return (
              <div className="flex mb-1" key={key}>
                <Tag
                  propId={child.id}
                  category={Entities.T.id}
                  color={Entities.T.color}
                  label={child && child.data.label}
                  button={
                    <>
                      <Button
                        onClick={() => {
                          fetchTerritory(child.id, token && token);
                          setActiveStatementId("");
                        }}
                        label=">"
                      />
                    </>
                  }
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};
