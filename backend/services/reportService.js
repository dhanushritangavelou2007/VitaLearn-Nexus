import Report from "../models/Report.js";

export async function listReports({ page = 1, limit = 20, search = "", risk }) {
  const query = {};
  if (search) {
    query.$or = [
      { type: new RegExp(search, "i") },
      { status: new RegExp(search, "i") },
    ];
  }
  if (risk) query.risk = risk;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Report.find(query).populate("student createdBy", "name rollNo role").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Report.countDocuments(query),
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

