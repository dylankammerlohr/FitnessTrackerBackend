require("dotenv").config()
const express = require("express")
// const { client } =require("./db/index")
const cors = require("cors");
const app = express()
const morgan = require('morgan')
const apiRouter =require("./api")

app.use(cors());
app.use(morgan('dev'))
app.use(express.json())
app.use("/api", apiRouter)



module.exports = app;
// Setup your Middleware and API Router here
