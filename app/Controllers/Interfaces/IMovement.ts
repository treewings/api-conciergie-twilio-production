export interface IMovementStore {
  id?: number;
  number: string;
  nr_attendance: string | null;
  status_movement_code: string;
  menu_id: number | null;
  submenu_id: number | null;
  quantity: string | null;
  main_movement: number | null;
  type_attendance?: number | null;
  last_movement: number | null;
  client_id: number;
  more_service?: boolean;
  keep_main_movement?: boolean;
  survey_id?: number;
}

export interface IMovementShow {
  column: any;
  value: any;
  client_id: number;
}

export interface ISummary {
  client_id: number;
  number: string;
  main_movement: number;
  nr_attendance: string;
}

export interface ISummaryItens {
  client_id: number;
  number: string;
  main_movement: number;
  nr_attendance: string;
  branches_movement: string;
  returnContentSingleRequest: string;
}

export interface IMovementRequestXml{

}

