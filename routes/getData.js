const express = require('express')
const routes = express.Router();
const variable = require("./variable");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: 'mukeshvaghani358@gmail.com',
      pass: 'yvce ztab faym zvyw' // Use App Password if 2FA is enabled
    }
});

const mailOptions = {
    from: "Smart Board",
    to: '22eedar144@ldce.ac.in',
    subject: '🚨 Security Breach Alert: Unauthorized Access Detected',
    html: `... same HTML from your code ...`
};

// helper function: push with auto-limit 30
function pushWithLimit(arr, value, limit = 30) {
    arr.push(value);
    if (arr.length > limit) {
        arr.shift();
    }
}

function getCurrentSecondOfDay() {
    const now = new Date();
    const seconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    return seconds;
}

routes.post("/add",(req,res)=> {
    let data = req.body
    console.log(data);

    // Main Circuit
    pushWithLimit(variable.Main_Circuit.voltage, data.Main_Circuit.voltage);
    pushWithLimit(variable.Main_Circuit.current, data.Main_Circuit.current);
    pushWithLimit(variable.Main_Circuit.PF, data.Main_Circuit.PF);
    variable.Main_Circuit.KWH = data.Main_Circuit.KWH;
    pushWithLimit(variable.Main_Circuit.power, data.Main_Circuit.power);
    pushWithLimit(variable.Main_Circuit.frequncy, data.Main_Circuit.frequncy);

    // Sub Circuit
    pushWithLimit(variable.Sub_Circuit.voltage, data.Sub_Circuit.voltage);
    pushWithLimit(variable.Sub_Circuit.current, data.Sub_Circuit.current);
    pushWithLimit(variable.Sub_Circuit.PF, data.Sub_Circuit.PF);
    variable.Sub_Circuit.KWH = data.Sub_Circuit.KWH;
    pushWithLimit(variable.Sub_Circuit.power, data.Sub_Circuit.power);
    pushWithLimit(variable.Sub_Circuit.frequncy, data.Sub_Circuit.frequncy);

    // Master Circuit
    pushWithLimit(variable.Master_Circuit.voltage, data.Master_Circuit.voltage);
    pushWithLimit(variable.Master_Circuit.current, data.Master_Circuit.current);
    pushWithLimit(variable.Master_Circuit.PF, data.Master_Circuit.PF);
    variable.Master_Circuit.KWH = data.Master_Circuit.KWH;
    pushWithLimit(variable.Master_Circuit.power, data.Master_Circuit.power);
    pushWithLimit(variable.Master_Circuit.frequncy, data.Master_Circuit.frequncy);

    // Solar Circuit
    pushWithLimit(variable.Solar_Circuit.voltage, data.Solar_Circuit.voltage);
    pushWithLimit(variable.Solar_Circuit.current, data.Solar_Circuit.current);
    pushWithLimit(variable.Solar_Circuit.PF, data.Solar_Circuit.PF);
    pushWithLimit(variable.Solar_Circuit.power, data.Solar_Circuit.power);
    pushWithLimit(variable.Solar_Circuit.frequncy, data.Solar_Circuit.frequncy);

    if(variable.switch.solarShift == true) {
        variable.Solar_Circuit.KWH = data.Main_Circuit.KWH;
    }

    // timestep
    pushWithLimit(variable.timestep, getCurrentSecondOfDay());

    // seal
    variable.seal = data.seal;
    if(variable.seal == true && variable.pre_seal_state == false) {
        console.log("Main sent");
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log('Error:', error);
            }
            console.log('Email sent:', info.response);
        });
        variable.pre_seal_state = true;
    }
    else if(variable.seal == 0) {
        variable.pre_seal_state = false;
    }

    // Max power check
    if((data.Main_Circuit.power > variable.max_power) && variable.max_power_state == 0) {
        console.log("I am entered");
        let mail = {
            from: "Smart Board",
            to: '22eedar144@ldce.ac.in',
            subject: '🚨 MAX power demand Reached',
            html: `... your max power email HTML ...`
        };
       
        transporter.sendMail(mail, (error, info) => {
            if (error) {
                return console.log('Error:', error);
            }
            console.log('Email sent:', info.response);
        });
        variable.max_power_state = 1;
    } 
    else if(data.Main_Circuit.power < variable.max_power) {
        variable.max_power_state = 0;
    }

    res.status(200).json(variable.switch);
})

routes.get("/get",(req,res)=> {
    res.status(200).json(variable);
})

routes.post("/switch",(req,res)=> {
    let data = req.body;
    console.log(data);

    variable.switch.trip = false;
    variable.switch.solarShift = data.Power_Source;
    variable.switch.main_board = data.Entire_Board;
    variable.switch.sub_circuit = data.Sub_Circuit;
    variable.switch.master_circuit = data.Main_Circuit;
    variable.switch.reset_seal = data.reset_seal;

    res.status(200).json({"status":"OK"});
})

module.exports = routes;
