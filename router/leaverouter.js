const express=require('express')
const is_token = require('../middleware/is_token')
const adminrole = require('../middleware/status')
const { leave_post, leave_singalname, leave_userdata, leave_update, leave_singaluser, count } = require('../controller/Leave')
const leave_router=express.Router()

leave_router.post('/leavepost',is_token,adminrole,leave_post)
leave_router.get('/leavesingalname',is_token,adminrole,leave_singalname)
leave_router.get('/leaveuserdata',is_token,adminrole,leave_userdata)
leave_router.put('/userstatusupdate/:id',leave_update)
leave_router.get('/usersingleuser/:id',is_token,adminrole,leave_singaluser)

module.exports=leave_router