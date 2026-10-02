const { Schema, default: mongoose } = require("mongoose");

const canx=new Schema({
      name:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    token:{
        type:String,
        default:null
     },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        default:null
    },
    joindate:{
        type:Date,
        default:Date,
    },
    status:{
        type:String,
        enum:['Active','Inactive','OnLeave '],
        default:'Active'
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user'
    },
    department:{
        type:String,
        default:null
    },
    designation:{
        type:String,
        default:null
    },
    basesalary:{
        type:Number,
        default:0
    },
    address:{
        type:String,
        default:null
    },
    bankName:{
        type:String,
        default:null
    },
    
    accountNumber:{
        type:Number,
        default:null
    },
ifscCode: {
  type: String,
  trim: true,
  uppercase: true,
  match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"],
  default: null,
},

panNumber: {
  type: String,
  trim: true,
  uppercase: true,
  match: [/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number format"],
  default: null,
},

emergencyContact: {
  type: String,
  trim: true,
  uppercase: true,
  match: [/^[0-9]{10}$/, "Emergency contact must be 10 digits"],
  default: null,
},
    emergencyContact:{
        type:Number,
        default:null
    },

})
const canxemployee=mongoose.model('canxEmployee',canx)
module.exports=canxemployee