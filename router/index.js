const express = require('express');
const route = require('./router');
const userroute = require('./user');
const attendanceroute = require('./attendance');
const leave_router = require('./leaverouter');
const settingroute = require('./setting');
const travelroute = require('./travel');
const payroll_route = require('./payroll');
const report_route = require('./report');
const dashboard_route = require('./dashboard');
const router = express.Router();



router.use(route);
router.use(userroute);
router.use(attendanceroute);
router.use(leave_router);
router.use(settingroute);
router.use(travelroute);
router.use(payroll_route);
router.use(report_route);
router.use(dashboard_route);


module.exports = router;