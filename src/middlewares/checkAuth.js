import jwt from "jsonwebtoken";
const { verify } = jwt;

import { userModel, tokenModel } from "../models/index.js";

const checkAuth = {
  User: async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return res
          .status(401)
          .json({ success: false, message: "Access Token is required" });
      }

      const bearer = req.headers.authorization.split(" ");
      const bearerToken = bearer[1];

      const tokenData = await tokenModel.findOne({
        where: { tokenable_id: bearerToken },
      });

      if (!tokenData) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid Access Token" });
      }

      verify(
        tokenData.tokenable_id,
        `${process.env.JWT_SECRET}`,
        async (err, jwt_payload) => {
          if (err) {
            return res
              .status(401)
              .json({ success: false, message: "User is unauthorized" });
          }

          const user = await userModel.findOne({
            where: {
              id: jwt_payload.id,
              status: true,
              isDeleted: false,
            },
          });

          if (!user) {
            return res
              .status(401)
              .json({ success: false, message: "Invalid Access Token" });
          }

          req.token = bearerToken;
          req.id = user.id;
          req.status = user.status;

          next();
        }
      );
    } catch (error) {
      console.error("Auth error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Unauthorized User", error });
    }
  },
};

export default checkAuth;
