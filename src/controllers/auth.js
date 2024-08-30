import express from "express";

/**
 * Represents a controller for handling authentication-related routes.
 */
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  /**
   * Registers public routes (e.g., signup, login).
   * @param {express.Router} router - The router to register public routes under.
   */
  registerPublic(router) {
    router.post(`/auth/signup`, this.signup.bind(this));
    router.post(`/auth/login`, this.login.bind(this));
  }

  /**
   * Registers private routes (e.g., user retrieval).
   * @param {express.Router} router - The router to register private routes under.
   */
  registerPrivate(router) {
    router.get(`/user/:id`, this.getUserById.bind(this));
  }

  /**
   * Handles user signup.
   * @param {express.Request} req - The request object.
   * @param {express.Response} res - The response object.
   */
  async signup(req, res) {
    try {
      const { username, password } = req.body;
      const creationTime = new Date();
      const newUser = this.authService.signup({
        username,
        password,
        creationTime,
      });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Handles user login.
   * @param {express.Request} req - The request object.
   * @param {express.Response} res - The response object.
   */
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const { user, accessToken, refreshToken } = this.authService.login({
        username,
        password,
      });
      res.json({
        id: user.id,
        username: user.username,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Retrieves a user by ID.
   * @param {express.Request} req - The request object.
   * @param {express.Response} res - The response object.
   */
  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = this.authService.getUserById(userId);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default AuthController;
