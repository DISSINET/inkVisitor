import { IProp } from ".";
import { EntityClass, Language } from "../enums";

export interface IEntity {
  id: string;
  class: EntityClass;
  data: any;
  label: string;
  detail: string;
  language: Language;
  notes: string[];
  props: IProp[];
  references: IEntityReference[];
  isTemplate?: boolean;
  usedTemplate?: boolean;
  templateData?: object;
}

export interface IEntityReference {
  source: string;
  value: string;
}
