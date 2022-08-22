import { IEntity, IResponseEntity } from ".";
import { EntityEnums, UserEnums } from "../enums";

export interface IResponseEntityTooltip extends IResponseEntity {
  // usedCount?: number;
  // usedIn?: IStatement[];
  right?: UserEnums.RoleMode;
  entities: { [key: string]: IEntity }; //  all entities mentioned in relations

  // C, A
  superclassTrees: IResponseEntityTooltipSuperclassTree[];
  // C
  synonymClouds: IResponseEntityTooltipSynonymCloud[];
  troponymClouds: IResponseEntityTooltipTroponymCloud[];
  superordinateLocationTrees: IResponseEntityTooltipSuperordinateLocationTree[];
  identifications: IResponseEntityTooltipIdentifications[];
}

// these are full of entity ids

// for C, A: Find all IRelationSuperclass relations, where the entity is at the 1st position and then repeat the same with the entity on the 2nd position, return the chain of entity ids
// for PLOGESTR: Find all  IRelationClassification relations, where the entity is at the 1st position, and take the C at the second position as the first element of the chain. Then repeat the procedure mentioned above for the C
// this is not a tree! branches are dividing and merging on both sides, it is more a graph
// e.g, O:icecream -> C:icecream -> C:sweet -> C:food -> C: everything,
// but also O:icecream -> C:icecrean -> C:cold thing -> C:everything,
// and also O:icecream -> C:grocery store products -> C:everyhing,
// in that case, I propose, the output will be {O:icecream: [C: icecream], C:icecream: [C:sweet, C:cold thing, C:grocery store product], C:sweet: ...}
export type IResponseEntityTooltipSuperclassTree = { [key: string]: string[] };

// This should work the same way as IResponseEntityTooltipSuperclassTree but only for L and relation of type SuperordinateLocation
export type IResponseEntityTooltipSuperordinateLocationTree = string[];

// only for C and A
// this is much simpler - its only about IRelationSynonym relation "clouds" where entityId is within `entityIds`
// e.g., for A:breakfasting - [A:eating, A:swallowing, A:consume, A:having dinner], [A:morning activity, A:waking up]
export type IResponseEntityTooltipSynonymCloud = string[];

// only for A
// I am not very much familiar what is this but this should work the same as IResponseEntityTooltipSynonymCloud
export type IResponseEntityTooltipTroponymCloud = string[];

// for all entity classes
// this is basicaly a list of all Identification relations found for this entity,
// returning everything, no matter what position is the entity, the entityId parameter in the model is the other entity id
export type IResponseEntityTooltipIdentifications = IResponseIdentification[];

export type IResponseIdentification = {
  entityId: string;
  logic: EntityEnums.Logic;
  certainty: EntityEnums.Certainty;
};
