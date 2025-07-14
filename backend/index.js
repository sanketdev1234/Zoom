if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
    }
const express=require("express");
const { createServer } = require('node:http');

const mongoose=require("mongoose");
const cors=require("cors");
const path=require("path");
const cookieParser=require("cookie-parser");
const  SocketController  = require('./Controller/SockeioController').SocketController;

const app=express();

const server = createServer(app);

const port=process.env.PORT || 8080;
const dburl=process.env.ATLAS_URL;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(cookieParser());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname)));

const io=SocketController(server);

main()
.then(() => {
    console.log("connection successful");
})
.catch((err) => console.log(err));

//   // connecting the mongo db with the localhost
async function main() {
await mongoose.connect("mongodb://localhost:27017/Zoom");
}


// // connecting the mongo database with the mongoatlas cloud servive
// async function main() {
//   await mongoose.connect(dburl);
// }

server.listen(port, () => {
console.log(`server running at ${port}`);
});


app.get("/", (req, res) => {
    res.send("Hello i am the root route");
});
