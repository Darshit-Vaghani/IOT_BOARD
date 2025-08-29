const express = require("express");
const path = require("path");
const bodyparser = require("body-parser")
const Data = require("./routes/getData")
const variable = require("../IoT Enable Smart Distribution Board/routes/variable")


  

const app = express();

app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/page_1", (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
 app.get("/page_2", (req, res, next) => {
     res.sendFile(path.join(__dirname, 'public', 'analysis.html'));
 });

 app.post("/trip",(req,res)=> {

    let data = req.body
 console.log(data);
    variable.switch.main_board = data.main_board
    variable.switch.master_circuit = data.master
    variable.switch.sub_circuit = data.sub
    variable.switch.trip= true;
    res.status(200).json({"status":"Triping data are set"});

 })

 app.post("/update_max_value",(req,res)=> {
    console.log("update power");
    variable.max_power = req.body.max_power;
    res.status(200).json({"status":"ok"});
 })
app.use("/Data",Data);

module.exports = app;
