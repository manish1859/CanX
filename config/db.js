const mongoose=require('mongoose');

const connect=async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/canx")
        console.log('database run')
    } catch (error) {
        console.log(error)
    }
}

module.exports=connect