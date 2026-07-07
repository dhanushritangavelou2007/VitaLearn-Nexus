import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header && header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw new AppError("You are not logged in.", 401);
    }

    const payload = verifyToken(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      throw new AppError("The user belonging to this token no longer exists.", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError("Unauthorized", 401));
  }
};

export const restrictTo = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to perform this action.", 403));
  }
  next();
};

