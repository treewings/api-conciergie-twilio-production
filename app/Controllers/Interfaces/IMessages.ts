export interface IMessage {
  client_id: number;
  cd_message: string;
  cd_setor: number;
  menu_id?: number | null;
  submenu_id?: number | null;
  type_attendance_id: number;
  nr_attendance?: string;
  main_movement?: number;
  number?: string;
  more_service?: boolean;
  body: string;
  from: string;
}
