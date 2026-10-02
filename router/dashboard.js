const express=require('express')
const is_token = require('../middleware/is_token')
const adminrole = require('../middleware/status')
const { getDashboard } = require('../controller/dashboard')
const dashboard_route=express.Router()


dashboard_route.get("/dashboard",is_token,adminrole,getDashboard)

module.exports=dashboard_route