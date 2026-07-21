import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { loginUser, registerUser } from "../services/authService.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

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
    console.error("LOGIN ERROR", err);

    if (err.message?.includes("JWT_SECRET") || err.message?.includes("Unable to generate JWT token") || err.message?.includes("Invalid or expired token")) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    next(err);
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

