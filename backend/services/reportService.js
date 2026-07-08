import { getRepository } from "../repositories/index.js";

export async function listReports({ page = 1, limit = 20, search = "", risk }) {
  const repo = getRepository("Report");
  const query = {};
  if (search) {
    query.$or = [
      { type: new RegExp(search, "i") },
      { status: new RegExp(search, "i") },
    ];
  }
  if (risk) query.risk = risk;

  const skip = (Number(page) - 1) * Number(limit);
  
  // Note: Populate is not natively supported by our base DemoRepo, but we can do a basic find.
  // In a real scenario we'd do a simulated populate, but for this hackathon we keep it simple.
  const items = await repo.find(query, { createdAt: -1 }, skip, Number(limit));
  const total = await repo.countDocuments(query);

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

