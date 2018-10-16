/*
 * Get song types
 */

export interface IGetSong {
    author: string;
    date: number;
    description: string;
    id: number;
    name: string;
    releaseDate: number;
    server_file_path: string;
}

export interface IGetSongLink {
    author: string;
    date: number;
    description: string;
    id: number;
    url: string;
}

export interface IGetSongArtist {
    author: string;
    date: number;
    description: string;
    id: number;
    name: string;
    server_file_path_artist_picture: string;
}

export interface IGetSongFinal extends IGetSong {
    artists: IGetSongArtist[];
    contentLanguages: IGetSongContentLanguage[];
    contentTypes: IGetSongContentType[];
    links: IGetSongLink[];
}

export interface IGetSongContentType {
    author: string;
    date: number;
    description: string;
    id: number;
    name: string;
}

export interface IGetSongContentLanguage {
    author: string;
    date: number;
    description: string;
    id: number;
    name: string;
}

/*
 * Add song types
 */

export interface IAddSongOptions {
    description?: string;
    lyrics?: string;
    release_date?: number;
}

export interface IAddSongContentLanguageOptions {
    description?: string;
}

export interface IAddSongContentTypeOptions {
    description?: string;
}

export interface IAddSongLinkOptions {
    description?: string;
}

/*
 * Get artist types
 */

export interface IGetArtist {
    author: string;
    date: number;
    description: string;
    id: number;
    name: string;
    server_file_path_artist_picture: string;
}

/*
 * Add artist types
 */

export interface IAddArtistOptions {
    description?: string;
    server_file_path_artist_picture?: string;
}

export interface IAddArtistLinkOptions {
    description?: string;
}

/*
 * Get account types
 */

export interface IGetAccount {
    id: string;
    is_admin: boolean;
    is_banned: boolean;
    is_banned_comments: boolean;
    is_banned_entries: boolean;
    is_private: boolean;
    name: string;
    server_file_path_bg_picture: string;
    server_file_path_profile_picture: string;
    status: string;
}

export interface IGetAccountCredentials {
    password_hash: string;
    password_salt: string;
}

/*
 * Get account types
 */

export interface IAddAccountOptions {
    isAdmin?: boolean;
    isPrivate?: boolean;
    name?: string;
    server_file_path_bg_picture?: string;
    server_file_path_profile_picture?: string;
    status?: string;
}

/*
 * Add table types
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

export type TableOption = "createIfNotAlreadyExisting" | "createEvenIfAlreadyExisting";
