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

export interface IJsonDataTableDefaultValues {
    accounts: Array<{
        name: string;
        password: string;
    }>;
}
