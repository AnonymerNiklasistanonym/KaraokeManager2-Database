export interface IMdFile {
  description?: string;
  files?: IMdFile[];
  header: string;
  htmlExample?: string;
  jsonHelp?: string;
}

export interface IDocumentationGeneralOptions {
  directoryPath: string[];
  infoText: string;
}

export interface IJsDocDocumentationInformationObject {
  directoryPathJsDoc: string[];
  filePathMdDoc: string[];
  indexFilePath: string[];
  name: string;
}

export interface IJsDocDocumentationInformation extends Array<IJsDocDocumentationInformationObject> {}

export interface IFile {
  files?: IFile[];
  htmlExample?: boolean;
  info?: string;
  jsonHelp?: object;
  path: string;
}

export interface IFileStructureDocumentationInformation {
  contentTitle: string;
  filePath: string[];
  indexFile: {
    filePath: string[];
  };
  sourceDirectories: Array<{
    fileExtensions: string[];
    filePath: string[];
  }>;
  title: string;
  tocTitle: string;
}

export interface IFileInformation {
  htmlExample?: boolean;
  info?: string;
  jsonHelp?: object;
  path: string;
}
