const express=require('express');
const adminrole = require('../middleware/status');
const is_token = require('../middleware/is_token');
const { company_datails, company_data, data_update } = require('../controller/setting');
const settingroute=express.Router()

settingroute.post('/company_datails',is_token,adminrole,company_datails);
settingroute.get('/company_data',is_token,adminrole,company_data);
settingroute.put('/data_update/:id',is_token,adminrole,data_update);

module.exports=settingroute