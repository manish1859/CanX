  const canxattendance = require("../model/attendanceSchema");
  const payrolls = require("../model/payroll");
  const canxemployee = require("../model/user");
  const travelModel = require("../model/travel");
  const company_setting = require("../model/setting");

  const payroll_post = async (req, res) => {
    try {
      const { employee, salary_month, bonus, deducation,status } = req.body;

      if (!employee || !salary_month) {
        return res.status(400).json({
          success: false,
          message: "Employee and month required",
        });
      }

      const empl = await canxemployee.findById(employee).select("name basesalary");

      if (!empl) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      const start = new Date(salary_month);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      const data = await canxattendance.find({
        employee: employee,
        status: "Present",
        date: {$gte: start,$lt: end}
      });

      const presentCount = data.length;
      console.log("Found Attendance Records:", presentCount);

      const travelData = await travelModel.find({employee,date: { $gte: start, $lt: end },});

      const totalDistance = travelData.reduce((sum, item) => {
        return sum + Number(item.distance || 0);
      }, 0);

      const setting = await company_setting.findOne().select("rate");
      const ratePerKm = setting.rate;
      const travelAllowance = totalDistance * ratePerKm;

      const perDaySalary = empl.basesalary ;

      const finalSalary = perDaySalary +travelAllowance +Number(bonus || 0) -
        Number(deducation );

      const payroll = await payrolls.create({
        employee,
        employeeName: empl.name,
        salary_month,
        paresent_day: presentCount,
        travel_allowance: travelAllowance,
        bonus,
        deducation,
        employee_basesalry:empl.basesalary,
        payrollsalary:finalSalary ,
        status
      });

      return res.status(200).json({
        success: true,
        message: payroll,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

  const employee_name = async (req, res) => {
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

  const payrolldata = async (req, res) => {
    const payrollemployee = await payrolls.find();

    if (payrollemployee.length === 0) {
      return res.status(404).json({
        success: false,
        message: "employee data not found",
      });
    }

    const grosssalary = payrollemployee.reduce((sum, item) => {
      return sum + Number(item.payrollsalary || 0);
    }, 0);

    const totalDeduction = payrollemployee.reduce((sum, item) => {
      return sum + Number(item.deducation || 0);
    }, 0);

    const netSalary = grosssalary - totalDeduction;



    return res.status(200).json({
      success: true,
      message: payrollemployee,
      grosssalary:grosssalary,
      totalDeduction:totalDeduction,
      netSalary:netSalary
    });
  };
const get_payroll = async (req, res) => {
  try {
    const { employee, salary_month } = req.params;

    const empl = await canxemployee.findById(employee).select("name basesalary");
    if (!empl) return res.status(404).json({ success: false, message: "Employee not found" });

    const start = new Date(salary_month);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const data = await canxattendance.find({
      employee: employee,
      status: "Present",
      date: { $gte: start, $lt: end }
    });
    const presentCount = data.length;

    const travelData = await travelModel.find({ employee: employee, date: { $gte: start, $lt: end } });
    const totalDistance = travelData.reduce((sum, item) => sum + Number(item.distance || 0), 0);
    
    const setting = await company_setting.findOne().select("rate");
    const travelAllowance = totalDistance * (setting?.rate || 0);

    const workingDays = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();

    return res.status(200).json({
      success: true,
      data: {
        presentCount,
        workingDays,
        travelAllowance,
        baseSalary: empl.basesalary,
        employeeName: empl.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
  module.exports = { payroll_post,employee_name,payrolldata ,get_payroll};