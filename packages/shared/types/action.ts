import { LabelI } from "./";

// TODO
export interface ActionI {
    id: string;
    parent: false | string;
    note: string;
    labels: LabelI[];
    types: [];
    valencies: [];
    rulesActants: [];
    rulesProperties: [];
}
