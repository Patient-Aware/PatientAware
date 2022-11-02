from unittest import result
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os
import datetime
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

# initialize celery client
app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

# Init db
db = SQLAlchemy()
db.init_app(app) # initialize app with extension
# Init ma (marshmallow)
ma = Marshmallow()

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

@celery.task
def sensor_read_task():
    time.sleep(60)
    result = [10.0, 11.0, 12.0, 13.0]
    return result

@app.route('/start_test', methods=['GET'])
def start_test():
    task = sensor_read_task.apply_async()
    task.wait()
    return task

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

if __name__ == "__main__":
    app.run(debug=True)