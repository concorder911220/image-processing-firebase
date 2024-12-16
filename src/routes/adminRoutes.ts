import { Router } from "express";
import {
  grantPermission,
  removePermission,
} from "../controllers/adminController";
import { registerProtectedRoute } from "../infrastructure/server";
import { IHTTPMethods } from "../utils/types";

class AdminRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    registerProtectedRoute(
      this.router,
      IHTTPMethods.POST,
      "/grant-access",
      grantPermission
    );
    registerProtectedRoute(
      this.router,
      IHTTPMethods.POST,
      "/remove-access",
      removePermission
    );
  }
}

export default new AdminRouter().router;
