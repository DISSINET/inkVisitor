import { Db } from "./service/RethinkDB";
import Acl from "./middlewares/acl";
import { IUser } from "../../shared/types";

declare global {
  namespace Express {
    export interface Request {
      db: Db;
      acl: Acl;
      user?: {
        user: IUser;
      };
      getUserOrFail(): IUser;
    }
  }
}
