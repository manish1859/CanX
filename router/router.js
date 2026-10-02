const express=require('express')
const { regipost, loginpost, logout, admin } = require('../controller/canxController')
const adminrole = require('../middleware/status')
const is_token = require('../middleware/is_token')
const route=express.Router()

route.post('/canxregister',regipost)
route.post('/canxlogin',loginpost)
route.delete('/canxlogout',logout)
route.post('/canxadmin',admin)

module.exports=route