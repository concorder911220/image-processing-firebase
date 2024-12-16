import express, { Express, RequestHandler } from "express";

import { IHTTPMethods } from "../utils/types";
import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import roleMiddleware from "../middlewares/roleMiddleware";
import serviceMiddleware from "../middlewares/serviceMiddleware";

export const registerRoute = (
  router: Router,
  method: IHTTPMethods,
  path: string,
  handler: RequestHandler
) => {
  router[method](path, handler);
};

export const registerProtectedRoute = (
  router: Router,
  method: IHTTPMethods,
  path: string,
  handler: RequestHandler
) => {
  router[method](path, authMiddleware, roleMiddleware, handler);
};

export const serviceRoute = (
  router: Router,
  method: IHTTPMethods,
  path: string,
  handler: RequestHandler
) => {
  router[method](path, authMiddleware, serviceMiddleware, handler);
};
