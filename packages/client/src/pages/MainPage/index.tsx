import React, { useEffect } from "react";
import { connect } from "react-redux";

import { Box, Button, Header } from "components";
import { ResponseTerritoryI } from "@shared/types/response-territory";
import { fetchMeta } from "redux/actions/metaActions";
import { fetchTerritory } from "redux/actions/territoryTreeActions";
import { setActiveStatementId } from "redux/actions/statementActions";
import { Tree } from "pages/MainPage/Containers/Tree/Tree";
import { ResponseMetaI } from "@shared/types/response-meta";
import { StatementsTable } from "./Containers/StatementsTable/StatementsTable";
import { StatementEditor } from "./Containers/StatementEditor/StatementEditor";

interface MainPage {
  fetchMeta: () => void;
  meta: ResponseMetaI;
  fetchTerritory: (id: string) => void;
  territory: ResponseTerritoryI;
  setActiveStatementId: (id: string) => void;
  activeStatementId: string;
}

const initTerritory = "T3-1";

const MainPage: React.FC<MainPage> = ({
  meta,
  fetchMeta,
  fetchTerritory,
  territory,
  setActiveStatementId,
  activeStatementId,
}) => {
  useEffect(() => {
    fetchMeta();
  }, [fetchMeta]);

  useEffect(() => {
    fetchTerritory(initTerritory);
  }, [fetchTerritory]);

  return (
    <>
      <Header
        paddingX={15}
        paddingY={15}
        left={<div className="text-4xl">InkVisitor</div>}
        right={
          <div className="inline">
            <div className="text-sm inline m-2">logged as admin</div>
            <Button label="log out" color="danger" />
          </div>
        }
      />
      <div className="flex mb-4">
        <Box height={750} width={200} label={"Territories"}>
          <Tree
            territory={territory}
            fetchTerritory={fetchTerritory}
            setActiveStatementId={setActiveStatementId}
          />
        </Box>
        <Box height={750} width={750} label={"Statements"}>
          <StatementsTable
            statements={territory.statements}
            actions={meta.actions}
            actants={territory.actants}
            activeStatementId={activeStatementId}
            setActiveStatementId={setActiveStatementId}
          />
        </Box>
        <Box height={750} width={670} label={"Editor"}>
          <StatementEditor
            statement={
              activeStatementId
                ? territory.statements.find(
                    (statement) => statement.id === activeStatementId
                  )
                : undefined
            }
            meta={meta}
            actants={territory.actants}
          />
        </Box>
        <div className="flex flex-col">
          <Box height={450} width={300} label={"Search"}></Box>
          <Box height={300} width={300} label={"Bookmarks"}></Box>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({
  meta,
  territory,
  activeStatementId,
}: StateFromProps): StateToProps => ({
  meta,
  territory,
  activeStatementId,
});

export default connect(mapStateToProps, {
  fetchMeta,
  fetchTerritory,
  setActiveStatementId,
})(MainPage);

interface StateFromProps {
  meta: ResponseMetaI;
  territory: ResponseTerritoryI;
  activeStatementId: string;
}

interface StateToProps {
  meta: ResponseMetaI;
  territory: ResponseTerritoryI;
  activeStatementId: string;
}
