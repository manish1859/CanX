const mongoose = require("mongoose");
const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
 
    employee: {
      type: Schema.Types.ObjectId,
      ref: "canxEmployee", 
      required: true,
    },
    employeeName: { type: String, required: true },

    date: { type: Date, required: true }, 

    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day", "On Leave"],
      default: "Present",
    },
    check_out: { 
      type:String,
      default: null 
    },
    check_in: { type: String, default: null },
    notes: { type: String, default: null },
  },
  { timestamps: true }
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

const canxattendance = mongoose.model("Attendance", attendanceSchema);
module.exports = canxattendance;