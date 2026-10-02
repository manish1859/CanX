const canxattendance = require("../model/attendanceSchema");
const canxSchema = require("../model/canxSchema");
const leave = require("../model/LeaveSchema");
const canxemployee = require("../model/user");

const leave_post = async (req, res) => {
  try {
    const { employee, leave_type, status, start_date, end_date, reason } = req.body;

    if (!employee || !leave_type || !status || !start_date || !end_date || !reason) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    // const today = new Date();

    if (end < start) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date"
      });
    }

    const emp = await canxemployee.findById(employee).select("name");

    if (!emp) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    const admin = await canxSchema.findById(req.user.id);

    const alreadyLeave = await leave.findOne({employee,start_date});

     if (alreadyLeave) {
       return res.status(400).json({
       success: false,
       message: "You have already applied leave for this date"
      });
     }

    const leavecreate = await leave.create({
      employee,
      employeeName: emp.name,
      leave_type,
      status,
      start_date,
      end_date,
      reason,
      admin_name:admin.name
    });

    await canxattendance.findOneAndUpdate(
      { employee, date: start_date },
      { employeeName: emp.name, status: "On Leave" },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      data: leavecreate
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "leave post api not work"
    });
  }
};
const leave_userdata=async(req,res)=>{
    try {
        const user=await leave.find().populate("employee", "name").sort({_id:-1})
        if(!user||user.length==0){
            return res.status(404).json({
                success:false,
                message:"user data is not defined"
            })
        }
        return res.status(200).json({
            success:true,
            message:user
        })
    } catch (error) {
        return res.status(404).json({
            success:false,
            message:"user not define"
        })
    }
}
const leave_singalname=async(req,res)=>{
    try {
        
        const singal_name=await canxemployee.find({status:'Active'}).select('_id name')
        if(!singal_name){
            return res.status(404).json({
                success:false,
                message:"not getting name from id"
            })
        }
        return res.status(200).json({
            success:true,
            message:singal_name
        })
    } catch (error) {
        return res.status(404).json({
            success:false,
            message:error.message
        })
    }
}

const leave_update = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;
    console.log("aaaa",id,status);
    

    const data = await leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Leave not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: data
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const leave_singaluser=async(req,res)=>{
    const {id}=req.params;
    const single_user=await leave.findById(id);
    if(!single_user){
        return res.status(404).json({
            success:false,
            message:'user data not found'
        })
    }
    return res.status(200).json({
        success:true,
        message:single_user
    })
}




module.exports={leave_post,leave_userdata,leave_singalname,leave_update,leave_singaluser}
