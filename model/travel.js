const mongoose = require("mongoose");
const { Schema } = mongoose;

const TravelSchema = new Schema(
  {
 
    employee: {
      type: Schema.Types.ObjectId,
      ref: "canxEmployee", 
      required: true,
    },
    employeeName: {
     type: String, 
     required: true
    },

    date: { 
      type: Date, 
      default:Date
    }, 
    distance:{
        type:Number,
        require:true
    },
    start_location:{
        type:String,
        require:true
    },
    end_location:{
        type:String,
        require:true
    },
    ta_rate:{
     type:Number,
     required:true
    },

    Purpose: {
     type: String, 
     require:true
    },
    ta_amount:{
      type:Number,
      require:true
    }
  },
  { timestamps: true }
);


const travels = mongoose.model("travel", TravelSchema);
module.exports = travels;