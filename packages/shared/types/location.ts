import { IEntity } from ".";
import { EntityEnums } from "../enums";

export interface ILocation extends IEntity {
  class: EntityEnums.Class.Location;
  data: {
    logicalType: EntityEnums.LogicalType;
  };
}
