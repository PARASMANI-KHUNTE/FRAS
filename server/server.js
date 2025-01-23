const express = require('express');
const app = express()

const cors = require('cors')
app.use(cors({
  origin: "http://localhost:5173",
}));

const dotenv = require('dotenv')
dotenv.config()

const port = process.env.Port;
app.use(express.json())


const db = require('./config/mongodb')
db()

const adminRoutes = require("./routes/adminRoutes");
const employerRoutes = require("./routes/employerRoutes");
const employeeRoutes = require("./routes/employeeRoutes");

app.use("/api/admin", adminRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/employee", employeeRoutes);

app.get('/test',(req,res)=>{
    res.status(200).send("Server is live")
})





app.listen(port,()=>{
    console.log(`Server is up on http://localhost:${port}`)
})



