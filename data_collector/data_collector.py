# format, send, and log sensor data
import os, csv
from datetime import datetime

# file name for log
date_time = datetime.now().strftime("%Y-%m-%d_%I-%M-%S-%p")
filename = "log_" + date_time + ".csv"

# file path to log
current_dir = os.path.dirname(os.path.abspath(__file__))
log_dir = os.path.join(current_dir, "logs")
os.makedirs(log_dir, exist_ok=True)
full_path = os.path.join(log_dir, filename)

# buffer
buffer = []
BUFFER_LIMIT = 50

# log timer
fetch_count = 0
LOG_EVERY = 6

# stable column order for CSV
COLUMNS = [
    "time", "rpm", "mph", "coolant_temp", "oil_pressure", "voltage",
    "fuel_level", "mpg", "odometer", "trip", "range", "runtime",
    "illumination", "left_turn_signal", "right_turn_signal", "hazards",
    "high_beam", "roof_down",
]

def need_header(path: str) -> bool:
    """Write header if file is missing or empty."""
    return (not os.path.exists(path)) or (os.path.getsize(path) == 0)

# export car data
def fetch():
    global fetch_count
    fetch_count += 1
    car = {
        "rpm": rpm(), "mph": mph(), "coolant_temp": coolant_temp(), "oil_pressure": oil_pressure(),
        "voltage": voltage(), "fuel_level": fuel_level(), "mpg": mpg(),
        "odometer": odometer(), "trip": trip(), "range": fuel_range(), "runtime": runtime(),
        "illumination": illumination(), "left_turn_signal": left_turn_signal(),
        "right_turn_signal": right_turn_signal(), "hazards": hazards(), "high_beam": high_beam(),
        "roof_down": roof_down(),
    }

    if fetch_count % LOG_EVERY == 0:
        log(car)
        
    return {"type": "car_update", "car": car}

# log loop
def log(data):
    row = {
        "time": datetime.now().strftime("%I:%M:%S.%f %p"),
        "rpm": data["rpm"],
        "mph": data["mph"],
        "coolant_temp": data["coolant_temp"],
        "oil_pressure": data["oil_pressure"],
        "voltage": data["voltage"],
        "fuel_level": data["fuel_level"],
        "mpg": data["mpg"],
        "odometer": data["odometer"],
        "trip": data["trip"],
        "range": data["range"],
        "runtime": data["runtime"],
        "illumination": data["illumination"],
        "left_turn_signal": data["left_turn_signal"],
        "right_turn_signal": data["right_turn_signal"],
        "hazards": data["hazards"],
        "high_beam": data["high_beam"],
        "roof_down": data["roof_down"],
    }
    buffer.append(row)

    # write every 50 lines
    if len(buffer) >= BUFFER_LIMIT:
        write()

# write current buffer log to csv file
def write():
    if not buffer:
        return
    try:
        newfile = need_header(full_path)
        with open(full_path, "a", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=COLUMNS)
            if newfile:
                writer.writeheader()
            writer.writerows(buffer)
            f.flush()
            os.fsync(f.fileno())
        buffer.clear()
    except Exception as e:
        print(f"[log write error] {e}")

# sensor data fetch functions
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

def mpg():
    return 14.2

def odometer():
    return 147994

def trip():
    return 54

def fuel_range():
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

def roof_down():
    return True
