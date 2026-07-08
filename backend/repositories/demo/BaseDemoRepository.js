export default class BaseDemoRepository {
  constructor(initialData = []) {
    this.data = initialData;
    this.idCounter = this.data.length + 1;
  }

  async find(query = {}) {
    return this.data.filter((item) => {
      for (const [key, value] of Object.entries(query)) {
        if (key === "$or") {
          const matched = value.some((cond) => {
            for (const [k, v] of Object.entries(cond)) {
              if (v instanceof RegExp) {
                if (v.test(item[k])) return true;
              } else if (item[k] === v) {
                return true;
              }
            }
            return false;
          });
          if (!matched) return false;
        } else if (value instanceof RegExp) {
          if (!value.test(item[key])) return false;
        } else if (item[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const results = await this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  async findById(id) {
    return this.data.find((item) => String(item._id) === String(id) || String(item.id) === String(id));
  }

  async create(payload) {
    const newItem = {
      _id: `demo-${this.idCounter++}`,
      id: `demo-${this.idCounter}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };
    this.data.unshift(newItem); // put at beginning for descending sort
    return newItem;
  }

  async findByIdAndUpdate(id, updates) {
    const index = this.data.findIndex((item) => String(item._id) === String(id) || String(item.id) === String(id));
    if (index === -1) return null;
    this.data[index] = { ...this.data[index], ...updates, updatedAt: new Date().toISOString() };
    return this.data[index];
  }

  async findByIdAndDelete(id) {
    const index = this.data.findIndex((item) => String(item._id) === String(id) || String(item.id) === String(id));
    if (index === -1) return null;
    const deletedItem = this.data.splice(index, 1)[0];
    return deletedItem;
  }

  async countDocuments(query = {}) {
    const results = await this.find(query);
    return results.length;
  }
}
