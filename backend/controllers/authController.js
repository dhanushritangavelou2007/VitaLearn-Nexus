import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { loginUser, registerUser } from "../services/authService.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log("Login request:", email);

    const result = await loginUser(email, password);

    console.log(result);

    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("LOGIN ERROR");
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
};

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json({ success: true, ...result });
});

export const logout = asyncHandler(async (_req, res) => {
  res.json({ success: true, message: "Logged out successfully." });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

