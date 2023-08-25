export type ActionType = {
  isInput?: boolean;
  isButton?: boolean;
  content?: string;
  isBackRoute?: boolean;
}

export type SelectorXPath = {
  [key: string]: string[] | InputSelector[];
}

export type InputSelector = {
  content?: string;
  path: string;
}