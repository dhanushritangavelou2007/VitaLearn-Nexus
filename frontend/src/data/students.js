const students = [
  {
    id: 1,
    rollNo: "VIIIA001",

    name: "Aarav Sharma",

    class: "VIII-A",

    gender: "Male",

    dob: "12 Mar 2013",

    bloodGroup: "O+",

    parent: {
      father: "Rajesh Sharma",
      mother: "Priya Sharma",
      phone: "+91 9876543210"
    },

    allergies: [
      "Dust"
    ],

    medicalConditions: [
      "Asthma"
    ],

    vitals: {
      heartRate: 82,
      oxygen: 98,
      temperature: 98.6,
      height: 152,
      weight: 45,
      bmi: 19.5
    },

    vaccinations: [
      {
        name: "COVID Booster",
        status: "Pending"
      },
      {
        name: "MMR",
        status: "Completed"
      }
    ],

    symptoms: [
      {
        date: "4 Jul",
        symptom: "Headache"
      }
    ],

    reports: [
      {
        title: "Annual Health Check",
        status: "Completed"
      }
    ],

    aiSummary:
      "Healthy student with mild asthma. Continue monitoring during sports.",

    risk: "Medium"
  }
];

export default students;