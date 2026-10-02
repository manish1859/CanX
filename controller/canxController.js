const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken');
const canxSchema = require("../model/canxSchema");

const regipost=async(req,res)=>{

    const{name,password,email}=req.body;
    // console.log(req.body)
    if(name==""||password==""||email==""){
        console.log('data invalid')
      return  res.status(500).json({
            success:false,
            message:'Enter Your Field'
        })
    }

    const ab=await canxSchema.findOne({email})
    if(ab){
        console.log('This email is already there, please provide another email')
      return  res.status(500).json({
           success:false,
           message:'This email is already there, please provide another email'})
    }
   const sa= await bcrypt.hash(password,10)
   
         const register=await canxSchema.create({name,password:sa,email})
      return  res.status(200).json({
            success:true,
            message:register
        })
}

const admin=async(req,res)=>{

    const{name,password,email}=req.body;
    // console.log(req.body)
    if(name==""||password==""||email==""){
        console.log('data invalid')
      return  res.status(500).json({
            success:false,
            message:'Enter Your Field'
        })
    }

    const ab=await canxSchema.findOne({email})
    if(ab){
        console.log('This email is already there, please provide another email')
      return  res.status(500).json({
           success:false,
           message:'This email is already there, please provide another email'})
    }
   const sa= await bcrypt.hash(password,10)
   
         const register=await canxSchema.create({name,password:sa,email,role:'admin',status:'active'})
      return  res.status(200).json({
            success:true,
            message:register
        })
}



const loginpost=async(req,res)=>{
    const{password,email}=req.body;
    if(email==''||password==''){
      return  res.status(400).json({
            success:false,
            message:'Enter your field'
        })
    }
    const ac=await canxSchema.findOne({email})
    if(!ac){
     return res.status(404).json({
        success:false,
        message:'Plz first Register'
     })
    }


    const passmatch=await bcrypt.compare(password,ac.password)
    console.log(passmatch)

    if(!passmatch){
        return res.status(404).json({
            success:false,
            message:"wrong password"
        })
    }    
    const payload={
        _id:ac._id
    }
    // const token=jwt.sign(payload,'Seceretkey',{expiresIn:'1m'})
    const token=jwt.sign(payload,'Seceretkey')
    ac.token=token
    await ac.save()
    
    return res.status(200).json({
        success:true,
        message:'welcome,login',
        token
    })
}

const logout=async(req,res)=>{
    const authHeader=req.headers.authorization;
    console.log(authHeader.split(' ')[1]             )
    
    if(!authHeader||!authHeader.startsWith('Bearer')){
        return res.json('token missing')
    }
     
    const newtoken=authHeader.split(' ')[1]
    console.log(newtoken)

    const decoded=await jwt.verify(newtoken,"Seceretkey")
    console.log(decoded)

    const check=await canxSchema.findOne({email:decoded.email})
    console.log(check)


    if(!check){
        return res.json('user already logout or invalid token')
    }

    check.token=null;
    await check.save();
    res.status(200).json({
        success:true,
        message:'logout successfully'
    }) 


}




module.exports={regipost,loginpost,logout,admin}