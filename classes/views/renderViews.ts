export interface ITemplateObject {
    layoutFileName: string[];
    replacePaths: Array<{
        completePath: boolean;
        findPath: string;
        replaceWith: string[];
    }>;
    templateFileName: string[];
}

export interface ILayoutObject {
    layoutFileName: string[];
    replacePaths: Array<{
        completePath: boolean;
        findPath: string;
        replaceWith: string[];
    }>;
    templateFiles: string[][];
}
