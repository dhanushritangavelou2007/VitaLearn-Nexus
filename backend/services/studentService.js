import Student from "../models/Student.js";

export async function listStudents({ page = 1, limit = 20, search = "", risk, className }) {
  const query = {};
  if (search) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { rollNo: new RegExp(search, "i") },
      { class: new RegExp(search, "i") },
    ];
  }
  if (risk) query.risk = risk;
  if (className) query.class = className;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Student.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Student.countDocuments(query),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
}

