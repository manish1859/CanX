const { Schema, default: mongoose } = require("mongoose");

const payrollSchema=new Schema({
    
        employee:{
            type:Schema.Types.ObjectId,
            ref:"canxEmployee",
            require:true
        },
        employeeName:{
            type:String,
            require:true
        },
        salary_month:{
            type:String,
            require:true
        },
        bonus:{
            type:Number,
            default:0
        },
        deducation:{
            type:Number,
            default:0            
        },
        payrollsalary:{
           type:Number,
           default:0
        },
        status:{
           type:String,
           enum:["draft","final"],
           default:"draft"
        },
        paresent_day: {
           type: Number,
           default: 0
        },
        travel_allowance: {
           type: Number,
           default: 0
        },
        employee_basesalry:{
            type:Number,
            default:0
            
        },
    
},{ timestamps: true })
// payrollSchema.index({ employee: 1, salary_month: 1 },{ unique: true });

const payrolls=mongoose.model('employee_payroll',payrollSchema)
module.exports=payrolls