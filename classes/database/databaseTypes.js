/**
 * Type definition for a Key object
 * @typedef {{name: string, description?: string, type: KeyType, default?: KeyDefault, reference?: KeyReference, options?: KeyOptions}} Key
 */

/**
 * Type definition for a KeyType object
 * @typedef {('integer'|'text'|'boolean'|'date')} KeyType
 */

/**
 * Type definition for a KeyType object
 * @typedef {{table: string, property: string}} KeyReference
 */

/**
 * Type definition for a KeyType object
 * @typedef {(number|boolean|string|'now')} KeyDefault
 */

/**
 * Type definition for a KeyOptions object
 * @typedef {{unique?: boolean, notNull?: boolean, primary?: boolean, autoincrement?: boolean}} KeyOptions
 */

/**
 * Type definition for a ParsedKey object
 * @typedef {{query: string, reference: string}} ParsedKey
 */

/**
 * Type definition for a TableOptions object
 * @typedef {('createIfNotAlreadyExisting'|'createEvenIfAlreadyExisting')} TableOption
 */

/**
 * Type definition for a TableOptions object
 * @typedef {{name: string, description?: string, primary_key: Key, not_null_keys: Key[], null_keys: Key[]}} Table
 */

/**
 * Type definition for the JsonDataTables object
 * @typedef {Table[]} JsonDataTables
 */

/**
 * Type definition for the JsonDataTables object
 * @typedef {{accounts: {name: string, password: string}[]}} JsonDataTableDefaultValues
 */

module.exports = {}
