import { UserModel } from "../models/userModel.js";

export class UserRepository {
  // Crear usuario
  async create(data) {
    return await UserModel.create(data);
  }

  // Buscar usuario por email
  async getByEmail(email) {
    return await UserModel.findOne({ email });
  }

  // Buscar usuario por id
  async getById(id) {
    return await UserModel.findById(id).populate("cart");
  }

  // Actualizar usuario por id
  async update(id, data) {
    return await UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  // Guardar token de reseteo de contraseña
  async saveResetToken(userId, token, expiration) {
    return await UserModel.findByIdAndUpdate(
      userId,
      { resetToken: token, resetTokenExpiration: expiration },
      { new: true }
    );
  }

  // Buscar usuario por token válido de reseteo
  async getByResetToken(token) {
    return await UserModel.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
  }

  // Actualizar la contraseña y limpiar token
  async updatePassword(userId, hashedPassword) {
    return await UserModel.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiration: null,
      },
      { new: true }
    );
  }
}
