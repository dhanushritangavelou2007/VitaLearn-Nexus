import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";

export async function registerUser(payload) {
  const password = await bcrypt.hash(payload.password, 12);
  const user = await User.create({ ...payload, password });
  const token = signToken({ id: user._id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
  return { user: user.toSafeJSON(), token };
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email }).select("+password");
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  const token = signToken({ id: user._id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
  return { user: user.toSafeJSON(), token };
}

