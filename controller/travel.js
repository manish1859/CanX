const travels = require("../model/travel");
const canxemployee = require("../model/user");
const setting = require("../model/setting");

const travel_post = async (req, res) => {
  try {
    const { employee, distance, start_location, end_location, Purpose } = req.body || {};
    if (!employee || !distance || !start_location || !end_location || !Purpose) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
    const emp = await canxemployee.findById(employee).select("name");

    if (!emp) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    const settings = await setting.findOne().sort({ createdAt: -1 });
    const ta_rate = settings?.rate  || 0;
    const ta_amount = distance * ta_rate;
    const travel = await travels.create({employee,employeeName: emp.name,distance,start_location,end_location,Purpose,ta_rate,ta_amount});

    return res.status(201).json({
      success: true,
      message: "Travel log created",
      data: travel
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const travel_userdata = async (req, res) => {
  try {

    const user = await travels.find().sort({ _id: -1 });

    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "user data is not defined"
      });
    }

    const totalDistance = user.reduce((sum, item) => {
      return sum + (Number(item.distance ));
    }, 0);

    const totalEarning = user.reduce((sum, item) => {
      return sum + (Number(item.ta_amount ));
    }, 0);

    const uniqueDays = new Set(
      user.map((item) => item.date?.toISOString().split("T")[0])
    );

    const avgDistance = totalDistance / (uniqueDays.size || 1);

    return res.status(200).json({
      success: true,
      message: user,
      totalDistance: totalDistance,
      totalEarning: totalEarning,
      avgDistance: avgDistance
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "user not defined"
    });
  }
};
const travel_singalname=async(req,res)=>{
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
module.exports = { travel_post,travel_userdata,travel_singalname };