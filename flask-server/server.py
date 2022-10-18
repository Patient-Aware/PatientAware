from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os

from sqlalchemy import Column, ForeignKey

# create app instance
app = Flask(__name__)

# base directory for database
basedir = os.path.abspath(os.path.dirname(__file__))

# database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False # stop console from complaining OPTIONAL

# Init db
db = SQLAlchemy()
db.init_app(app) # initialize app with extension
# Init ma (marshmallow)
ma = Marshmallow()

# Create the tables
with app.app_context():
    db.create_all()

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

# # doctor Class/Model
# class Doctor(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     patient_id = db.Column(db.Integer, db.ForeignKey("patient.id"), nullable = False) # one doctor to many patients
#     first_name = db.Column(db.String(100))
#     last_name = db.Column(db.String(100))
#     dob = db.Column(db.DateTime)

#     def __init__(self, first_name, last_name, dob):
#         self.first_name = first_name
#         self.last_name = last_name 
#         self.dob = dob

# # Doctor Schema
# class DoctorSchema(ma.Schema):
#     class Meta:
#         fields = ('id', 'patient_id', 'first_name', 'last_name', 'dob')

# # Initialize Schema
# doctor_schema = DoctorSchema(strict=True)
# doctors_schema = DoctorSchema(many=True, strict=True)


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