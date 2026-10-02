const express=require('express');
const adminrole = require('../middleware/status');
const is_token = require('../middleware/is_token');
const { travel_post, travel_singalname, travel_userdata } = require('../controller/travel');
const travelroute=express.Router()

travelroute.post('/traveldatails',is_token,adminrole,travel_post);
travelroute.get('/travelsingalename',is_token,adminrole,travel_singalname);
travelroute.get('/travelusers',is_token,adminrole,travel_userdata);


module.exports=travelroute