// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    enum: ["student"], // Add any other roles you may need
    default: "student",
  },
  schoolId: {
    type: String,
    required: true,
  },
  studentClass: {
    type: String,
    required: true,
  },
  parentName: {
    type: String,
    required: true,
  },
  parentNumber: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  timeZone: {
    type: String,
    required: false,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiry: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["active", "inactive"], // Add any other status you may need
    default: "active",
  },
}).set("timestamps", true);

const User = mongoose.model("User", userSchema);

module.exports = User;
