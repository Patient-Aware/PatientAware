from unittest import result
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os
from datetime import datetime
from sqlalchemy import Column, ForeignKey
from celery import Celery
import time

import biosensor

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

# Experiment class/model
class Experiment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sensor_task_id = db.Column(db.Integer, db.ForeignKey('sensor_task.id'), nullable = False)
    sensor_task = db.relationship('SensorTask', backref=db.backref('experiments', lazy = True))
    
    port1_antigen_id = db.Column(db.Integer, db.ForeignKey('antigen.id'), nullable = False)
    port2_antigen_id = db.Column(db.Integer, db.ForeignKey('antigen.id'), nullable = False)
    port3_antigen_id = db.Column(db.Integer, db.ForeignKey('antigen.id'), nullable = False)
    port4_antigen_id = db.Column(db.Integer, db.ForeignKey('antigen.id'), nullable = False)

    port1_antigen = db.relationship('Antigen', foreign_keys = [port1_antigen_id])
    port2_antigen = db.relationship('Antigen', foreign_keys = [port2_antigen_id])   
    port3_antigen = db.relationship('Antigen', foreign_keys = [port3_antigen_id]) 
    port4_antigen = db.relationship('Antigen', foreign_keys = [port4_antigen_id])
    
class ExperimentSchema(ma.Schema):
    class Meta:
        fields = ('id', 'sensor_task_id', 'port1_antigen_id', 'port2_antigen_id', 'port3_antigen_id', 'port4_antigen_id')

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
    a_const = db.Column(db.Float)
    b_const = db.Column(db.Float)
    unhealthy_above = db.Column(db.Float)

    def __init__(self, full_name, short_name, units, a_const, b_const, unhealthy_above):
        self.full_name = full_name
        self.short_name = short_name
        self.units = units
        self.a_const = a_const
        self.b_const = b_const
        self.unhealthy_above = unhealthy_above

# Antigen Schema
class AntigenSchema(ma.Schema):
    class Meta:
        fields = ('id', 'full_name', 'short_name', 'units', 'a_const', 'b_const', 'unhealthy_above')

# initialize schema
antigen_schema = AntigenSchema()
antigens_schema = AntigenSchema(many=True)


@celery.task(bind = True)
def sensor_read_task(self):
    
    time.sleep(30)
    
    current_task =  SensorTask.query.filter_by(task_uuid=celery.current_task.request.id).first()
    current_task.status = "complete"
    current_task.port1_delta = 0.123
    db.session.commit()
    result = sensortask_schema.dump(current_task)
    return result

@app.route('/start_test', methods=['POST'])
def start_test():
    task = sensor_read_task.apply_async(args = [])
    new_task = SensorTask(task_uuid= task.id, status="in-progress", start_time=datetime.now(),end_time=datetime.now(),port1_delta=0.0, port2_delta=0.0, port3_delta=0.0, port4_delta=0.0)
    
    port1_antigen_name = request.json['port1_antigen']
    port2_antigen_name = request.json['port2_antigen']
    port3_antigen_name = request.json['port3_antigen']
    port4_antigen_name = request.json['port4_antigen']
    
    #current_task =  SensorTask.query.filter_by(task_uuid=celery.current_task.request.id).first()
    port1_antigen = Antigen.query.filter_by(short_name = port1_antigen_name).first()
    port2_antigen = Antigen.query.filter_by(short_name = port2_antigen_name).first()
    port3_antigen = Antigen.query.filter_by(short_name = port3_antigen_name).first()
    port4_antigen = Antigen.query.filter_by(short_name = port4_antigen_name).first()
    
    new_experiment = Experiment(sensor_task = new_task, port1_antigen=port1_antigen, port2_antigen = port2_antigen, port3_antigen=port3_antigen, port4_antigen=port4_antigen)
    db.session.add(new_task)
    db.session.add(new_experiment)
    db.session.commit()
    
    # make new experiment object with new task and header antigen info
    return {"task_id" : task.id}



# Create the tables
with app.app_context(): # must be below the schema init
    db.create_all()

# API route
@app.route('/')
def hello_world():
    return "hello, world!"


@app.before_first_request
def setup():
    db.session.query(Antigen).delete()
    
    db.session.commit()
    CEA = Antigen("Carcinoembryonic Antigen", "CEA", "ng/mL", 0.00002, -14.3, 10.0)
    CA199 = Antigen("Carbohydrate Antigen", "CA19-9", "ng/ml", 9.4801, -232.1, 3.0)
    KRAS = Antigen("Kirsten Rat Sarcoma Viral Oncogene Homolog", "KRAS", "ng/ml", 0.000002, 46.052, 1.0)
    BRAF = Antigen("BRAF V600E", "BRAF V600E", "ng/ml", 2.861, 10.011, 0.1)
    empty_test = Antigen("Empty", "None", "n/a", 0.0, 0.0, 0.0)

    db.session.add(CEA)
    db.session.add(CA199)
    db.session.add(KRAS)
    db.session.add(BRAF)
    db.session.add(empty_test)
    db.session.commit()

if __name__ == "__main__":
    
    app.run(debug=True)