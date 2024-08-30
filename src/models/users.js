import { v4 as uuidv4 } from "uuid";
import zxcvbn from "zxcvbn";
import { hashSync, compareSync } from "bcryptjs";

const MIN_PASSWORD_STRENGTH_SCORE = 3;
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/; // Alphanumeric with underscores

const errors = {
  USERNAME_TOO_SHORT: "Username is too short",
  USERNAME_TOO_LONG: "Username is too long",
  USERNAME_INVALID_FORMAT: "Username is invalid format",
  USERNAME_TAKEN: "Username already exists",
  WEAK_PASSWORD: "Password is too weak",
};

/**
 * Represents a user with details such as username, password hash, and associated expenses.
 */
class User {
  /**
   * Creates a new User instance.
   * @param {Object} config - Configuration object for creating a new user.
   * @param {string} config.username - The username for the user.
   * @param {string} config.plainPassword - The plain text password for the user.
   * @throws {Error} If the username or password does not meet the validation requirements.
   */
  constructor(config) {
    this.#validateUsername(config.username);
    this.#validatePassword(config.plainPassword);

    this.id = uuidv4();
    this.username = config.username;
    this.passwordHash = hashSync(config.plainPassword, 10);
  }

  #validateUsername(username) {
    if (username.length < MIN_USERNAME_LENGTH) {
      throw new Error(errors.USERNAME_TOO_SHORT);
    }
    if (username.length > MAX_USERNAME_LENGTH) {
      throw new Error(errors.USERNAME_TOO_LONG);
    }
    if (!USERNAME_PATTERN.test(username)) {
      throw new Error(errors.USERNAME_INVALID_FORMAT);
    }
  }

  #validatePassword(password) {
    const result = zxcvbn(password);
    if (result.score < MIN_PASSWORD_STRENGTH_SCORE) {
      throw new Error(errors.WEAK_PASSWORD);
    }
  }

  /**
   * Compares a plain text password with the stored password hash.
   * @param {string} password - The plain text password to compare.
   * @returns {boolean} Returns true if the password matches, otherwise false.
   */
  matchPassword(password) {
    return compareSync(password, this.passwordHash);
  }
}

export default User;
export { errors };
