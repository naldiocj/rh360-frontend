export interface SetupInterface {
  headers: SetupHeadersInterface;
  colors: SetupColorsInterface;
  intl: SetupIntlInterface;
  history: SetupHistoryInterface;
}

export interface SetupHeadersInterface {
  core: string;
  blockDays: number;
  copyright: string;
  coreDescription: string
  operators: string;
  operatorsDescription: string;
}
export interface SetupColorsInterface {
  primaryColor: string;
  secondaryColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  anchorColor: string;
  activeAnchorColor: string;
  backgroundColor: string;
}
export interface SetupIntlInterface {
  organism: string;
  organisms: string;
  template: string;
  templates: string;
  userOrganism: string;
  templateOrganism: string;
  relationshipTemplate: string;
}

export interface SetupHistoryInterface{
  showBeforeFilter: boolean;
  typingIndicator:boolean;
  showAllBooks:boolean;
}
