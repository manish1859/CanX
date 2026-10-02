const { Schema, default: mongoose } = require("mongoose");

const settingSchema=new Schema({
    company_name:{
        type:String,
        require:true
    },
    office_hours:{
        type:Number,
        require:true
    },
    rate:{
        type:Number,
        require:true
    },
    tax_rate:{
        type:String,
        require:true
    }
})

const company_setting=mongoose.model('company_Datails',settingSchema)
module.exports=company_setting