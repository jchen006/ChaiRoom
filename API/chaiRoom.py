from flask import Flask, jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.restless import APIManager

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)

class Cafe(db.Model): 
	__tablename__ = 'cafe'
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.Unicode, unique=True)
	address = db.Column(db.Unicode, unique=True)
	hours = db.Column(db.Unicode)
	seats = db.relationship('Seat',
                                backref=db.backref('cafe',
                                                   lazy='dynamic'))

	def __init__(name, address, hours, seats): 
		self.name = name
		self.address = address
		self.hours = hours
		self.seats = seats

class Seat(db.Model):
	__tablename__ = 'seat'
	id = db.Column(db.Integer, primary_key=True)
	cafe_id = db.Column(db.Integer, db.ForeignKey('cafe.id'))
	status = db.Column(db.Unicode)
	reserved_by = db.Column(db.Unicode)

	def __init__(cafe_id, status, reserved_by): 
		self.cafe_id = cafe_id
		self.status = "open"
		self.reserved_by = ""

db.create_all()
manager = APIManager(flask_sqlalchemy_db=db)
manager.init_app(app)

cafe_api = manager.create_api(Cafe, methods=['GET', 'POST'])
seat_api = manager.create_api(Seat, methods=['GET'])

@app.route('/healthCheck', methods=['GET'])
def healthCheck():
    return jsonify({'Health Check': 'OK'})

#Gets all cafes in the database
@app.route('/chaiRoom/api/cafes', method=['GET'])
def get_cafes(): 

#Gets one specific cafe in the database
@app.route('/chaiRoom/api/cafe/<id>', method=['GET'])
def get_cafe(id): 

#Reserves the ID of a specific seat
@app.route('/reserve/<id>', method=['POST'])
def reserve(id):

@app.route('/reserve/confirm/<id>', method=['POST'])
def confirm(id):

#Cancels the reservation of a seat 
@app.route('/reserve/cancel/<id>', method=['POST'])
def cancel(id):



if __name__ == '__main__':
    app.run(debug=True)