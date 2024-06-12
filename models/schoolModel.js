// models/User.js
const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"], // Add any other status you may need
    default: "active",
  },
}).set("timestamps", true);

schoolSchema.statics.createDefaultSchool = async function () {
  try {
    const existingSchool = await this.findOne({});

    console.log(existingSchool);

    if (!existingSchool) {
      // Define default schools
      const defaultSchools = [
        { schoolName: "Gurukul School", status: "active" },
        { schoolName: "Indus Valley Public School", status: "active" },
        { schoolName: "Kaveri Public School", status: "active" },
        { schoolName: "Indore Public School", status: "active" },
        { schoolName: "G.D.Goenka Public School", status: "active" },
      ];

      // Save each default school
      for (const schoolData of defaultSchools) {
        const school = new this(schoolData);
        await school.save();
      }

      console.log("Default schools added successfully!");
    }
  } catch (error) {
    console.error("Error creating default school:", error);
  }
};

schoolSchema.pre("save", async function (next) {
  next();
});

const School = mongoose.model("school", schoolSchema);

module.exports = School;
School.createDefaultSchool();
