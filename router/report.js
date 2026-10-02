const express=require('express')
const is_token = require('../middleware/is_token')
const adminrole = require('../middleware/status')
const { report_attendance, report_total_attendance } = require('../controller/report')
const report_route=express.Router()


report_route.get("/reportname",is_token,adminrole,report_attendance)
report_route.get("/total-attendance",is_token,adminrole,report_total_attendance)


module.exports=report_route