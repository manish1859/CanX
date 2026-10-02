// const express=require('express');
// const connect = require('./config/db');
// const app=express();
// const cors = require('cors');
// const router = require('./router');

// const port=4005;


// app.use(cors())
// app.use(express.json())
// app.use('/api',router)


// const server=async()=>{
//     try {
//         await connect()
//         app.listen(port,()=>{
//             console.log(`port is run ${port}`)
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }
// server()

 

const express = require("express");
const cors = require("cors");
const connect = require("./config/db");
const router = require("./router");

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;

app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      await connect();
      isConnected = true;
    }
    next();
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.use("/api", router);

module.exports = app;