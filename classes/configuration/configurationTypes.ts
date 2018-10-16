import {
    IGetSongHbs,
} from "../database/databaseTypes2";

export interface IPlaylistElements extends IGetSongHbs {}

export interface IPlaylistElementsParsed {
    firstLine: string;
    isAudio: boolean;
    isUnknown: boolean;
    isVideo: boolean;
    secondLine: string;
    title: string;
    url: string;
  }
