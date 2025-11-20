import { User } from "../models/userModel.js";

export class UserDAO {
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async getByEmail(email) {
    return await User.findOne({ email });
  }

  async getById(id) {
    return await User.findById(id).populate("cart");
  }

  async saveResetToken(userId, token, expiration) {
    return await User.findByIdAndUpdate(
      userId,
      { resetToken: token, resetTokenExp: expiration },
      { new: true }
    );
  }

  async getByResetToken(token) {
    return await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });
  }

  async updatePassword(userId, hashedPassword) {
    return await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword, resetToken: null, resetTokenExp: null },
      { new: true }
    );
  }
}
