/**
 * type of the /users endpoint response
 */

import { IResponseActant } from "./";
import { userRoleDict } from "./../dictionaries";

const userRoleValues = userRoleDict.map((i) => i.value);

export interface IResponseUser {
    id: string;
    email: string;
    name: string;
    role: typeof userRoleValues[number];
    bookmarks: BookmarkFolderI[];
    storedTerritories: StoredTerritoryI[];
}

export interface UserOptions {
    defaultTerritory: string;
    defaultLanguage: string;
    searchLanguages: string[];
}

interface StoredTerritoryI {
    id: string;
    order: number;
    territory: IResponseActant;
}

interface BookmarkFolderI {
    id: string;
    name: string;
    order: number;
    actants: BookmarkActantI[];
}

interface BookmarkActantI {
    id: string;
    order: number;
    actant: IResponseActant;
}
