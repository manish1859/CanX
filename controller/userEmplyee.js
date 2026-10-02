const canxemployee = require("../model/user");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

// User Information
const userinformation=async(req,res)=>{
    
    const{name,password,role,email,joindate,status,phone,department,designation,address,basesalary,bankName,accountNumber,ifscCode,panNumber,emergencyContact }=req.body;
    if(name==""||password==""||email==""||joindate==""||status==""||phone==""||department==""||designation==""||address==""||basesalary==""||bankName==""||accountNumber==""||ifscCode==""||panNumber==""||emergencyContact==""){
        return res.status(500).json({
            success:false,
            message:'all field are require'
        })
    }
    
    const exitphone=await canxemployee.findOne({phone})
    // console.log(exitphone)
    if(exitphone){
        console.log('change your number')
        return res.status(500).json({
            success:false,
            message:'This phone number is already there'
        })
    }
    const exitemail=await canxemployee.findOne({email})
    if(exitemail){
        return res.status(400).json({
            success:false,
            message:'This email is already there'
        })
    }
    const userpasswor=await bcrypt.hash(password,10)


const user = await canxemployee.create({name,password: userpasswor,email,joindate,status,phone,department,designation,address,basesalary,role,bankName,accountNumber,ifscCode,panNumber,emergencyContact})
    // console.log(user  )
    return res.status(200).json({
        success:true,
        message:user
    })
     


}

//User Information Get

const userdata = async (req, res) => {
    try {

        const users = await canxemployee.find();

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found'
            })
        }

        return res.status(200).json({
            success: true,
            data: users
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//User Update
const userupdate=async(req,res)=>{
    try {

        const {id}=req.params;
        const user=await canxemployee.findByIdAndUpdate(id,req.body,{new:true})
        return res.status(200).json({
            success:true,
            message:user
        })

    } catch (error) {
        console.log('Not Update your data')
    }
}

//Single userInformation
const userdataById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await canxemployee.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// input Filter

const userfilter = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      const users = await canxemployee.find();
      return res.status(200).json({
        success: true,
        data: users,
      });
    }

    const users = await canxemployee.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
      ],
    });

    
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const userstatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;   

    const user = await canxemployee.findByIdAndUpdate(id,{ status },{ new: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Status not updated",
    });
  }
};


module.exports={userinformation,userdata,userupdate,userdataById,userfilter,userstatus}