const mongoose=require('mongoose');

const connect=async()=>{
    try {
        await mongoose.connect("mongodb+srv://gajanandyadav0066:*****@cluster0.q29tedg.mongodb.net/?appName=project_inquiry")
        console.log('database run')
    } catch (error) {
        console.log(error)
    }
}

module.exports=connect