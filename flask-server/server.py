from unittest import result
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os
from datetime import datetime
from sqlalchemy import Column, ForeignKey
from celery import Celery
import time

# create app instance
app = Flask(__name__)

# base directory for database
basedir = os.path.abspath(os.path.dirname(__file__))

# database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False # stop console from complaining OPTIONAL

def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=app.config['CELERY_RESULT_BACKEND'],
        broker=app.config['CELERY_BROKER_URL']
    )
    #celery.conf.update(app.config)

    class ContextTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = ContextTask
    return celery


app.config.update(
    CELERY_BROKER_URL='redis://localhost:6379',
    CELERY_RESULT_BACKEND='redis://localhost:6379'
)
celery = make_celery(app)

# Init db
db = SQLAlchemy()
db.init_app(app) # initialize app with extension
# Init ma (marshmallow)
ma = Marshmallow()

# SensorTask class/model
class SensorTask(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_uuid = db.Column(db.String(100)) #UUID Value (stored as string.. not ideal but works for now)
    status = db.Column(db.String(100)) # in-progress, cancelled, complete
    start_time = db.Column(db.DateTime, default = datetime.now())  # time when test starts
    end_time = db.Column(db.DateTime) # time when test completes
    port1_delta = db.Column(db.Float)
    port2_delta = db.Column(db.Float)
    port3_delta = db.Column(db.Float)
    port4_delta = db.Column(db.Float)
    
    def __init__(self, task_uuid, status, start_time, end_time, port1_delta, port2_delta,port3_delta,port4_delta):
        self.task_uuid = task_uuid
        self.status = status 
        self.start_time = start_time
        self.end_time = end_time
        self.port1_delta = port1_delta
        self.port2_delta = port2_delta
        self.port3_delta = port3_delta
        self.port4_delta = port4_delta

# Patient Schema
class SensorTaskSchema(ma.Schema):
    class Meta: # the fields we are allowed to show
        fields = ('id','task_uuid', 'status', 'start_time', 'end_time', 'port1_delta', 'port2_delta', 'port3_delta', 'port4_delta')

sensortask_schema  = SensorTaskSchema() #strict = True to rid of console warning
sensortasks_schema = SensorTaskSchema(many=True) # we need schema for multiple patients. If we are fetching multiple patients we need this

# Antigen Model/Class
class Antigen(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100))
    short_name = db.Column(db.String(20))
    units = db.Column(db.String(10))
    calibration_slope = db.Column(db.Float)
    calibration_intercept = db.Column(db.Float)
    normal_low = db.Column(db.Float)
    normal_high = db.Column(db.Float)
    excessive = db.Column(db.Float)
    spreading = db.Column(db.Float)

    def __init__(self, full_name, short_name, units, calibration_slope, calibration_intercept, normal_low, normal_high, excessive, spreading):
        self.full_name = full_name
        self.short_name = short_name
        self.units = units
        self.calibration_slope = calibration_slope
        self.calibration_intercept = calibration_intercept
        self.normal_low = normal_low
        self.normal_high = normal_high
        self.excessive = excessive
        self.spreading = spreading

# Antigen Schema
class AntigenSchema(ma.Schema):
    class Meta:
        fields = ('id', 'full_name', 'short_name', 'units', 'calibration_slope', 'calibration_intercept', 'normal_low', 'normal_high', 'excessive', 'spreading')

# initialize schema
antigen_schema = AntigenSchema()
antigens_schema = AntigenSchema(many=True)

# patient Class/Model
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    dob = db.Column(db.DateTime)
    #doctors = db.relationship('Doctor', backref='patient', lazy=True)

    def __init__(self, first_name, last_name, dob):
        self.first_name = first_name
        self.last_name = last_name 
        self.dob = dob

# Patient Schema
class PatientSchema(ma.Schema):
    class Meta: # the fields we are allowed to show
        fields = ('id', 'first_name', 'last_name', 'dob')#, 'doctors')

# Initialize Schema
patient_schema  = PatientSchema() #strict = True to rid of console warning
patients_schema = PatientSchema(many=True) # we need schema for multiple patients. If we are fetching multiple patients we need this

# Create a patient
@app.route('/patient', methods=['POST'])
def patient_create():
    format = '%m/%d/%Y'

    # read in the post information that was posted from the client (react)
    first_name = request.json['first_name']
    last_name = request.json['last_name']
    dob = datetime.datetime.strptime(request.json['dob'], format)

    # initialize a new object
    new_patient = Patient(first_name, last_name, dob)

    # add and commit new database entry
    db.session.add(new_patient)
    db.session.commit()

    return patient_schema.jsonify(new_patient)

@celery.task(bind = True)
def sensor_read_task(self):
    
    time.sleep(30)
    
    current_task =  SensorTask.query.filter_by(task_uuid=celery.current_task.request.id).first()
    current_task.status = "complete"
    current_task.port1_delta = 0.123
    db.session.commit()
    result = sensortask_schema.dump(current_task)
    return result

@app.route('/start_test', methods=['GET'])
def start_test():
    task = sensor_read_task.apply_async(args = [])
    new_task = SensorTask(task_uuid= task.id, status="in-progress", start_time=datetime.now(),end_time=datetime.now(),port1_delta=0.0, port2_delta=0.0, port3_delta=0.0, port4_delta=0.0)
    
    db.session.add(new_task)
    db.session.commit()
    
    # make new experiment object with new task and header antigen info
    return {"task_id" : task.id}


# get all patients
@app.route('/patient', methods=['GET'])
def get_patients():
    all_patients = Patient.query.all() # example of why sqlalchemy is helpful
    result = patients_schema.dump(all_patients)
    return jsonify(result)

# get single patient
@app.route('/patient/<id>', methods=['GET'])
def get_patient(id):
    patient = Patient.query.get(id) # example of why sqlalchemy is helpful
    return patient_schema.jsonify(patient)

# Update a patient
@app.route('/patient/<id>', methods=['PUT'])
def patient_update(id):
    patient = Patient.query.get(id)

    format = '%m/%d/%Y'

    # read in the post information that was posted from the client (react)
    first_name = request.json['first_name']
    last_name = request.json['last_name']
    dob = datetime.datetime.strptime(request.json['dob'], format)

    #construct new product to submit to the database
    patient.first_name = first_name
    patient.last_name = last_name 
    patient.dob = dob 

    # commit new changes to database
    db.session.commit()

    return patient_schema.jsonify(patient)

# Delete single patient
@app.route('/patient/<id>', methods=['DELETE'])
def patient_delete(id):
    patient = Patient.query.get(id) # example of why sqlalchemy is helpful
    db.session.delete(patient)
    db.session.commit()
    return patient_schema.jsonify(patient)


# Create the tables
with app.app_context(): # must be below the schema init
    db.create_all()

# API route
@app.route('/')
def hello_world():
    return "hello, world!"

#another api route for example
@app.route('/members')
def members():
    return {"members": ["Matt", "Chris", "Ralph", "Luke"]}

@app.before_first_request
def setup():
    db.session.query(Antigen).delete()
    db.session.commit()
    CEA = Antigen("Carcinoembryonic Antigen", "CEA", "ng/mL", -0.55, 0.4, 0.0, 2.5, 10.0, 20.0)
    db.session.add(CEA)
    empty_test = Antigen("Empty", "Empty", "n/a", 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
    db.session.add(empty_test)
    db.session.commit()

if __name__ == "__main__":
    
    app.run(debug=True)