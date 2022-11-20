import Entity from "@models/entity/entity";
import { EntityEnums, RelationEnums } from "@shared/enums";
import { EntityTooltip, Relation as RelationTypes } from "@shared/types";
import { Connection } from "rethinkdb-ts";
import Relation from "./relation";

const MAX_NEST_LVL = 3;

/**
 * recursively search for action event trees
 * @param conn
 */
export const getActionEventNodes = async (
    conn: Connection,
    parentId: string,
    asClass: EntityEnums.Class,
    nestLvl: number = 0,
): Promise<EntityTooltip.ISuperclassTree> => {
    const out: EntityTooltip.ISuperclassTree = {
        entityId: parentId,
        subtrees: [],
    };

    if (asClass === EntityEnums.Class.Action) {
        const relations: RelationTypes.IActionEventEquivalent[] = await Relation.getForEntity(conn, parentId, RelationEnums.Type.ActionEventEquivalent, 0);

        // make unique and sorted list of ids
        const subrootIds = [
            ...new Set(relations.map((r) => r.entityIds[1])),
        ].sort();

        for (const subparentId of subrootIds) {
            out.subtrees.push(
                await getSuperclassTrees(
                    conn,
                    subparentId,
                    EntityEnums.Class.Concept,
                    nestLvl + 1,
                )
            );
        }
    }

    return out;
};

/**
 * recursively search for superclass relations
 * @param conn
 */
export const getSuperclassTrees = async (
    conn: Connection,
    parentId: string,
    asClass: EntityEnums.Class,
    nestLvl: number = 0,
): Promise<EntityTooltip.ISuperclassTree> => {
    const out: EntityTooltip.ISuperclassTree = {
        entityId: parentId,
        subtrees: [],
    };

    if (nestLvl > MAX_NEST_LVL) {
        return out;
    }

    let relations: RelationTypes.IRelation[] = [];

    if ([EntityEnums.Class.Concept, EntityEnums.Class.Action].indexOf(asClass) !== -1) {
        relations = await Relation.getForEntity(conn, parentId, RelationEnums.Type.Superclass, 0);
    } else if (EntityEnums.PLOGESTR.indexOf(asClass) !== -1) {
        relations = await Relation.getForEntity(conn, parentId, RelationEnums.Type.Classification, 0);
    }

    // make unique and sorted list of ids
    const subrootIds = [
        ...new Set(relations.map((r) => r.entityIds[1])),
    ].sort();

    for (const subparentId of subrootIds) {
        out.subtrees.push(
            await getSuperclassTrees(
                conn,
                subparentId,
                EntityEnums.Class.Concept,
                nestLvl + 1,
            )
        );
    }

    return out;
};

/**
* returns synonym cloud in the form of list containing grouped entity ids
* @param conn
* @returns
*/
export const getSynonymCloud = async (
    conn: Connection,
    asClass: EntityEnums.Class,
    entityId: string
): Promise<EntityTooltip.ISynonymCloud | undefined> => {
    let out: EntityTooltip.ISynonymCloud | undefined;

    if (asClass === EntityEnums.Class.Concept || asClass === EntityEnums.Class.Action) {
        const synonyms = await Relation.getForEntity<RelationTypes.ISynonym>(conn, entityId, RelationEnums.Type.Synonym);

        out = synonyms.reduce(
            (acc, cur) => acc.concat(cur.entityIds),
            [] as string[]
        );
    }

    return out;
};

/**
 * returns synonym cloud in the form of list containing grouped entity ids
 * @param conn
 * @returns
 */
export const getIdentifications = async (
    conn: Connection,
    entityId: string
): Promise<EntityTooltip.IIdentification[]> => {
    const out: EntityTooltip.IIdentification[] = [];

    const identifications = await Relation.getForEntity<RelationTypes.IIdentification>(conn, entityId, RelationEnums.Type.Identification);

    for (const relation of identifications) {
        out.push({
            certainty: relation.certainty,
            entityId:
                relation.entityIds[0] === entityId
                    ? relation.entityIds[1]
                    : relation.entityIds[0],
        });
    }

    return out;
};

/**
* recursively search for superordinate location relations
* @param conn
*/
export const getSuperordinateLocationTree = async (
    conn: Connection,
    asClass: EntityEnums.Class,
    parentId: string
): Promise<EntityTooltip.ISuperordinateLocationTree> => {
    const out: EntityTooltip.ISuperordinateLocationTree = {
        entityId: parentId,
        subtrees: [],
    };

    if (asClass === EntityEnums.Class.Location) {
        const locations: RelationTypes.ISuperordinateLocation[] =
            await Relation.getForEntity(conn, parentId, RelationEnums.Type.SuperordinateLocation, 0);

        // make unique and sorted list of ids
        const subrootIds = [
            ...new Set(locations.map((r) => r.entityIds[1])),
        ].sort();

        for (const subparentId of subrootIds) {
            out.subtrees.push(
                await getSuperordinateLocationTree(conn, asClass, subparentId)
            );
        }
    }

    return out;
};

export const getEntityIdsFromTree = (tree: EntityTooltip.ISuperordinateLocationTree): string[] => {
    let out: string[] = [tree.entityId];

    for (const subtree of tree.subtrees) {
        out.push(...getEntityIdsFromTree(subtree));
    }

    return out;
};

export const getSuperclassForwardConnections = async (
    conn: Connection,
    parentId: string,
    asClass: EntityEnums.Class,
    nestLvl: number = 0,
): Promise<RelationTypes.IConnection<RelationTypes.ISuperclass>[]> => {
    const out: RelationTypes.IConnection<RelationTypes.ISuperclass>[] = [];

    if (nestLvl > MAX_NEST_LVL) {
        return out;
    }

    let relations: RelationTypes.IRelation[] = [];

    if ([EntityEnums.Class.Concept, EntityEnums.Class.Action].indexOf(asClass) !== -1) {
        relations = await Relation.getForEntity(conn, parentId, RelationEnums.Type.Superclass, 0);
    } else if (EntityEnums.PLOGESTR.indexOf(asClass) !== -1) {
        relations = await Relation.getForEntity(conn, parentId, RelationEnums.Type.Classification, 0);
    }

    // sort by order
    relations.sort((a, b) => (a.order === undefined ? EntityEnums.Order.Last : a.order) - (b.order === undefined ? EntityEnums.Order.Last : b.order));

    for (const relation of relations) {
        const subparentId = relation.entityIds[1];
        const connection: RelationTypes.IConnection<RelationTypes.ISuperclass> = {
            ...relation as RelationTypes.ISuperclass,
            subtrees: [],
        };

        connection.subtrees = await getSuperclassForwardConnections(conn, subparentId, EntityEnums.Class.Concept, nestLvl + 1);
    }

    return out;
};

export const getSuperclassInverseConnections = async (
    conn: Connection,
    parentId: string,
): Promise<RelationTypes.ISuperclass[]> => {
    const out: RelationTypes.ISuperclass[] = await Relation.getForEntity(conn, parentId, RelationEnums.Type.Superclass, 1);

    // sort by order
    out.sort((a, b) => (a.order === undefined ? EntityEnums.Order.Last : a.order) - (b.order === undefined ? EntityEnums.Order.Last : b.order));

    return out;
};

export const getSuperordinateLocationForwardConnections = async (
    conn: Connection,
    parentId: string,
    asClass: EntityEnums.Class,
    nestLvl: number = 0): Promise<RelationTypes.IConnection<RelationTypes.ISuperordinateLocation>[]> => {
    const out: RelationTypes.IConnection<RelationTypes.ISuperordinateLocation>[] = [];

    if (nestLvl > MAX_NEST_LVL) {
        return out;
    }

    if (asClass === EntityEnums.Class.Location) {
        const relations: RelationTypes.ISuperordinateLocation[] =
            await Relation.getForEntity(conn, parentId, RelationEnums.Type.SuperordinateLocation, 0);

        // sort by order
        relations.sort((a, b) => (a.order === undefined ? EntityEnums.Order.Last : a.order) - (b.order === undefined ? EntityEnums.Order.Last : b.order));

        for (const relation of relations) {
            const subparentId = relation.entityIds[1];
            const connection: RelationTypes.IConnection<RelationTypes.ISuperordinateLocation> = {
                ...relation,
                subtrees: [],
            };

            connection.subtrees = await getSuperordinateLocationForwardConnections(conn, subparentId, EntityEnums.Class.Concept, nestLvl + 1);
        }
    }

    return out;
};

export const getSuperordinateLocationInverseConnections = async (
    conn: Connection,
    parentId: string,
): Promise<RelationTypes.ISuperordinateLocation[]> => {
    const out: RelationTypes.ISuperordinateLocation[] = await Relation.getForEntity(conn, parentId, RelationEnums.Type.SuperordinateLocation, 1);

    // sort by order
    out.sort((a, b) => (a.order === undefined ? EntityEnums.Order.Last : a.order) - (b.order === undefined ? EntityEnums.Order.Last : b.order));

    return out;
};

export const getSynonymForwardConnections = async (
    conn: Connection,
    entityId: string,
    asClass: EntityEnums.Class,
): Promise<RelationTypes.IConnection<RelationTypes.ISynonym>[]> => {
    let out: RelationTypes.IConnection<RelationTypes.ISynonym>[] = [];

    if (asClass === EntityEnums.Class.Concept || asClass === EntityEnums.Class.Action) {
        out = await Relation.getForEntity<RelationTypes.ISynonym>(conn, entityId, RelationEnums.Type.Synonym);
    }

    return out;
};

export const getAntonymForwardConnections = async (
    conn: Connection,
    entityId: string,
    asClass: EntityEnums.Class,
): Promise<RelationTypes.IConnection<RelationTypes.IAntonym>[]> => {
    let out: RelationTypes.IConnection<RelationTypes.IAntonym>[] = [];

    if (asClass === EntityEnums.Class.Action || asClass === EntityEnums.Class.Concept) {
        out = await Relation.getForEntity<RelationTypes.IAntonym>(conn, entityId, RelationEnums.Type.Antonym);
    }

    return out;
};

export const getHolonymForwardConnections = async (
    conn: Connection,
    entityId: string,
    asClass: EntityEnums.Class,
): Promise<RelationTypes.IConnection<RelationTypes.IHolonym>[]> => {
    let out: RelationTypes.IConnection<RelationTypes.IHolonym>[] = [];

    if (asClass === EntityEnums.Class.Concept) {
        out = await Relation.getForEntity<RelationTypes.IHolonym>(conn, entityId, RelationEnums.Type.Holonym);
    }

    return out;
};

export const getPropertyReciprocalForwardConnections = async (
    conn: Connection,
    entityId: string,
    asClass: EntityEnums.Class,
): Promise<RelationTypes.IConnection<RelationTypes.IPropertyReciprocal>[]> => {
    let out: RelationTypes.IConnection<RelationTypes.IPropertyReciprocal>[] = [];

    if (asClass === EntityEnums.Class.Concept) {
        out = await Relation.getForEntity<RelationTypes.IPropertyReciprocal>(conn, entityId, RelationEnums.Type.PropertyReciprocal);
    }

    return out;
};

export const getSubjectActant1ReciprocalForwardConnections = async (
    conn: Connection,
    entityId: string,
    asClass: EntityEnums.Class,
): Promise<RelationTypes.IConnection<RelationTypes.ISubjectActant1Reciprocal>[]> => {
    let out: RelationTypes.IConnection<RelationTypes.ISubjectActant1Reciprocal>[] = [];

    if (asClass === EntityEnums.Class.Action) {
        out = await Relation.getForEntity<RelationTypes.ISubjectActant1Reciprocal>(conn, entityId, RelationEnums.Type.SubjectActant1Reciprocal);
    }

    return out;
};
