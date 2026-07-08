import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";
import { getRepository } from "../repositories/index.js";

const userRepository = getRepository("User");

export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;

    const token =
      header && header.startsWith("Bearer ")
        ? header.substring(7)
        : null;

    if (!token) {
      throw new AppError("You are not logged in.", 401);
    }

    const payload = verifyToken(
      token,
      process.env.JWT_SECRET
    );

    const user = await userRepository.findById(payload.id);

    if (!user) {
      throw new AppError(
        "The user belonging to this token no longer exists.",
        401
      );
    }

    const safeUser = { ...user };
    delete safeUser.password;

    req.user = safeUser;

    next();

  } catch (error) {

    next(
      error instanceof AppError
        ? error
        : new AppError("Unauthorized", 401)
    );

  }
};

export const restrictTo =
  (...roles) =>
  (req, _res, next) => {

    if (!req.user) {
      return next(
        new AppError("Unauthorized", 401)
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "Permission denied.",
          403
        )
      );
    }

    next();

  };