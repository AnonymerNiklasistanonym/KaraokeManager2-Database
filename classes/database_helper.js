#!/usr/bin/env node

/*
 * Description:
 * This class helps interacting with the database
 */

// Convert callbacks to promises
const promisify = require('util').promisify
// Read files
const readFile = require('fs').readFile

// Convert normal async ready file with callback to promise
const readFilePromise = promisify(readFile)
const JSON_FILE_TABLES_PATH = "data/tables.json"

/**
 * Methods to easily create database
 */
class SetupDatabase {
    /**
     * Get path of JSON file which contains all necessary tables
     */
    static get JSON_FILE_TABLES_PATH() {
        return "data/tables.json";
    }
    /**
     * Get parsed JSON object which contains all necessary tables
     */
    static readDatabaseTableJsonFile() {
        return new Promise((resolve, reject) => {
            readFilePromise(this.JSON_FILE_TABLES_PATH)
                .then(file => resolve(JSON.parse(file)))
                .catch(err => reject(err))
        })
    }
    /**
     * Get query part of property of parsed JSON table object property
     */
    static convertJsonTablePropertyToSqliteTableProperty(tableProperty, is_primary_key = false, is_not_null = false) {
        let property = tableProperty.name
        // check if property has a name and description
        if (!tableProperty.hasOwnProperty("name") || tableProperty.name === "") {
            throw new Error("No property name found!")
        }
        if (!tableProperty.hasOwnProperty("description") || tableProperty.description === "") {
            throw new Error("No property description found! (" + tableProperty.name + ")")
        }
        // convert property type to correct sqlite type
        switch (tableProperty.type) {
            case "integer":
                property += " integer"
                break
            case "text":
                property += " text"
                break
            case "boolean":
                property += " integer"
                break
            case "date":
                property += " DATETIME"
                break
            default:
                throw new Error("Undefined property type found (" + tableProperty.name + " >> " + tableProperty.type + ")")
        }
        // check if property is a primary key
        if (is_primary_key) {
            return property + " PRIMARY KEY NOT NULL UNIQUE"
        }
        // check if property is a not null key
        if (is_not_null) {
            property += " NOT NULL"
        }
        // check if property is unique
        if (tableProperty.hasOwnProperty("unique") && tableProperty.unique) {
            property += " UNIQUE"
        }
        // check if property has a default value
        if (tableProperty.hasOwnProperty("default")) {
            if (tableProperty.type === "boolean") {
                property += tableProperty.default ? " DEFAULT (1)" : " DEFAULT (0)"
            } else if (tableProperty.type === "date" && tableProperty.default === "now") {
                property += " DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))"
            } else {
                property += " DEFAULT (" + tableProperty.default+")"
            }
        }
        return property
    }
    /**
     * Get query reference part of property of parsed JSON table object property
     */
    static convertJsonTablePropertyToSqliteTableReference(tableProperty) {
        if (tableProperty.hasOwnProperty("reference")) {
            return "FOREIGN KEY (" + tableProperty.name + ")" + " REFERENCES " + tableProperty.reference.table + " (" + tableProperty.reference.property + ")"
        } else {
            return undefined
        }

}
    /**
     * Get SQLite queries to create all necessary tables
     */
    static parseDatabaseTableJsonToSQLiteQueries() {
        return new Promise((resolve, reject) => {
            this.readDatabaseTableJsonFile()
                .then(jsonArrayObject => {
                    let sqliteQueries = []
                    // iterate over all tables
                    for (let key in jsonArrayObject) {
                        const TABLE_OBJECT = jsonArrayObject[key]

                        if (!TABLE_OBJECT.hasOwnProperty("name") || TABLE_OBJECT.name === "") {
                            throw new Error("No table name found!")
                        }
                        if (!TABLE_OBJECT.hasOwnProperty("description") || TABLE_OBJECT.description === "") {
                            throw new Error("No table description found! (" + TABLE_OBJECT.name + ")")
                        }
                        let sqliteQuery =
                            "CREATE TABLE IF NOT EXISTS " +
                            TABLE_OBJECT.name + " ("

                        let sqliteQueryProperties = []
                        let sqliteQueryReferences = []

                        // add primary key property
                        if (TABLE_OBJECT.hasOwnProperty("primary_key")) {
                            sqliteQueryProperties.push(this.convertJsonTablePropertyToSqliteTableProperty(TABLE_OBJECT.primary_key, true))
                        } else {
                            throw new Error("No primary key found! (table = " + TABLE_OBJECT.name + ")")
                        }

                        if (TABLE_OBJECT.hasOwnProperty("not_null_keys")) {
                            for (let not_null_property in TABLE_OBJECT.not_null_keys) {
                                sqliteQueryProperties.push(this.convertJsonTablePropertyToSqliteTableProperty(TABLE_OBJECT.not_null_keys[not_null_property], false, true))
                                sqliteQueryReferences.push(this.convertJsonTablePropertyToSqliteTableReference(TABLE_OBJECT.not_null_keys[not_null_property]))
                            }
                        }
                        if (TABLE_OBJECT.hasOwnProperty("null_keys")) {
                            for (let null_property in TABLE_OBJECT.null_keys) {
                                sqliteQueryProperties.push(this.convertJsonTablePropertyToSqliteTableProperty(TABLE_OBJECT.null_keys[null_property]))
                                sqliteQueryReferences.push(this.convertJsonTablePropertyToSqliteTableReference(TABLE_OBJECT.null_keys[null_property]))
                            }
                        }
                        // add non null/undefined references to sqliteQueryProperties
                        for(let reference of sqliteQueryReferences) {
                            reference && sqliteQueryProperties.push(reference)
                        }
                        // add properties to sql query
                        sqliteQuery += sqliteQueryProperties.join(", ") + ");"
                        // add query to query array
                        sqliteQueries.push(sqliteQuery)
                    }

                    resolve(sqliteQueries)
                })
                .catch(err => reject(err))
        })
    }
}

/**
 * Methods to easily interact with the database
 */
class DatabaseHelper {
    constructor() {
        this.id = 'id_1';
    }
    set name(name) {
        this._name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    get name() {
        return this._name;
    }
    static setup() {
        SetupDatabase.parseDatabaseTableJsonToSQLiteQueries()
            .then(queries => console.log(queries))
            .catch(err => console.error(err))
    }

}

DatabaseHelper.setup()
