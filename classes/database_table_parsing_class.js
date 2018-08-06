class DatabaseTableParsingClass {
	constructor() {
		this.databaseProperties = []
		this.databaseReferences = []
	}
	parseEverythingBegin() {
		throw new Error("Method needs to be implemented")
	}
	parseTableBegin(tableName, tableDescription) {
		this.databaseProperties = []
		this.databaseReferences = []
	}
	parseTablePropertyName(tablePropertyName, tablePropertyDescription) {
		throw new Error("Method needs to be implemented")
	}
	parseTablePropertyType(tablePropertyType) {
		throw new Error("Method needs to be implemented")
	}
	parseTablePropertyIsPrimaryKey() {
		throw new Error("Method needs to be implemented")
	}
	parseTablePropertyIsNotNullUniqueKey(not_null, unique) {
		throw new Error("Method needs to be implemented")
	}
	parseTablePropertyDefault(defaultValue, propertyValue) {
		throw new Error("Method needs to be implemented")
	}
	parseTablePropertyReturn() {
		throw new Error("Method needs to be implemented")
	}
	parseTableGetPrimaryKey(primaryKeyQuery) {
		this.databaseProperties.push(primaryKeyQuery)
	}
	parseTableGetNotNullKey(notNullKeyQuery) {
		this.databaseProperties.push(notNullKeyQuery)
	}
	parseTableGetNullKey(nullKeyQuery) {
		this.databaseProperties.push(nullKeyQuery)
	}
	parseTableGetNotNullKeyReference(notNullKeyQueryReference) {
		this.databaseReferences.push(notNullKeyQueryReference)
	}
	parseTableGetNullKeyReference(nullKeyQueryReference) {
		this.databaseReferences.push(nullKeyQueryReference)
	}
	parseTablePropertyReference(tableName, referenceTable, referenceProperty) {
		throw new Error("Method needs to be implemented")
	}
	resolveTable() {
		throw new Error("Method needs to be implemented")
	}
	resolveEverything() {
		throw new Error("Method needs to be implemented")
	}
}

module.exports = DatabaseTableParsingClass
