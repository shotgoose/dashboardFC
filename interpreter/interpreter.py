# interpret and format sensor data 

def data_export():
    data = {
        "type": "car_update", 
        "car": {
            "rpm": rpm(), "mph": mph(), "coolant_temp": coolant_temp(), "oil_pressure": oil_pressure(),
            "voltage": voltage(), "fuel_level": fuel_level(), "outside_temp": outside_temp(), "mpg": mpg(),
            "odometer": odometer(), "trip": trip(), "range": range(), "runtime": runtime(),
            "illumination": illumination(), "left_turn_signal": left_turn_signal(),
            "right_turn_signal": right_turn_signal(), "hazards": hazards(), "high_beam": high_beam(),
        }
    }
    return data

def rpm():
    return 3242

def mph():
    return 30

def coolant_temp():
    return 86

def oil_pressure():
    return 32

def voltage():
    return 13.8

def fuel_level():
    return 45

def outside_temp():
    return 66

def mpg():
    return 14.2

def odometer():
    return 147994

def trip():
    return 54

def range():
    return 102

def runtime():
    return 200

def illumination():
    return False

def left_turn_signal():
    return False

def right_turn_signal():
    return False

def hazards():
    return False

def high_beam():
    return True