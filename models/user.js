const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  register_number: { type: String, required: true },
  name: { type: String, required: true },
  dept: { type: String, required: true },
  phone: { type: String, required: false },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Student", studentSchema);
