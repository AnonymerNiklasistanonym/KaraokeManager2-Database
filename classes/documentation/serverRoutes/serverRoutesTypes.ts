export interface IExpressListEndpointsObject {
  methods: string[];
  path: string;
}

export interface IJsonFileDataObject {
  dictionary: IJsonFileDataDictionaryObject[];
  filePath: string[];
  title: string;
}

export interface IJsonFileDataDictionaryObject {
  currentlyUsed?: boolean;
  description: string;
  path: string;
}

export interface IFinalRouteObject extends IExpressListEndpointsObject {
  description: string;
}

export interface IAddInfoToServerRoutesResult {
  dictionary: IJsonFileDataDictionaryObject[];
  routes: IFinalRouteObject[];
}
