const canxattendance = require("../model/attendanceSchema");
const canxemployee = require("../model/user");
const Travel = require("../model/travel"); 
const company_setting = require("../model/setting");

const report_attendance = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({
        success: false,
        message: "month required",
      });
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // ✅ Attendance
    const attendance = await canxattendance
      .find({
        date: { $gte: startDate, $lt: endDate },
        status: "Present",
      })
      .populate("employee", "department name");

    const deptData = {};

    attendance.forEach((item) => {
      const dept = item.employee?.department || "Unknown";
      deptData[dept] = (deptData[dept] || 0) + 1;
    });

    const departmentReport = Object.keys(deptData).map((key) => ({
      department: key,
      present: deptData[key], // ⚠️ frontend ke liye change
    }));

    // ✅ Travel (Top Traveler)
    const travelData = await Travel.find({
      date: { $gte: startDate, $lt: endDate },
    }).populate("employee", "name");

    const travelMap = {};

    travelData.forEach((item) => {
      const empId = item.employee?._id;
      const name = item.employee?.name || item.employeeName;

      if (!travelMap[empId]) {
        travelMap[empId] = { name, km: 0 };
      }

      travelMap[empId].km += Number(item.distance || 0);
    });

    let topTraveler = null;

    Object.values(travelMap).forEach((emp) => {
      if (!topTraveler || emp.km > topTraveler.km) {
        topTraveler = emp;
      }
    });

    // ✅ Payroll Trend (Last 6 Months)
    const payrollTrend = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(startDate);
      d.setMonth(d.getMonth() - i);

      const mStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1);

      const travelMonth = await Travel.find({
        date: { $gte: mStart, $lt: mEnd },
      });

      const total = travelMonth.reduce((sum, item) => {
        return sum + Number(item.distance || 0);
      }, 0);

      const label = d.toLocaleString("en-GB", { month: "short" });

      payrollTrend.push({
        month: label,
        total: Math.round(total),
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        departmentAttendance: departmentReport,
        topTraveler: topTraveler || {},
        payrollTrend, 
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const report_total_attendance = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({
        success: false,
        message: "Month is required (YYYY-MM)",
      });
    }

    const start = new Date(`${month}-01`);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const totalAttendance = await canxattendance.countDocuments({
      date: { $gte: start, $lt: end },
      status: "Present",
    });

    const travelData = await Travel.find({
      date: { $gte: start, $lt: end },
    });

    const totalDistance = travelData.reduce((sum, item) => {
      return sum + Number(item.distance || 0);
    }, 0);

    const setting = await company_setting.findOne();
    const rate = setting?.rate;

    return res.status(200).json({
      success: true,
      month,
      totalAttendance,
      totalDistance,
      rate,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = { report_attendance,report_total_attendance };