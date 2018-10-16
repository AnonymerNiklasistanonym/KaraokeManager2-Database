import {
    IPostRequestResult,
} from "./databaseQueriesTypes";
import {
    IAddSongOptions,
    IGetSongFinal,
} from "./internal/databaseInternalTypes";

export interface IAddSongOptionsMore {
    options?: IAddSongOptions;
    tags?: {
        songContentLanguages?: number[];
        songContentTypes?: number[];
        songLinks?: number[];
    };
}

export interface IGetSong extends IGetSongFinal {}

export interface IGetSongHbs extends IGetSongFinal {
    isAudio?: boolean;
    isUnknown?: boolean;
    isVideo?: boolean;
}

export interface IAddSongResult {
    songContentLanguageResults?: IPostRequestResult[];
    songContentTypeResults?: IPostRequestResult[];
    songLinkResults?: IPostRequestResult[];
    songResult: IPostRequestResult;
}

/*
 * Json file data interfaces >> Default values
 */

export interface IJsonDataDefaultValues {
    accounts: IJsonFileDataAccount[];
    song_content_languages: IJsonFileDataSongContentLanguage[];
    song_content_types: IJsonFileDataSongContentType[];
    // tslint:disable-next-line:member-ordering
    artists: IJsonFileDataArtist[];
    songs: IJsonFileDataSong[];
}

export interface IJsonFileDataAccount {
    id: string;
    options?: {
        isAdmin?: boolean;
        isPrivate?: boolean;
        name?: string;
        server_file_path_bg_picture?: string;
        server_file_path_profile_picture?: string;
        status?: string;
    };
    password: string;
}

export interface IJsonFileDataSongContentLanguage {
    name: string;
    options?: {
        description?: string;
    };
}

export interface IJsonFileDataSongContentType {
    name: string;
    options?: {
        description?: string;
    };
}

export interface IJsonFileDataArtistLink {
    options?: {
        description?: string;
    };
    url: string;
}

export interface IJsonFileDataArtist {
    name: string;
    options?: {
        description?: string;
        links?: IJsonFileDataArtistLink[];
    };
}

export interface IJsonFileDataSongLink {
    options?: {
        description?: string;
    };
    url: string;
}

export interface IJsonFileDataSong {
    name: string;
    options?: {
        description?: string;
        links?: IJsonFileDataSongLink[];
    };
    server_file_path: string;
}

/*
 * Json file data interfaces >> Tables
 */

export interface IKey {
    default?: (number | boolean | string | "now");
    description?: string;
    name: string;
    options?: IKeyOptions;
    reference?: IKeyReference;
    type: KeyType;
}

export type KeyType = "integer" | "text" | "boolean" | "date";

export interface IKeyReference {
    property: string;
    table: string;
}

export interface IKeyOptions {
    autoincrement?: boolean;
    notNull?: boolean;
    primary?: boolean;
    unique?: boolean;
}

export interface IJsonDataTable {
    description?: string;
    name: string;
    not_null_keys: IKey[];
    null_keys: IKey[];
    primary_key: IKey;
}
