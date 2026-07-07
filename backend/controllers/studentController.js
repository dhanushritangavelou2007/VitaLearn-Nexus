import Student from "../models/Student.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { listStudents } from "../services/studentService.js";

export const getStudents = asyncHandler(async (req, res) => {
  const { items, pagination } = await listStudents(req.query);
  res.json({ success: true, data: items, pagination });
});

export const getStudentById = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id).populate("reports.createdBy", "name role");
  if (!student) return next(new AppError("Student not found", 404));
  res.json({ success: true, data: student });
});

export const createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json({ success: true, data: student });
});

export const updateStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!student) return next(new AppError("Student not found", 404));
  res.json({ success: true, data: student });
});

export const deleteStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return next(new AppError("Student not found", 404));
  res.status(204).send();
});

