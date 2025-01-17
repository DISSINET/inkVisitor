import Audit from "@models/audit/audit";
import { IDbModel } from "@models/common";
import Document from "@models/document/document";
import Entity from "@models/entity/entity";
import Relation from "@models/relation/relation";
import User from "@models/user/user";
import { DbEnums, EntityEnums } from "@shared/enums";
import { IEntity, IUser } from "@shared/types";
import { ModelNotValidError } from "@shared/types/errors";
import { Connection, RDatum, r as rethink, WriteResult } from "rethinkdb-ts";
import { Db } from "./rethink";

export async function getEntitiesDataByClass<T>(
  db: Connection,
  entityClass: EntityEnums.Class
): Promise<T[]> {
  const connection = db instanceof Db ? db.connection : db;
  return rethink
    .table(Entity.table)
    .getAll(entityClass, { index: DbEnums.Indexes.Class })
    .run(connection);
}

export async function findEntityById<T extends IEntity>(
  db: Db | Connection,
  id: string
): Promise<T> {
  const connection = db instanceof Db ? db.connection : db;
  const data = await rethink.table(Entity.table).get(id).run(connection);
  return data || null;
}

export async function getEntitiesByIds<T extends IEntity>(
  db: Connection,
  ids: string[]
): Promise<T[]> {
  return rethink
    .table(Entity.table)
    .getAll(...ids)
    .run(db);
}

export async function createEntity(db: Db, data: IDbModel): Promise<boolean> {
  if (!data.isValid()) {
    throw new ModelNotValidError("");
  }
  return data.save(db.connection);
}

export async function deleteEntities(db: Db): Promise<WriteResult> {
  return rethink.table(Entity.table).delete().run(db.connection);
}

export async function deleteAudits(db: Db): Promise<WriteResult> {
  return rethink.table(Audit.table).delete().run(db.connection);
}

export async function deleteRelations(db: Db): Promise<WriteResult> {
  return rethink.table(Relation.table).delete().run(db.connection);
}

export async function deleteUsers(db: Db): Promise<WriteResult> {
  return rethink
    .table(User.table)
    .filter(function (user: RDatum<IUser>) {
      return user("name").ne("admin");
    })
    .delete()
    .run(db.connection);
}

export async function deleteDocuments(db: Db): Promise<WriteResult> {
  return rethink.table(Document.table).delete().run(db.connection);
}
