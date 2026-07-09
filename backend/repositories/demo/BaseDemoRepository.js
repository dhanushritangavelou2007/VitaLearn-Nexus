export default class BaseDemoRepository {
  constructor(initialData = []) {
    this.data = initialData;
    this.idCounter = this.data.length + 1;
  }

  async find(query = {}) {
    return this.data.filter((item) => {
      for (const [key, value] of Object.entries(query)) {
        if (key === "$or") {
          const matched = value.some((condition) => {
            return Object.entries(condition).every(([k, v]) => {
              if (v instanceof RegExp) {
                return v.test(item[k]);
              }
              return item[k] === v;
            });
          });

          if (!matched) return false;
        } else if (value instanceof RegExp) {
          if (!value.test(item[key])) return false;
        } else {
          const itemValue = key.includes('.') ? key.split('.').reduce((acc, part) => acc && acc[part], item) : item[key];
          if (itemValue !== value) return false;
        }
      }

      return true;
    });
  }

  async findOne(query = {}) {
    const results = await this.find(query);
    return results.length ? results[0] : null;
  }

  async findOneWithPassword(query = {}) {
    return this.findOne(query);
  }

  async findById(id) {
    return (
      this.data.find(
        (item) =>
          String(item._id) === String(id) ||
          String(item.id) === String(id)
      ) || null
    );
  }

  async create(payload) {
    const id = `demo-${this.idCounter++}`;

    const newItem = {
      _id: id,
      id: id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...payload,
    };

    this.data.unshift(newItem);

    return newItem;
  }

  async findByIdAndUpdate(id, updates) {
    const index = this.data.findIndex(
      (item) =>
        String(item._id) === String(id) ||
        String(item.id) === String(id)
    );

    if (index === -1) return null;

    this.data[index] = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.data[index];
  }

  async findByIdAndDelete(id) {
    const index = this.data.findIndex(
      (item) =>
        String(item._id) === String(id) ||
        String(item.id) === String(id)
    );

    if (index === -1) return null;

    return this.data.splice(index, 1)[0];
  }

  async countDocuments(query = {}) {
    const results = await this.find(query);
    return results.length;
  }

  async aggregate() {
    return [];
  }
}