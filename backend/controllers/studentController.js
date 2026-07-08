import { getRepository } from "../repositories/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { listStudents, getStudentById as getStudentServiceById, updateStudent as updateStudentService } from "../services/studentService.js";

export const getStudents = asyncHandler(async (req, res) => {
  const { items, pagination } = await listStudents(req.query);
  res.json({ success: true, data: items, pagination });
});

export const getStudentById = asyncHandler(async (req, res, next) => {
  const student = await getStudentServiceById(req.params.id);
  if (!student) return next(new AppError("Student not found", 404));
  res.json({ success: true, data: student });
});

export const createStudent = asyncHandler(async (req, res) => {
  const repo = getRepository("Student");
  const student = await repo.create(req.body);
  res.status(201).json({ success: true, data: student });
});

export const updateStudent = asyncHandler(async (req, res, next) => {
  const student = await updateStudentService(req.params.id, req.body);
  if (!student) return next(new AppError("Student not found", 404));
  res.json({ success: true, data: student });
});

export const deleteStudent = asyncHandler(async (req, res, next) => {
  const repo = getRepository("Student");
  const student = await repo.findByIdAndDelete(req.params.id);
  if (!student) return next(new AppError("Student not found", 404));
  res.status(204).send();
});
