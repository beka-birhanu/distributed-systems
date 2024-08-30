import { sign, verify } from "jsonwebtoken";

/**
 * Represents a service for handling JWT (JSON Web Tokens) operations.
 */
class JWTService {
  /**
   * Creates a new JWTService instance.
   * @param {Object} config - Configuration object for JWT.
   * @param {string} config.secret - The secret key used for signing tokens.
   * @param {string} config.accessTokenExpiry - Expiration time for access tokens (e.g., '1h', '15m').
   * @param {string} config.refreshTokenExpiry - Expiration time for refresh tokens (e.g., '7d', '30d').
   */
  constructor(config) {
    this.secret = config.secret;
    this.accessTokenExpiry = config.accessTokenExpiry;
    this.refreshTokenExpiry = config.refreshTokenExpiry;
  }

  /**
   * Generates a JWT token based on a user object.
   * @param {Object} user - The user object containing user details.
   * @param {boolean} [isRefresh=false] - If true, generates a refresh token; otherwise, generates an access token.
   * @returns {string} The generated JWT token.
   */
  generateToken(user, isRefresh = false) {
    // Construct the payload from the user object
    const payload = {
      id: user.id,
      username: user.username,
      // Include other user details as needed
    };

    const expiresIn = isRefresh
      ? this.refreshTokenExpiry
      : this.accessTokenExpiry;

    return sign(payload, this.secret, { expiresIn });
  }

  /**
   * Decodes a JWT token.
   * @param {string} token - The token to decode.
   * @returns {Object} The decoded payload if the token is valid.
   * @throws {Error} If the token is invalid or cannot be verified.
   */
  decodeToken(token) {
    try {
      return verify(token, this.secret);
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }
}

export default JWTService;
