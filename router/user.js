const express = require('express');
const is_token = require('../middleware/is_token');
const adminrole = require('../middleware/status');
const { userinformation, userdata, userupdate, userdataById, userfilter, userstatus } = require('../controller/userEmplyee');
const userroute = express.Router();

userroute.post('/canxemplyess',is_token,adminrole,userinformation);
userroute.get('/employeedata',is_token,adminrole,userdata);
userroute.put('/userupdate/:id',userupdate);
userroute.get('/usersingledata/:id',is_token,adminrole,userdataById);
userroute.get("/userfilter", is_token, adminrole, userfilter);
userroute.put('/userstatus/:id',userstatus);

// console.log(userdata)

module.exports = userroute;