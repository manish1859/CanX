const express=require('express')
const { payroll_post, employee_name, payrolldata, get_payroll } = require('../controller/payroll')
const is_token = require('../middleware/is_token')
const adminrole = require('../middleware/status')
const payroll_route=express.Router()


payroll_route.post("/payrollpost",is_token,adminrole,payroll_post)
payroll_route.get("/payrollname",is_token,adminrole,employee_name)
payroll_route.get("/payrolldata",is_token,adminrole,payrolldata)
payroll_route.get("/payrollget/:employee/:salary_month",is_token,adminrole,get_payroll)

module.exports=payroll_route