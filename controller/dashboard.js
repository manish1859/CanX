const Employee = require("../model/user");
const Attendance = require("../model/attendanceSchema");
const Travel = require("../model/travel");
const Leave = require("../model/LeaveSchema");
const Setting = require("../model/setting");

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const getMonthStartAndEnd = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  return { startDate, endDate };
};

const getLast7Days = () => {
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const date = d.toISOString().split("T")[0];
    const day = d.toLocaleString("en-US", { weekday: "short" });

    days.push({ date, day });
  }

  return days;
};

const getDashboard = async (req, res) => {
  try {
    const today = getTodayDate();
    const { startDate, endDate } = getMonthStartAndEnd();

    // 1. total employees
    const totalEmployees = await Employee.countDocuments({
      status: { $in: ["active", "Active", "on leave", "On Leave"] },
    });

    // 2. present today
    const presentToday = await Attendance.countDocuments({
      date: today,
      status: "Present",
    });

    // 3. on leave
    const onLeave = await Attendance.countDocuments({
      status: { $in: ["on leave", "On Leave"] },
    });

    // 4. total km this month
    const monthlyTravels = await Travel.find({
      date: { $gte: startDate, $lte: endDate },
    }).select("distance");

    let totalKm = 0;
    monthlyTravels.forEach((item) => {
      totalKm += Number(item.distance) || 0;
    });

    // 4.1 total TA this month
    const setting = await Setting.findOne().sort({ createdAt: -1 });
    const rate = Number( setting?.rate || 0);
    const totalTA = totalKm * rate;

    // 5. attendance trend last 7 days
// 5. attendance trend last 7 days
    const last7Days = getLast7Days();
    const startDateRange = last7Days[0].date;
    const endDateRange = last7Days[last7Days.length - 1].date;

    const allAttendance = await Attendance.find({
      date: {
        $gte: startDateRange,
        $lte: endDateRange,
      },
      status: "Present",
    }).select("date");

    const attendanceTrend = last7Days.map((dayItem) => {
      // Filter karte waqt hum dono dates ko string mein convert karke match karenge
      const count = allAttendance.filter((a) => {
        // Agar DB mein date string hai to direct compare hoga, 
        // agar Date object hai to toISOString use karke split karenge
        const dbDate = a.date instanceof Date ? a.date.toISOString().split("T")[0] : a.date;
        return dbDate === dayItem.date;
      }).length;

      return {
        day: dayItem.day,
        present: count,
      };
    });
    // 6. department distribution
    const employees = await Employee.find({
      status: { $in: ["active", "Active", "on leave", "On Leave"] },
    }).select("department");

    let deptMap = {};

    employees.forEach((emp) => {
      const department = emp.department || "Unknown";

      if (!deptMap[department]) {
        deptMap[department] = 0;
      }

      deptMap[department] += 1;
    });

    const departmentDistribution = Object.keys(deptMap).map((department) => ({
      name: department,
      value: deptMap[department],
    }));

    // 7. recent check-ins
    const recentCheckins = await Attendance.find({
      date: today,
      check_in: { $ne: "" },
    })
      .populate("_id", "name department")
      .select("_id employeeName check_in status")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentCheckInData = recentCheckins.map((item) => ({
      name: item?._id?.name || item?.employeeName || "Unknown",
      department: item?._id?.department || "",
      check_in: item.check_in || "",
      status: item.status || "",
    }));

    // 8. pending leave requests
    const pendingLeaves = await Leave.find({
      status: "Pending",
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("employeeName leave_type leave start_date end_date reason status");

    const pendingLeaveData = pendingLeaves.map((item) => ({
      name: item.employeeName || "",
      leave_type: item.leave_type || item.leave || "",
      startDate: item.start_date || "",
      endDate: item.end_date || "",
      reason: item.reason || "",
      status: item.status || "",
    }));

    return res.status(200).json({
      success: true,
      message: "Dashboard fetched successfully",
      data: {
        cards: {
          totalEmployees,
          presentToday,
          onLeave,
          totalKm,
          totalTA,
        },
        attendanceTrend,
        departmentDistribution,
        recentCheckins: recentCheckInData,
        pendingLeaves: pendingLeaveData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getDashboard };