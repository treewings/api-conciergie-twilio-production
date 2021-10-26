export interface IApiMV{
  url: string;
  token: string;
  nr_attendance: string | null;
}

export interface ISendXmlTo3Wings{
  url: string;
  xml: string;
}
