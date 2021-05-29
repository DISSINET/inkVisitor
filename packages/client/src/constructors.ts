import {
  IProp,
  IStatementActant,
  IActant,
  ITerritory,
  IStatement,
} from "@shared/types";
import { CategoryActantType, ActantType } from "@shared/enums";
import { v4 as uuidv4 } from "uuid";

export const CProp = (): IProp => ({
  id: uuidv4(),
  elvl: "1",
  certainty: "1",
  modality: "Y",
  origin: "",
  type: {
    id: "",
    certainty: "1",
    elvl: "1",
  },
  value: {
    id: "",
    certainty: "1",
    elvl: "1",
  },
});

export const CStatement = (territoryId: string): IStatement => ({
  id: uuidv4(),
  class: ActantType.Statement,
  label: "",
  data: {
    action: "",
    certainty: "1",
    elvl: "1",
    modality: "Y",
    text: "",
    note: "",
    territory: {
      id: territoryId,
      order: -1,
    },
    actants: [],
    props: [],
    references: [],
    tags: [],
  },
});

export const CMetaStatement = (subjectId: string): IStatement => ({
  id: uuidv4(),
  class: ActantType.Statement,
  label: "",
  data: {
    action: "A0093",
    certainty: "1",
    elvl: "1",
    modality: "Y",
    text: "",
    note: "",
    territory: {
      id: "T0",
      order: -1,
    },
    actants: [
      {
        id: uuidv4(),
        actant: subjectId,
        position: "s",
        elvl: "1",
        certainty: "1",
      },
      {
        id: uuidv4(),
        actant: "",
        position: "a1",
        elvl: "1",
        certainty: "1",
      },
      {
        id: uuidv4(),
        actant: "",
        position: "a2",
        elvl: "1",
        certainty: "1",
      },
    ],
    props: [],
    references: [],
    tags: [],
  },
});

// duplicate statement
export const DStatement = (statement: IStatement): IStatement => {
  const duplicatedStatement = { ...statement };
  duplicatedStatement.id = uuidv4();
  duplicatedStatement.data.actants.map((a) => (a.id = uuidv4()));
  duplicatedStatement.data.props.map((p) => (p.id = uuidv4()));
  duplicatedStatement.data.references.map((r) => (r.id = uuidv4()));
  duplicatedStatement.data.territory.order += 0.00001;

  return duplicatedStatement;
};

export const CStatementActant = (): IStatementActant => ({
  id: uuidv4(),
  actant: "",
  position: "s",
  elvl: "1",
  certainty: "1",
});

export const CTerritoryActant = (
  label: string,
  parentId: string,
  parentOrder: number
): ITerritory => ({
  id: uuidv4(),
  class: ActantType.Territory,
  label: label,
  data: {
    parent: { id: parentId, order: parentOrder },
    type: "1",
    content: "",
    lang: "1",
  },
});

export const CActant = (
  category: CategoryActantType,
  label: string
): IActant => ({
  id: uuidv4(),
  class: category,
  label: label,
  data: {},
});
