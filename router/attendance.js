// ✅ routes/attendanceRoute.js
const express = require("express");
const is_token = require("../middleware/is_token");
const adminrole = require("../middleware/status");
const {
  createcanxattendance,
  getAllcanxattendance,
  getAllEmployees,
} = require("../controller/attendance");

const attendanceroute = express.Router();

attendanceroute.post("/postattendance", is_token, adminrole, createcanxattendance);
attendanceroute.get("/getattendance", is_token, adminrole, getAllcanxattendance);
attendanceroute.get("/getemployees", is_token, adminrole, getAllEmployees);

module.exports = attendanceroute;