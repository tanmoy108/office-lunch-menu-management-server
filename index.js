const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const MenuRoutes = require("./routes/MenuRoute");
const UploadRoutes = require("./routes/UploadRoute");
const AuthRoutes = require("./routes/AuthRoute")
const CheckRoutes = require("./routes/CheckRoute")
const VerifyTokenRoutes =require("./routes/VerifyTokenRoute");
const UserRoutes = require("./routes/UserRoute")
require("dotenv").config();
const app = express();
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// allow cross-origin requests
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", 
//       "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.use("/api/v1/menu", MenuRoutes.routes);
app.use("/api/v1/upload", UploadRoutes.routes);
app.use("/api/v1/auth",AuthRoutes.routes);
app.use("/api/v1/check",CheckRoutes.routes);
app.use("/api/v1/verifytoken",VerifyTokenRoutes.routes)
app.use("/api/v1/user",UserRoutes.routes)

app.listen(process.env.PORT, () => {
  console.log("server connected");
});
