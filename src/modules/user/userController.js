import helpers from "../../helpers/helpers.js";
import { userModel } from "../../models/index.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  console.log(req.body, "bodyyyy");
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All details are required" });
    }
    const loweredEmail = await helpers.toLowerCase(email);
    const existingUser = await userModel.findOne({
      where: { email: loweredEmail },
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use" });
    }
    const hashedPassword = await helpers.hashPassword(password);
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email: loweredEmail,
      password: hashedPassword,
    });
    if (!user) {
      return res.status(500).json({ message: "Error while creating the user" });
    }
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create user", error });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const loweredEmail = await helpers.toLowerCase(email);
    const user = await userModel.findOne({ where: { email: loweredEmail } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User is not registered" });
    }

    const isPasswordValid = await helpers.checkPassword(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Password is incorrect" });
    }

    const payload = { id: user.id };
    const token = await helpers.createToken(payload);

    return res.status(200).json({
      success: true,
      message: "User Logged In Successfully",
      token: token,
      data: user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Unable to login", error });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await userModel.findOne({
      where: {
        id: req.id,
        status: true,
        isDeleted: false,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found" });
    }

    await helpers.deleteToken(req.token);

    return res
      .status(200)
      .json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
};
