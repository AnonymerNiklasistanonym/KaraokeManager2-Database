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

export interface IParsedKey {
    query: string;
    reference: string;
}

export interface IJsonDataTableObject {
    description?: string;
    name: string;
    not_null_keys: IKey[];
    null_keys: IKey[];
    primary_key: IKey;
}

export type TableOption = "createIfNotAlreadyExisting" | "createEvenIfAlreadyExisting";

export interface IJsonDataTableObject {
    description?: string;
    name: string;
    not_null_keys: IKey[];
    null_keys: IKey[];
    primary_key: IKey;
}

export interface IJsonDataTables extends Array<IJsonDataTableObject> {}

export interface ITable {
    description?: string;
    name: string;
    not_null_keys: IKey[];
    null_keys: IKey[];
    primary_key: IKey;
}

export interface ICreateAccountOptions {
    isAdmin?: boolean;
    isPrivate?: boolean;
    name?: string;
    server_file_path_bg_picture?: string;
    server_file_path_profile_picture?: string;
    status?: string;
}

export interface IJsonDataTableDataAccount {
    id: string;
    options?: ICreateAccountOptions;
    password: string;
}

export interface ICreateArtistOptions {
    description?: string;
    link_spotify?: string;
    link_youtube?: string;
    server_file_path_artist_picture?: string;
}
export interface IJsonDataTableDataArtist {
    author: string;
    name: string;
    options?: ICreateArtistOptions;
}

export interface ICreateSongOptions {
    description?: string;
    link_spotify?: string;
    link_youtube?: string;
    local_file_path?: string;
    lyrics?: string;
    release_date?: number;
    song_content_language?: string;
    song_content_type?: string;
}

export interface IJsonDataTableDataSong {
    author: string;
    name: string;
    options?: ICreateSongOptions;
    server_file_path: string;
}

export interface IJsonDataTableDefaultValues {
    accounts: IJsonDataTableDataAccount[];
    artists: IJsonDataTableDataArtist[];
    songs: IJsonDataTableDataSong[];
}

export interface IGetAccountObject {
    id: string;
    is_admin: boolean;
    is_banned: boolean;
    is_banned_comments: boolean;
    is_banned_entries: boolean;
    is_private: boolean;
    name: string;
    server_file_path_profile_picture: boolean;
    status: string;
}

export interface IGetAccountObjectNavBar {
    id: string;
    is_admin: boolean;
    is_private: boolean;
    name: string;
    server_file_path_bg_picture: string;
    server_file_path_profile_picture: string;
}

export interface IGetArtistObject {
    author: string;
    date: number;
    description: string;
    id: number;
    link_spotify?: string;
    link_youtube?: string;
    name: string;
    server_file_path_artist_picture: string;
}

export interface IGetAccountCredentialsObject {
    password_hash: string;
    password_salt: string;
}

export interface IGetSongObject {
    author: string;
    date: number;
    description: string;
    id: number;
    link_spotify: string;
    link_youtube: string;
    local_file_path: string;
    lyrics: string;
    name: string;
    release_date: number;
    server_file_path: string;
    song_content_language: string;
    song_content_type: string;
}

export interface IGetSongObjectParsed extends IGetSongObject {
    isAudio?: boolean;
    isUndefined?: boolean;
    isVideo?: boolean;
}
