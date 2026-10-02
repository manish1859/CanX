const { Schema, default: mongoose } = require("mongoose");

const leve_schema=new Schema({
    employee:{
        type:Schema.Types.ObjectId,
        ref:"canxEmployee",
        require:true
    },
    employeeName:{
        type:String,
        require:true
    },
    leave_type:{
        type:String,
        enum:['Sick Leave','Casual Leave','Earned Leave','Maternity','Paternity','Unpaid','Emergency Leave',"Work From Home"],
        require:true
    },
    status:{
        type:String,
        enum:['Pending','Approved','Rejected'],
        default:'Pending'
    },
    start_date:{
        type:String,
        default:Date
    },
    end_date:{
        type:String,
        require:true
    },
    reason:{
        type:String,
        require:true
    },
    reject_reason:{
        type:String,
        default:""
    },
    admin_name:{
        type:String,
        require:true
    }
})

const leave=mongoose.model('leave_managment',leve_schema)
module.exports=leave