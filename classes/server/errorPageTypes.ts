export interface IErrorPageLink {
  link: string;
  text: string;
}

export interface IErrorPageLinkReturnObject {
    hasLinks: boolean;
    links: IErrorPageLink[];
}

export interface IErrorPageBodyReturnObject {
  body: string;
  hasBody: boolean;
}
