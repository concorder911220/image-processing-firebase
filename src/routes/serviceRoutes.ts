import { Router } from "express";
import {
  handleRemoveBackground,
  handleTextToImage,
  handleTextToImageAiStability,
  handleUpscale,
} from "../controllers/imageController";
import { registerProtectedRoute } from "../infrastructure/server";
import { IHTTPMethods } from "../utils/types";

class ServiceRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    registerProtectedRoute(
      this.router,
      IHTTPMethods.POST,
      "/text-to-image",
      handleTextToImage
    );
    registerProtectedRoute(
      this.router,
      IHTTPMethods.POST,
      "/remove-background",
      handleRemoveBackground
    );
    registerProtectedRoute(
      this.router,
      IHTTPMethods.POST,
      "/upscale",
      handleUpscale
    );
    registerProtectedRoute(
      this.router,
      IHTTPMethods.POST,
      "/text-to-image-ai-stability",
      handleTextToImageAiStability
    );
  }
}

export default new ServiceRouter().router;
