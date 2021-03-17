import { rethinkConfig } from "@service/RethinkDB";
import { Response, Request, NextFunction } from "express";
import { r } from "rethinkdb-ts";
import { createConnection, closeConnection } from "../service/RethinkDB";
//-----------------------------------------------------------------------------
//  Repository function generator
//-----------------------------------------------------------------------------
export const getOneActant = async (
  id: string,
  category: string | null = null
): Promise<any> => {
  const conn = await r.connect(rethinkConfig);
  const predicate = category != null ? { class: category, id: id } : { id: id };
  return await r.table("actants").filter(predicate).run(conn);
};

//---------------------------------------------------- -------------------------
// Controller functions
//-----------------------------------------------------------------------------

/**
 * Get the HTTP status code and JSON result.
 */
export const Result = (
  response: Response,
  code: number,
  message: string | any | any[] //IEntity | IEntity[] | string
) => {
  return response.status(code).json(message);
};

/**
 * Wrapper around each api route - handles explicitly thrown errors which could not be handled
 * by out express err handler(see server.ts).
 *
 * Handles db connection init & closing. In case of an unexpected error, the latter procedure is not reliable.
 * Thats why we are handling db connection here and not in the middlewares.
 * @param fn - the function handler for each route
 */
export function asyncRouteHandler<T = unknown>(
  fn: (req: Request) => Promise<T>
): (req: Request, res: Response, next: NextFunction) => void {
  return async (req: Request, res: Response, next: NextFunction) => {
    await createConnection(req, res, () => null);

    try {
      const returnedData = await fn(req);
      res.json(returnedData);
    } catch (err) {
      next(err);
    }

    closeConnection(req, res, () => null);
  };
}

export const supertestConfig = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImJvb2ttYXJrcyI6bnVsbCwiZW1haWwiOiJhZG1pbjAuOTU3Mzc0NzMxNzQ2Nzg2OUBhZG1pbi5jb20iLCJpZCI6IjEiLCJuYW1lIjoiYWRtaW4iLCJvcHRpb25zIjp7ImRlZmF1bHRMYW5ndWFnZSI6IiIsImRlZmF1bHRUZXJyaXRvcnkiOiIiLCJzZWFyY2hMYW5ndWFnZXMiOltdfSwicGFzc3dvcmQiOiIkMmIkMTAkSGZBLmpLaHRGcDYvVjNGNFNDR0c3dUdkSUU3QmhDbjh5anpRNHhlNDYudFpBSTlmMHYyT3kiLCJ0ZXN0IjoiIn0sImV4cCI6MTkyOTU0NDQ0NiwiaWF0IjoxNjE0MTg0NDQ2fQ.CE4nBDjsTKxaRsrcEuJUwGr_MmLOmex08LDr4-EeFyM",
};
