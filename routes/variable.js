module.exports = {

"Main_Circuit" : {
        "voltage":[0],
        "current":[0],
        "PF":[0],
        "KWH":0,
        "frequncy":[0],
        "power":[0]
    },
    "Sub_Circuit" : {
        "voltage":[0],
        "current":[0],
        "PF":[0],
        "KWH":0,
        "frequncy":[0],
        "power":[0]
    },
    "Master_Circuit" : {
        "voltage":[0],
        "current":[0],
        "PF":[0],
        "KWH":0,
        "frequncy":[0],
        "power":[0]
    },
    "Solar_Circuit" : {
        "voltage":[0],
        "current":[0],
        "PF":[0],
        "KWH":0,
        "frequncy":[0],
        "power":[0]
    },
    "timestep":[0],
    
    "switch":{
        "solarShift":false,
        "main_board":true,
        "master_circuit":true,
        "sub_circuit":true,
        "reset_seal":false,
        "trip":false,
    },
    "seal":false,
    "pre_seal_state":false,
    "max_power":1000,
    "max_power_state":0
}