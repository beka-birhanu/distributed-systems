import express from "express";

/**
 * Represents the main router for handling and organizing routes in the application.
 */
class Router {
  /**
   * Creates an instance of Router.
   * @param {Object} config - Configuration object for setting up the router.
   * @param {string} config.addr - The address and port to listen on.
   * @param {string} config.baseURL - The base URL for the API routes.
   * @param {Array} config.controllers - An array of controller instances to manage routes.
   * @param {function} config.authorizationMiddleware - Middleware function to handle authorization.
   */
  constructor(config) {
    this.app = express();
    this.addr = config.addr;
    this.baseURL = config.baseURL;
    this.controllers = config.controllers;
    this.authorizationMiddleware = config.authorizationMiddleware;
  }

  /**
   * Sets up and starts the HTTP server with organized routes.
   * Public routes are accessible without authentication.
   * Protected routes require authentication and are protected by middleware.
   */
  Run() {
    const apiRouter = express.Router();
    const publicRoutes = express.Router();
    const protectedRoutes = express.Router();

    // Public routes (accessible without authentication)
    this.controllers.forEach((controller) => {
      controller.registerPublic(publicRoutes);
    });

    // Protected routes (authentication required)
    protectedRoutes.use(this.authorizationMiddleware);
    this.controllers.forEach((controller) => {
      controller.registerPrivate(protectedRoutes);
    });

    // Mount the routers under the base URL
    apiRouter.use("/v1", publicRoutes);
    apiRouter.use("/v1", protectedRoutes);

    this.app.use(this.baseURL, apiRouter);
    this.app.listen(this.addr, () => {
      console.log(`Listening on ${this.addr}`);
    });
  }
}

export default Router;
