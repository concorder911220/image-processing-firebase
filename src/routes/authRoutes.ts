import { Router } from "express";
import {
  handleRegister,
  handleLogin,
  handleLogout,
} from "../controllers/authController";
import { registerRoute } from "../infrastructure/server";
import { IHTTPMethods } from "../utils/types";
class AuthRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    registerRoute(this.router, IHTTPMethods.POST, "/register", handleRegister);
    registerRoute(this.router, IHTTPMethods.POST, "/login", handleLogin);
    registerRoute(this.router, IHTTPMethods.POST, "/logout", handleLogout);
  }
}

export default new AuthRouter().router;
