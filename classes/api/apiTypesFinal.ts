import { IGetSongObjectParsed } from "../database/databaseTypes";

export interface IPlaylist {
    elements: IGetSongObjectParsed[];
    limit: number;
    page: number;
    pages: number;
}
