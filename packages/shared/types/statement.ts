import { ActantI } from "./";

export interface StatementI extends ActantI {
  class: "S";
  data: {
    label: string;
    action: string;
    territory: string;
    references: { id: string; resource: string; part: string; type: string }[];
    tags: string[];
    certainty: string;
    elvl: string;
    modality: string;
    text: string;
    note: string;
    props: {
      id: string;
      origin: string;
      type: string;
      value: string;
      elvl: string;
      certainty: string;
    }[];
    actants: {
      id: string;
      actant: string;
      position: string;
      elvl: string;
      certainty: string;
    }[];
  };
  meta: {
    created: {
      user: string;
      time: string;
    };
    updated: {
      user: string;
      time: string;
      value: {};
    }[];
  };
}
