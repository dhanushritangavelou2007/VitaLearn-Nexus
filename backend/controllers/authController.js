import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { loginUser, registerUser } from "../services/authService.js";

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  if (!result) return next(new AppError("Invalid email or password.", 401));
  res.json({ success: true, ...result });
});

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

