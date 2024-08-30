class UserRepo {
  static users = new Map();

  /**
   * Saves a user to the repository.
   * If the user already exists, it updates the user; otherwise, it adds a new user.
   * @param {Object} user - The user object to add or update.
   * @returns {Object} The saved user object.
   * @throws {Error} If the user does not have an ID.
   */
  save(user) {
    if (!user.id) {
      throw new Error("User must have an ID");
    }

    UserRepo.users.set(user.id, user);

    return user;
  }

  /**
   * Retrieves a user by ID.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Object|null} The user object if found, otherwise null.
   */
  getUserById(id) {
    return UserRepo.users.get(id) || null;
  }

  /**
   * Deletes a user from the repository by ID.
   * @param {string} id - The ID of the user to delete.
   * @returns {boolean} True if the user was deleted, otherwise false.
   */
  deleteUser(id) {
    return UserRepo.users.delete(id);
  }

  /**
   * Retrieves all users from the repository.
   * @returns {Array} An array of all user objects.
   */
  getAllUsers() {
    return Array.from(UserRepo.users.values());
  }
}

export default UserRepo;
