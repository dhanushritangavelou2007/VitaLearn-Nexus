import bcrypt from "bcryptjs";
import { getRepository } from "../repositories/index.js";
import { signToken } from "../utils/jwt.js";

function toSafeJSON(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
}

export async function registerUser(payload) {
  const repo = getRepository("User");
  const password = await bcrypt.hash(payload.password, 12);
  const user = await repo.create({ ...payload, password });
  const token = signToken({ id: user._id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
  return { user: toSafeJSON(user), token };
}

export async function loginUser(email, password) {
  const repo = getRepository("User");
  const user = await repo.findOneWithPassword({ email });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  const token = signToken({ id: user._id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
  return { user: toSafeJSON(user), token };
}
