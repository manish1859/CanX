const canxattendance = require("../model/attendanceSchema");
const company_setting = require("../model/setting");
const canxemployee = require("../model/user");

const createcanxattendance = async (req, res) => {
  try {
    const { employee, date, status, check_in, check_out, notes } = req.body;

    if (!employee || !date) {
      return res.status(400).json({
        success: false,
        message: "Employee and Date are required",
      });
    }

    const employeeData = await canxemployee.findById(employee).select("_id name");
    if (!employeeData) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    
    const existing = await canxattendance.findOne({ employee, date });
    if (existing) {
      return res.status(400).json({
         success: false, 
         message: "Attendance already marked" 
      });
    }

    const newAttendance = await canxattendance.create({employee,employeeName: employeeData.name,date,status,check_in,check_out,notes,});

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: newAttendance,
    });
  } catch (error) {

    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllcanxattendance = async (req, res) => {
  try {
    const { date } = req.query;

    const filter = {};
    if (date) filter.date = date;

    const attendanceList = await canxattendance
      .find(filter)
      .populate("employee", "name") 
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: attendanceList.length,
      data: attendanceList,
     
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllEmployees = async (req, res) => {
  try {
const employees = await canxemployee.find({ status: "Active" }).select("_id name");
    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active employees found"
      });
    }
 
    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {createcanxattendance,getAllcanxattendance,getAllEmployees,};