import Router from "./src/router.js";
import AuthController from "./src/controllers/auth.js";
import AuthService from "./src/services/userService.js";
import UserRepo from "./src/services/userRepo.js";
import JWTService from "./src/services/jwt.js";

const config = {
  addr: 3000,
  baseURL: "/api",
  secret: "your-secret-key",
  accessTokenExpiry: "1h",
  refreshTokenExpiry: "7d",
};

// Initialize services
const jwtService = new JWTService({
  secret: config.secret,
  accessTokenExpiry: config.accessTokenExpiry,
  refreshTokenExpiry: config.refreshTokenExpiry,
});

const userRepo = new UserRepo();
const authService = new AuthService(userRepo, jwtService);

// Initialize controllers
const authController = new AuthController(authService);

// Initialize and configure the router
const routerConfig = {
  addr: config.addr,
  baseURL: config.baseURL,
  controllers: [authController],
  authorizationMiddleware: (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwtService.decodeToken(token);
        req.user = decoded;
        next();
      } catch (error) {
        res.status(401).json({ error: "Invalid or expired token" });
      }
    } else {
      res
        .status(401)
        .json({ error: "Authorization header missing or malformed" });
    }
  },
};

const router = new Router(routerConfig);

router.Run();
