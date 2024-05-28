const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const MenuRoutes = require('./routes/MenuRoute')

app.use(cors());
app.use(express.json());

app.use('/api/v1/menu',MenuRoutes.routes);

app.listen(process.env.PORT,()=>{
    console.log("server connected");
})