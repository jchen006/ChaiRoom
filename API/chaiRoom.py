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

#import everything CSV in cafe and seats 
def import_cafes(self): 

def import_seats(self):

@app.route('/healthCheck', methods=['GET'])
def healthCheck():
    return jsonify({'Health Check': 'OK'})

#Gets all cafes in the database
@app.route('/chaiRoom/api/cafes', method=['GET'])
def get_cafes(): 
	return jsonify({"cafes": cafes})

#Gets one specific cafe in the database based on the ID
@app.route('/chaiRoom/api/cafe/<id>', method=['GET'])
def get_cafe(id): 

#returns status of the seat ID 
@app.route('/chaiRoom/api/cafe/<id>/seat/<seat_id>', method=['GET'])
def get_seat(id, seat_id): 


#Reserves the ID of a specific seat
#Request: {"phoneNumber": "XXX-XXX-XXXX", "cafe_id": "", "seat_id:": "", "action":"reserve/cancel/confirm"}
@app.route('/chaiRoom/api/seat/', method=['POST'])
def reserve():
	if request.method == "POST":




if __name__ == '__main__':
    app.run(debug=True)
    cafes = import_cafes()
    seats = import_seats()