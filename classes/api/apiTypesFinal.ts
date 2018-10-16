import {
    IAddSongOptionsMore,
    IGetSongHbs,
} from "../database/databaseTypes2";

import {
    IGetAccount,
    IGetArtist,
} from "../database/internal/databaseInternalTypes";

import {
    IRequestFile,
} from "../server/serverTypes";

/**
 * Get types
 */

export interface IArtist extends IGetArtist {}

export interface IAccount extends IGetAccount {}

export interface ISongList {
    elements: IGetSongHbs[];
    limit: number;
    page: number;
    pages: number;
}

export interface IAddSongFileData extends IRequestFile {}

/**
 * Add types
 */

export interface IAddSongOptions extends IAddSongOptionsMore {}
