export type TErrorSources = {
  path: string | number;
  message: string;
}[];
//unknown variable return patano take atkanor generic type declear function
export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errrorSources: TErrorSources;
};
