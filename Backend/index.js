const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./dbConnect");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const userRouter = require("./routers/userRouter");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
// dotenv.config("./.env");
const cors = require("cors");
const cookieParser = require("cookie-parser");
dotenv.config("./.env");

// cloudinary configuration
cloudinary.config({
  cloud_name: "dvuitztxb",
  api_key: "436733124495695",
  api_secret: "1LML2X3Z3zPxEU41tZ392f3E490",
});

const app = express();

//middlewares
app.use(express.json({ limit: "10mb" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/user", userRouter);
// app.use(bodyParser.json({ limit: "50mb", extended: true }));
// app.use(
//   bodyParser.urlencoded({
//     limit: "50mb",
//     extended: true,
//     parameterLimit: 50000,
//   })
// );
// app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Ok from Server");
});
// const PORT = process.env.PORT || 4001;
const PORT = 4000;
dbConnect();

app.listen(PORT, () => {
  console.log(`Listening on Port : ${PORT}`);
});
