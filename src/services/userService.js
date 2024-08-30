import { errors } from "../models/Users";

class AuthService {
  constructor({ userRepo, jwtService }) {
    this.userRepo = userRepo;
    this.jwtService = jwtService;
  }

  /**
   * Signs up a new user by creating a user object and storing it in the repository.
   * @param {Object} userData - The user data for signup.
   * @param {string} userData.username - The username of the new user.
   * @param {Date} userData.creationTime - The timestamp when the user is created.
   * @returns {Object} The created user object.
   * @throws {Error} If the user already exists or if there's an error during creation.
   */
  async signup({ username, password }) {
    const existingUser = this.userRepo
      .getAllUsers()
      .find((user) => user.username === username);
    if (existingUser) {
      throw new Error(errors.USERNAME_TAKEN);
    }

    user = new User(uuidv4(), username, password);

    return this.userRepo.save(user);
  }

  /**
   * Logs in a user by checking the username and password, and generates an access token.
   * @param {Object} credentials - The login credentials.
   * @param {string} credentials.username - The username of the user.
   * @param {string} credentials.password - The plain password of the user.
   * @returns {Object} The login response containing the user and the access token.
   * @throws {Error} If the username does not exist or if the password is incorrect.
   */
  async login({ username, password }) {
    const user = this.userRepo
      .getAllUsers()
      .find((user) => user.username === username);
    if (!user) {
      throw new Error("Invalid username or password");
    }

    if (!compareSync(password, user.passwordHash)) {
      throw new Error("Invalid username or password");
    }

    const accessToken = this.jwtService.generateToken(user, false);
    const refreshToken = this.jwtService.generateToken(user, true);

    return { user, accessToken, refreshToken };
  }

  /**
   * Retrieves a user by ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Object|null} The user object if found, otherwise null.
   */
  getUserById(id) {
    return this.userRepo.getUserById(id);
  }
}

export default AuthService;
