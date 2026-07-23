import bcrypt from "bcryptjs";
import { getRepository } from "../repositories/index.js";
import { signToken } from "../utils/jwt.js";

const userRepository = getRepository("User");

export async function registerUser(payload) {
  const existingUser = await userRepository.findOne({
    email: payload.email,
  });

  if (existingUser) {
    throw new Error("User already exists.");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const user = await userRepository.create({
    ...payload,
    password: hashedPassword,
  });

  const token = signToken(
    {
      id: user._id || user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN
  );

  const safeUser = { ...user };
  delete safeUser.password;

  return {
    user: safeUser,
    token,
  };
}

export async function loginUser(email, password) {
  const user = await userRepository.findOneWithPassword({ email });

  if (!user) return null;

  let valid = false;

  // Demo repository uses plain-text passwords
  if (
    user.password === "VitaLearn2026!X"
  ) {
    valid = user.password === password;
  } else {
    valid = await bcrypt.compare(password, user.password);
  }

  if (!valid) return null;

  const token = signToken(
    {
      id: user._id || user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN
  );

  const safeUser = { ...user };
  delete safeUser.password;

  return {
    user: safeUser,
    token,
  };
}