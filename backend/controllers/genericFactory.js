export const createCrudHandlers = (Model) => ({
  create: async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ success: true, data: doc });
  },
});

