import { isDBConnected } from "../config/db.js";
import mongoose from "mongoose";

// Import all models to ensure they are registered
import "../models/User.js";
import "../models/Student.js";
import "../models/Teacher.js";
import "../models/Doctor.js";
import "../models/Parent.js";
import "../models/Admin.js";
import "../models/Report.js";
import "../models/Notification.js";
import "../models/Appointment.js";
import BaseDemoRepository from "./demo/BaseDemoRepository.js";

// Import demo data to seed the demo repositories
import { DEMO_USERS } from "../utils/constants.js";

class BaseDBRepository {
  constructor(modelName) {
    this.modelName = modelName;
  }
  
  get model() {
    return mongoose.models[this.modelName];
  }

  async find(query = {}, sort = { createdAt: -1 }, skip = 0, limit = 0) {
    let q = this.model.find(query).sort(sort);
    if (skip) q = q.skip(skip);
    if (limit) q = q.limit(limit);
    return q;
  }

  async findOne(query = {}) {
    return this.model.findOne(query);
  }

  async findOneWithPassword(query = {}) {
    return this.model.findOne(query).select("+password");
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async create(payload) {
    return this.model.create(payload);
  }

  async findByIdAndUpdate(id, updates) {
    return this.model.findByIdAndUpdate(id, updates, { new: true });
  }

  async findByIdAndDelete(id) {
    return this.model.findByIdAndDelete(id);
  }

  async countDocuments(query = {}) {
    return this.model.countDocuments(query);
  }

  async aggregate(pipeline) {
    return this.model.aggregate(pipeline);
  }
}

// Extend BaseDemoRepository for index.js usage
class ExtendedDemoRepository extends BaseDemoRepository {
  async findOneWithPassword(query = {}) {
    const results = await this.find(query);
    return results.length > 0 ? results[0] : null;
  }
}

// In-memory singletons for demo mode
const demoRepositories = {};

function initDemoRepositories() {
  const seedStudents = [
    {
      _id: "demo-student-1",
      id: "demo-student-1",
      rollNo: "8A01",
      name: "Aarav Sharma",
      class: "VIII-A",
      className: "VIII",
      section: "A",
      gender: "Male",
      dob: "2010-04-15",
      bloodGroup: "O+",
      parent: { name: "Rajesh Sharma", contact: "+91-9876543210", email: "rajesh.s@example.com" },
      allergies: ["Dust"],
      medicalConditions: ["Mild Asthma"],
      vitals: { height: "155 cm", weight: "45 kg", bmi: 18.7, vision: "6/6", bloodPressure: "110/70", heartRate: "78", temperature: "98.4" },
      vaccinations: ["BCG", "OPV", "COVID-19", "MMR"],
      symptoms: ["Occasional cough"],
      reports: [],
      risk: "observation",
      attendance: "96%",
      lastUpdate: "Today",
      passportStatus: "Completed",
    },
  ];

  demoRepositories["User"] = new ExtendedDemoRepository(
    DEMO_USERS.map((u, i) => ({ _id: `demo-user-${i}`, id: `demo-user-${i}`, ...u }))
  );
  demoRepositories["Student"] = new ExtendedDemoRepository([...seedStudents]);
  demoRepositories["Report"] = new ExtendedDemoRepository([
    {
      _id: "demo-report-1",
      student: "demo-student-1",
      type: "General Checkup",
      status: "Normal",
      date: "2024-01-15",
      risk: "observation",
    }
  ]);
  demoRepositories["Notification"] = new ExtendedDemoRepository([]);
  demoRepositories["Appointment"] = new ExtendedDemoRepository([]);
  demoRepositories["Teacher"] = new ExtendedDemoRepository([]);
  demoRepositories["Doctor"] = new ExtendedDemoRepository([]);
  demoRepositories["Parent"] = new ExtendedDemoRepository([]);
  demoRepositories["Admin"] = new ExtendedDemoRepository([]);
}

initDemoRepositories();

export function getRepository(modelName) {
  if (isDBConnected()) {
    return new BaseDBRepository(modelName);
  } else {
    return demoRepositories[modelName];
  }
}
