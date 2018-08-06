#!/usr/bin/env node

/*
 * Description:
 * This class parses the json file to a database
 */

// Convert callbacks to promises
const promisify = require('util').promisify
// Read files
const readFile = require('fs').readFile
// Write files
const writeFile = require('fs').writeFile

// Convert normal async ready file with callback to promise
const readFilePromise = promisify(readFile)
const writeFilePromise = promisify(writeFile)

class DatabaseTableParser {
	/**
	 * Get path of JSON file which contains the database tables
	 */
	static get JSON_FILE_DATABASE_TABLES_PATH() {
		return "data/tables.json";
	}
	/**
	 * Parse json of database tables
	 */
	static parseDatabaseTable() {
		return new Promise((resolve, reject) => {
			readFilePromise(this.JSON_FILE_DATABASE_TABLES_PATH)
				.then(file => resolve(JSON.parse(file)))
				.catch(err => reject(err))
		})
	}
	static parseDatabaseTableProperty(parseClass, tableProperty, is_primary_key = false, is_not_null = false) {

		// check if property has a name and description
		if (!tableProperty.hasOwnProperty("name") || tableProperty.name === "") {
			throw new Error("No property name found!")
		}
		if (!tableProperty.hasOwnProperty("description") || tableProperty.description === "") {
			throw new Error("No property description found! (" + tableProperty.name + ")")
		}

		parseClass.parseTablePropertyName(tableProperty.name, tableProperty.description)

		// convert property type to correct sqlite type
		switch (tableProperty.type) {
			case "integer":
				parseClass.parseTablePropertyType("integer")
				break
			case "text":
				parseClass.parseTablePropertyType("text")
				break
			case "boolean":
				parseClass.parseTablePropertyType("boolean")
				break
			case "date":
				parseClass.parseTablePropertyType("date")
				break
			default:
				throw new Error("Undefined property type found (" + tableProperty.name + " >> " + tableProperty.type + ")")
		}
		// check if property is a primary key
		if (is_primary_key) {
			parseClass.parseTablePropertyIsPrimaryKey()
		}

		// check if property is a not null key and/or unique
		parseClass.parseTablePropertyIsNotNullUniqueKey(is_not_null, (tableProperty.hasOwnProperty("unique") && tableProperty.unique))


		// check if property has a default value
		if (tableProperty.hasOwnProperty("default")) {
			parseClass.parseTablePropertyDefault(tableProperty.type)
		}

		return parseClass.parseTablePropertyReturn()
	}
	/**
	 * Get SQLite queries to create all necessary tables
	 */
	static parseDatabaseTableWithClass(parseClass) {
		return new Promise((resolve, reject) => {
			this.parseDatabaseTable()
				.then(jsonArrayObject => {
					parseClass.parseEverythingBegin()

					// iterate over all tables
					for (let key in jsonArrayObject) {
						const TABLE_OBJECT = jsonArrayObject[key]

						if (!TABLE_OBJECT.hasOwnProperty("name") || TABLE_OBJECT.name === "") {
							throw new Error("No table name found!")
						}
						if (!TABLE_OBJECT.hasOwnProperty("description") || TABLE_OBJECT.description === "") {
							throw new Error("No table description found! (" + TABLE_OBJECT.name + ")")
						}

						parseClass.parseTableBegin(TABLE_OBJECT.name, TABLE_OBJECT.description)

						// add primary key property
						if (!TABLE_OBJECT.hasOwnProperty("primary_key")) {
							throw new Error("No primary key found! (table = " + TABLE_OBJECT.name + ")")
						}

						parseClass.parseTableGetPrimaryKey(this.parseDatabaseTableProperty(parseClass, TABLE_OBJECT.primary_key, true))

						if (TABLE_OBJECT.hasOwnProperty("not_null_keys")) {
							for (let not_null_property in TABLE_OBJECT.not_null_keys) {
								parseClass.parseTableGetNotNullKey(this.parseDatabaseTableProperty(parseClass, TABLE_OBJECT.not_null_keys[not_null_property], false, true))
								parseClass.parseTableGetNotNullKeyReference(this.parseDatabaseTablePropertyReference(parseClass, TABLE_OBJECT.not_null_keys[not_null_property]))
							}
						}
						if (TABLE_OBJECT.hasOwnProperty("null_keys")) {
							for (let null_property in TABLE_OBJECT.null_keys) {
								parseClass.parseTableGetNullKey(this.parseDatabaseTableProperty(parseClass, TABLE_OBJECT.null_keys[null_property]))
								parseClass.parseTableGetNullKeyReference(this.parseDatabaseTablePropertyReference(parseClass, TABLE_OBJECT.null_keys[null_property]))
							}
						}

						parseClass.resolveTable()
					}

					resolve(parseClass.resolveEverything())
				})
				.catch(err => reject(err))
		})
	}

	static parseDatabaseTablePropertyReference(parseClass, tableProperty) {
		if (tableProperty.hasOwnProperty("reference")) {
			return parseClass.parseTablePropertyReference(tableProperty.name, tableProperty.reference.table, tableProperty.reference.property)
		} else {
			return undefined
		}
	}
}

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
	 * Get path of database structure documentation file
	 */
	static get MD_FILE_DOCUMENTATION_TABLES() {
		return "documentation_database_structure.md";
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
	 * Get query part of property of parsed JSON table object property
	 */
	static convertJsonTablePropertyToDocumentationProperty(tableProperty, is_primary_key = false, is_not_null = false) {
		let property = " - " + tableProperty.name
		// check if property has a name and description
		if (!tableProperty.hasOwnProperty("name") || tableProperty.name === "") {
			throw new Error("No property name found!")
		}
		if (!tableProperty.hasOwnProperty("description") || tableProperty.description === "") {
			throw new Error("No property description found! (" + tableProperty.name + ")")
		}
		property += " (`" + tableProperty.type + "`) >> "
		// check if property is a primary key
		if (is_primary_key) {
			return property + "*NOT NULL*, *UNIQUE*"
		}
		// check if property is a not null key
		if (is_not_null) {
			property += "*NOT NULL*"
		}
		// check if property is unique
		if (tableProperty.hasOwnProperty("unique") && tableProperty.unique) {
			property += is_not_null ? ", *UNIQUE*" : "*UNIQUE*"
		}
		// check if property has a default value
		if (tableProperty.hasOwnProperty("default")) {
			property += " >> **Default:** *" + tableProperty + "*\n"
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
						for (let reference of sqliteQueryReferences) {
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
	/**
	 * Get SQLite queries to create all necessary tables
	 */
	static parseDatabaseTableJsonToDocumentation() {
		this.readDatabaseTableJsonFile()
			.then(jsonArrayObject => {
				let markdownDocumentation = "# Database documentation\n\n" +
					"This automated created document shows how the database is currently structured for a better overview.\n\n\n" +
					"## Tables\n\n"
				// iterate over all tables
				for (let key in jsonArrayObject) {
					const TABLE_OBJECT = jsonArrayObject[key]

					let sqliteQueryProperties = []
					let sqliteQueryReferences = []

					if (!TABLE_OBJECT.hasOwnProperty("name") || TABLE_OBJECT.name === "") {
						throw new Error("No table name found!")
					}
					if (!TABLE_OBJECT.hasOwnProperty("description") || TABLE_OBJECT.description === "") {
						throw new Error("No table description found! (" + TABLE_OBJECT.name + ")")
					}
					markdownDocumentation += "### " + TABLE_OBJECT.name + "\n\n" + TABLE_OBJECT.description + "\n\n"

					// add primary key property
					if (!TABLE_OBJECT.hasOwnProperty("primary_key")) {
						throw new Error("No primary key found! (table = " + TABLE_OBJECT.name + ")")
					}

					markdownDocumentation += "#### PRIMARY KEY\n\n" + "- " + TABLE_OBJECT.primary_key.name + "(`" + TABLE_OBJECT.primary_key.type + "`) >> " + TABLE_OBJECT.primary_key.description + "- "
					sqliteQueryProperties.push(this.convertJsonTablePropertyToDocumentationProperty(TABLE_OBJECT.primary_key, true))

					if (TABLE_OBJECT.hasOwnProperty("not_null_keys")) {
						for (let not_null_property in TABLE_OBJECT.not_null_keys) {
							sqliteQueryProperties.push(this.convertJsonTablePropertyToDocumentationProperty(TABLE_OBJECT.not_null_keys[not_null_property], false, true))
							sqliteQueryReferences.push(this.convertJsonTablePropertyToSqliteTableReference(TABLE_OBJECT.not_null_keys[not_null_property]))
						}
					}
					if (TABLE_OBJECT.hasOwnProperty("null_keys")) {
						for (let null_property in TABLE_OBJECT.null_keys) {
							sqliteQueryProperties.push(this.convertJsonTablePropertyToDocumentationProperty(TABLE_OBJECT.null_keys[null_property]))
							sqliteQueryReferences.push(this.convertJsonTablePropertyToSqliteTableReference(TABLE_OBJECT.null_keys[null_property]))
						}
					}
					// add non null/undefined references to sqliteQueryProperties
					for (let reference of sqliteQueryReferences) {
						reference && sqliteQueryProperties.push(reference)
					}
					// add properties to sql query
					markdownDocumentation += sqliteQueryProperties.join("\n") + "\n\n"
				}
				writeFilePromise(this.MD_FILE_DOCUMENTATION_TABLES, markdownDocumentation, (err) => {
					if (err) {
						return console.log(err);
					}
					console.log("The file was saved!");
				});
			})
			.catch(err => console.error(err))
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
		SetupDatabase.parseDatabaseTableJsonToDocumentation()
	}

}

// DatabaseHelper.setup()


module.exports = DatabaseTableParser
