import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import { tokenModel } from "../models/index.js";

class Helper {
  async hashPassword(password) {
    const saltRounds = 15;
    return hashSync(password, saltRounds);
  }

  async checkPassword(password, hash) {
    return compareSync(password, hash);
  }

  async toLowerCase(text) {
    return text.toLowerCase();
  }

  async createToken(payload) {
    try {
      const token = sign(payload, process.env.JWT_SECRET);

      await tokenModel.create({
        tokenable_type: "jwt",
        tokenable_id: token,
        name: "bearer",
      });

      return token;
    } catch (err) {
      console.error("Error creating token:", err);
    }
  }

  async deleteToken(token) {
    try {
      await tokenModel.destroy({ where: { tokenable_id: token } });
    } catch (err) {
      console.error("Error deleting token:", err);
    }
  }
}

export default new Helper();
