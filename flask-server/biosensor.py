from statistics import mean
from  ina219 import INA219
from ina219 import DeviceRangeError
import time
import datetime as dt
import board


SHUNT_OHMS = 0.1
MAX_EXPECTED_AMPS = 2

class SensorPort(object):

    def __init__(self, i2c_addr):
        self.ina = INA219(SHUNT_OHMS, MAX_EXPECTED_AMPS, address = i2c_addr)
        self.ina.configure()

        self.tare_current_readings = []
        self.test_current_readings = []

    def add_tare_reading(self):
        try:
            self.tare_current_readings.append(self.ina.current())
        except DeviceRangeError as e:
            print(f"Error getting current for sensor {self.ina}")

    def add_test_reading(self):
        try:
            self.test_current_readings.append(self.ina.current())
        except DeviceRangeError as e:
            print(f"Error getting current for sensor {self.ina}")

    def avg_tare_current(self):
        return mean(self.tare_current_readings)

    def avg_test_current(self):
        return mean(self.test_current_readings)

    def current_delta(self):
        return self.avg_test_current() - self.avg_tare_current()


def run_test():

    # sensor initialization

    port1 = SensorPort(0x40)
    port2 = SensorPort(0x41)
    port3 = SensorPort(0x44)
    port4 = SensorPort(0x45)

    # taring/calibration
    # calibration time 60 samples * 0.5 sec = 30 sec
    for i in range(60):
        # could probably condense this, but leaving it like this for readability
        port1.add_tare_reading()
        port2.add_tare_reading()
        port3.add_tare_reading()
        port4.add_tare_reading()

        time.sleep(0.5)

    # testing phase
    # testing time 1200 samples * 0.5 sec = 10 min

    for i in range(120):
        port1.add_test_reading()
        port2.add_test_reading()
        port3.add_test_reading()
        port4.add_test_reading()

        time.sleep(0.5)

    # testing complete. compute deltas

    deltas = {}
    deltas['PORT1'] = port1.current_delta()
    deltas['PORT2'] = port2.current_delta()
    deltas['PORT3'] = port3.current_delta()
    deltas['PORT4'] = port4.current_delta()
    
    return deltas



if __name__ == "__main__":
    print("start")
    print(f"deltas: {run_test()}")