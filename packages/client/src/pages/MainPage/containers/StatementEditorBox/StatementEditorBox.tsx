import React, { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "api";
const queryString = require("query-string");

import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";

import { useLocation, useHistory } from "react-router";

import {
  ActantTag,
  ActionDropdown,
  CertaintyToggle,
  ModalityToggle,
  ElvlToggle,
} from "./../";

import { CProp, CStatementActant } from "constructors";

import { actantPositionDict } from "./../../../../../../shared/dictionaries";
import { IActant, IProp, IStatementActant } from "@shared/types";
import { Button, ButtonGroup, Input } from "components";
import { ActantSuggester } from "./../";

const classEntities = ["P", "G", "O", "C", "L", "V", "E"];

export const StatementEditorBox: React.FC = () => {
  let history = useHistory();
  let location = useLocation();
  var hashParams = queryString.parse(location.hash);

  const territoryId = hashParams.territory;
  const statementId = hashParams.statement;

  const queryClient = useQueryClient();

  // Statement query
  const {
    status: statusStatement,
    data: statement,
    error: errorStatement,
    isFetching: isFetchingStatement,
  } = useQuery(
    ["statement", statementId],
    async () => {
      const res = await api.statementGet(statementId);
      return res.data;
    },
    { enabled: !!statementId }
  );

  // getting origin actants of properties
  const propsByOrigins = useMemo(() => {
    if (statement) {
      console.log(
        "getting new props",
        statement.data.actants,
        statement.actants
      );
      const allProps = statement?.data.props;
      const statementItself = { ...statement };

      const statementActants = statement.actants.filter((sa) =>
        statement.data.actants.map((a) => a.actant).includes(sa.id)
      );

      const allPossibleOrigins = [statementItself, ...statementActants];

      const originProps: { origin: any; props: any[]; actant: IActant }[] = [];

      allPossibleOrigins.forEach((origin) => {
        originProps.push({ origin: origin.id, props: [], actant: origin });
      });

      // 1st level
      allProps.forEach((prop) => {
        const originProp = originProps.find((op) => op.origin === prop.origin);
        if (originProp) {
          originProp.props.push({ ...prop, ...{ props: [] } });
        }
      });

      // 2nd level
      allProps.forEach((prop) => {
        originProps.forEach((op) => {
          op.props.forEach((op2) => {
            if (op2.id === prop.origin) {
              op2.props.push(prop);
            }
          });
        });
      });

      //console.log(originProps);

      return originProps;
    } else {
      return [];
    }
  }, [JSON.stringify(statement)]);

  const addActant = (newStatementActantId: string) => {
    if (statement) {
      const newStatementActant = CStatementActant();
      newStatementActant.actant = newStatementActantId;
      const newData = { ...statement.data };
      newData.actants.push(newStatementActant);
      update(newData);
    }
  };
  const updateActant = (statementActantId: string, changes: any) => {
    if (statement && statementActantId) {
      const updatedActants = statement.data.actants.map((a) =>
        a.id === statementActantId ? { ...a, ...changes } : a
      );
      const newData = { ...statement.data, ...{ actants: updatedActants } };
      update(newData);
    }
  };

  const updateProp = (propId: string, changes: any) => {
    if (statement && propId) {
      const updatedProps = statement.data.props.map((p) =>
        p.id === propId ? { ...p, ...changes } : p
      );
      const newData = { ...statement.data, ...{ props: updatedProps } };
      update(newData);
    }
  };

  const addProp = (originId: string) => {
    if (statement && originId) {
      const newProp = CProp();
      newProp.origin = originId;
      const newData = { ...statement.data };
      newData.props.push(newProp);
      update(newData);
    }
  };

  const update = async (changes: object) => {
    const res = await api.actantsUpdate(statementId, {
      data: changes,
    });
    queryClient.invalidateQueries(["statement"]);
  };

  return (
    <div>
      {statement ? (
        <div style={{ marginBottom: "4rem" }}>
          <div key={statement.id}>
            <div key="editor-section-summary" className="editor-section">
              <div className="editor-section-header">Summary</div>
              <div className="editor-section-content">
                <div className="table-row">
                  <div className="label">Action</div>
                  <div className="value">
                    <ActionDropdown
                      onSelectedChange={(newActionValue: {
                        value: string;
                        label: string;
                      }) => {
                        const newData = {
                          ...statement.data,
                          ...{ action: newActionValue.value },
                        };
                        update(newData);
                      }}
                      value={statement.data.action}
                    />
                  </div>
                </div>
                <div className="table-row">
                  <div className="label">Text</div>
                  <div className="value">
                    <Input
                      type="textarea"
                      cols={55}
                      onChangeFn={(newValue: string) => {
                        const newData = {
                          ...statement.data,
                          ...{ text: newValue },
                        };
                        update(newData);
                      }}
                      value={statement.data.text}
                    />
                  </div>
                </div>
                <div className="table-row">
                  <ModalityToggle
                    value={statement.data.modality}
                    onChangeFn={(newValue: string) => {
                      const newData = {
                        ...statement.data,
                        ...{ modality: newValue },
                      };
                      update(newData);
                    }}
                  />
                  <ElvlToggle
                    value={statement.data.elvl}
                    onChangeFn={(newValue: string) => {
                      const newData = {
                        ...statement.data,
                        ...{ elvl: newValue },
                      };
                      update(newData);
                    }}
                  />
                  <CertaintyToggle
                    value={statement.data.certainty}
                    onChangeFn={(newValue: string) => {
                      const newData = {
                        ...statement.data,
                        ...{ certainty: newValue },
                      };
                      update(newData);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Actants */}
            <div key="editor-section-actants" className="editor-section">
              <div className="editor-section-header">Actants</div>
              <div className="editor-section-content">
                <table className="">
                  <thead>
                    <tr>
                      <th key="actants"></th>
                      <th key="position"></th>
                      <th key="certainty"></th>
                      <th key="actions"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {statement.data.actants.map((sActant, sai) => {
                      const actant = statement.actants.find(
                        (a) => a.id === sActant.actant
                      );
                      if (actant) {
                        return (
                          <tr key={sai}>
                            <td>
                              <ActantTag
                                key={sai}
                                actant={actant}
                                short={false}
                              />
                            </td>
                            <td>
                              <Input
                                type="select"
                                value={sActant.position}
                                options={actantPositionDict}
                                onChangeFn={(newPosition: any) => {
                                  updateActant(sActant.id, {
                                    position: newPosition,
                                  });
                                }}
                              ></Input>
                            </td>
                            <td>
                              <ModalityToggle
                                value={sActant.modality}
                                onChangeFn={(newValue: string) => {
                                  updateActant(sActant.id, {
                                    modality: newValue,
                                  });
                                }}
                              />
                              <ElvlToggle
                                value={sActant.elvl}
                                onChangeFn={(newValue: string) => {
                                  updateActant(sActant.id, {
                                    elvl: newValue,
                                  });
                                }}
                              />
                              <CertaintyToggle
                                value={sActant.certainty}
                                onChangeFn={(newValue: string) => {
                                  updateActant(sActant.id, {
                                    certainty: newValue,
                                  });
                                }}
                              />
                            </td>
                            <td>
                              <Button
                                key="d"
                                icon={<FaTrashAlt />}
                                color="danger"
                                onClick={() => {}}
                              />
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
                <ActantSuggester
                  onSelected={(newSelectedId: string) => {
                    addActant(newSelectedId);
                  }}
                  categoryIds={classEntities}
                ></ActantSuggester>
              </div>
            </div>

            {/* Props */}
            <div key="editor-section-props" className="editor-section">
              <div className="editor-section-header">Properties (has)</div>
              <div
                className="editor-section-content"
                key={JSON.stringify(statement.data)}
              >
                {propsByOrigins.map((propOrigin, sai) => {
                  const originActant = propOrigin.actant;
                  //console.log(propOrigin, originActant);

                  if (originActant) {
                    const renderPropRow = (prop: IProp, level: "1" | "2") => {
                      const propTypeActant = statement.actants.find(
                        (a) => a.id === prop.type.id
                      );
                      const propValueActant = statement.actants.find(
                        (a) => a.id === prop.value.id
                      );

                      return (
                        <div
                          key={prop.id}
                          style={{
                            paddingBottom: "0.2em",
                            paddingLeft: level === "1" ? "1em" : "2em",
                          }}
                        >
                          <div style={{ display: "table-cell" }}>
                            {propTypeActant ? (
                              <ActantTag
                                key={sai}
                                actant={propTypeActant}
                                short={false}
                                button={
                                  <Button
                                    key="d"
                                    icon={<FaTrashAlt />}
                                    color="danger"
                                    onClick={() => {
                                      updateProp(prop.id, {
                                        type: {
                                          ...prop.type,
                                          ...{ id: "" },
                                        },
                                      });
                                    }}
                                  />
                                }
                              />
                            ) : (
                              <ActantSuggester
                                onSelected={(newSelectedId: string) => {
                                  updateProp(prop.id, {
                                    type: {
                                      ...prop.type,
                                      ...{ id: newSelectedId },
                                    },
                                  });
                                }}
                                categoryIds={classEntities}
                              ></ActantSuggester>
                            )}
                            <ElvlToggle
                              value={prop.type.elvl}
                              onChangeFn={(newValue: string) => {
                                updateProp(prop.id, {
                                  type: { ...prop.type, ...{ elvl: newValue } },
                                });
                              }}
                            />
                            <CertaintyToggle
                              value={prop.type.certainty}
                              onChangeFn={(newValue: string) => {
                                updateProp(prop.id, {
                                  type: {
                                    ...prop.type,
                                    ...{ certainty: newValue },
                                  },
                                });
                              }}
                            />
                          </div>
                          <div style={{ display: "table-cell" }}>
                            {propValueActant ? (
                              <ActantTag
                                key={sai}
                                actant={propValueActant}
                                short={false}
                                button={
                                  <Button
                                    key="d"
                                    icon={<FaTrashAlt />}
                                    color="danger"
                                    onClick={() => {
                                      updateProp(prop.id, {
                                        value: {
                                          ...prop.value,
                                          ...{ id: "" },
                                        },
                                      });
                                    }}
                                  />
                                }
                              />
                            ) : (
                              <ActantSuggester
                                onSelected={(newSelectedId: string) => {
                                  updateProp(prop.id, {
                                    value: {
                                      ...prop.type,
                                      ...{ id: newSelectedId },
                                    },
                                  });
                                }}
                                categoryIds={classEntities}
                              ></ActantSuggester>
                            )}
                            <ElvlToggle
                              value={prop.value.elvl}
                              onChangeFn={(newValue: string) => {
                                updateProp(prop.id, {
                                  value: {
                                    ...prop.value,
                                    ...{ elvl: newValue },
                                  },
                                });
                              }}
                            />
                            <CertaintyToggle
                              value={prop.value.certainty}
                              onChangeFn={(newValue: string) => {
                                updateProp(prop.id, {
                                  value: {
                                    ...prop.value,
                                    ...{ certainty: newValue },
                                  },
                                });
                              }}
                            />
                          </div>
                          <div style={{ display: "table-cell" }}>
                            <ModalityToggle
                              value={prop.modality}
                              onChangeFn={(newValue: string) => {
                                updateProp(prop.id, {
                                  modality: newValue,
                                });
                              }}
                            />
                            <ElvlToggle
                              value={prop.elvl}
                              onChangeFn={(newValue: string) => {
                                updateProp(prop.id, {
                                  elvl: newValue,
                                });
                              }}
                            />
                            <CertaintyToggle
                              value={prop.certainty}
                              onChangeFn={(newValue: string) => {
                                updateProp(prop.id, {
                                  certainty: newValue,
                                });
                              }}
                            />
                          </div>
                          <div style={{ display: "table-cell" }}>
                            {level === "1" && (
                              <Button
                                key="d"
                                icon={<FaPlusCircle />}
                                color="primary"
                                onClick={() => {
                                  addProp(prop.id);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    };

                    return (
                      <div key={originActant.id}>
                        <div
                          style={{
                            display: "inline-flex",
                            paddingTop: "0.2em",
                          }}
                        >
                          <ActantTag
                            key={sai}
                            actant={originActant}
                            short={false}
                          />
                          <Button
                            key="d"
                            icon={<FaPlusCircle />}
                            color="primary"
                            onClick={() => {
                              addProp(originActant.id);
                            }}
                          />
                        </div>

                        {propOrigin.props.map((prop1, pi1) => {
                          return (
                            <div>
                              {renderPropRow(prop1, "1")}
                              {prop1.props.map((prop2: any, pi2: number) => {
                                return renderPropRow(prop2, "2");
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                })}
              </div>
            </div>

            {/* Refs */}
            <div key="editor-section-refs" className="editor-section">
              <div className="editor-section-header">References</div>
              <div className="editor-section-content"></div>
            </div>

            {/* Tags */}
            <div key="editor-section-tags" className="editor-section">
              <div className="editor-section-header">Tags</div>
              <div className="editor-section-content"></div>
            </div>

            {/* Notes */}
            <div key="editor-section-notes" className="editor-section">
              <div className="editor-section-header">Notes</div>
              <div className="editor-section-content"></div>
            </div>
          </div>
        </div>
      ) : (
        "no statement selected"
      )}
    </div>
  );
};
