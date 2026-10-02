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

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend is live 🚀"
  });
});

app.get("/test", (req, res) => {
  res.json({
    message: "API working"
  });
});

module.exports = app;