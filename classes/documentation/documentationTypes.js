/**
 * Type definition for a File object
 * @typedef {{path: string, info?: string, jsonHelp?: *, files?: File[]}} File
 */

/**
 * Type definition for a FileStructureDocumentationInformation object
 * @typedef {{filePath: string[], title: string, tocTitle: string, contentTitle:string, indexFile: {filePath: string[]}, sourceDirectories: [{filePath: string[], fileExtensions: string[]}]}} FileStructureDocumentationInformation
 */

/**
 * Type definition for a MdFile object
 * @typedef {{header: string, description?: string, jsonHelp?: *, files?: MdFile[]}} MdFile
 */

/**
 * Type definition for a DocumentationGeneralOptions object
 * @typedef {{directoryPath: string[], infoText: string}} DocumentationGeneralOptions
 */

/**
 * Type definition for a JsDocDocumentationInformation object
 * @typedef {[{name: string, directoryPathJsDoc: string[], filePathMdDoc: string[],indexFilePath: string[]}]} JsDocDocumentationInformation
 */

module.exports = {}
