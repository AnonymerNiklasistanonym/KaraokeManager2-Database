import {
    IGetAccountObject,
    IGetArtistObject,
    IGetSongObjectDatabase,
} from "../database/databaseTypes";

export interface IAccount extends IGetAccountObject {}

export interface IArtist extends IGetArtistObject {}

export interface ISongList {
    elements: IGetSongObjectDatabase[];
    limit: number;
    page: number;
    pages: number;
}
