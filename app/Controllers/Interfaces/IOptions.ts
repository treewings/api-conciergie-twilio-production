export interface IMainMenu{
  menu_id: number | null;
  type?: string;
  setor: number;
  client_id: number;
}

export interface ISubMenus{
  menu_id: number;
  submenu_id: number;
  type_attendance_id?: number;
  quantity?: number;
}

export interface IPacAcomp{
  menu_id: number | null;
  setor: number;
  client_id: number;
}

export interface IConfirm{
  option: number;
}

export interface ITypeAttendance{
  menu_id: number | null;
  type?: string;
  setor: number;
  client_id: number;
}

export interface IMoreService{
  option: number;
}

