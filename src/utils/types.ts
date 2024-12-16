export enum IHTTPMethods {
  GET = "get",
  POST = "post",
  PATCH = "patch",
  DELETE = "delete",
  PUT = "put",
}

export interface IWebserver {
  start: Function;
  registerRoute: Function;
  registerProtectedRoute: Function;
  stop: Function;
}
