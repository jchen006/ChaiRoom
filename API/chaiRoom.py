from flask import Flask, jsonify
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.restless import APIManager
import csv, json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/test.db'
db = SQLAlchemy(app)
CAFES = []

class Cafe(db.Model): 
	__tablename__ = 'cafe'
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.Unicode, unique=True)
	address = db.Column(db.Unicode, unique=True)
	hours = db.Column(db.Unicode)
	seat_num = db.Column(db.Integer)
	# seats = db.relationship('Seat',
 #                                backref=db.backref('cafe'))

	def __init__(self, name, address, hours, seats): 
		self.name = name
		self.address = address
		self.hours = hours
		self.seat_num = seats

class Seat(db.Model):
	__tablename__ = 'seat'
	id = db.Column(db.Integer, primary_key=True)
	cafe_id = db.Column(db.Integer, db.ForeignKey('cafe.id'))
	status = db.Column(db.Unicode)
	reserved_by = db.Column(db.Unicode)

	def __init__(self, cafe_id, status, reserved_by): 
		self.cafe_id = cafe_id
		self.status = "open"
		self.reserved_by = ""

#import everything CSV in cafe and seats 
def import_cafes(): 
	print("Importing cafes")
	f = open("cafes.csv", 'rb')
	reader = csv.reader(f)
	for row in reader: 
		name = row[0]
		address = row[1]
		hours = row[2]
		seats = row[3]
		new_cafe = Cafe(name, address, hours, seats)
		CAFES.append(new_cafe)
	f.close()

def create_seats(self, cafe_id):
	pass

@app.route('/healthCheck', methods=['GET'])
def healthCheck():
    return jsonify({'Health Check': 'OK'})

#Gets all cafes in the database
@app.route('/chaiRoom/api/cafes', methods=['GET'])
def get_cafes(): 
	#NEED to return as a JSON object
	list_cafes = []
	for c in CAFES: 
		list_cafes.append(vars(c))
	print(list_cafes)
	return jsonify(list_cafes, sort_keys=True, indent=4)

#Gets one specific cafe in the database based on the ID
@app.route('/chaiRoom/api/cafe/<id>', methods=['GET'])
def get_cafe(id): 
	#NEED to be able to go through and find all objects
	# return json.dumps(CAFES.__dict__)
	pass

#returns status of the seat ID 
@app.route('/chaiRoom/api/cafe/<id>/seat/<seat_id>', methods=['GET'])
def get_seat(id, seat_id): 
	pass


#Reserves the ID of a specific seat
#Request: {"phoneNumber": "XXX-XXX-XXXX", "cafe_id": "", "seat_id:": "", "action":"reserve/cancel/confirm"}
@app.route('/chaiRoom/api/seat/', methods=['POST'])
def reserve():
	pass


if __name__ == '__main__':
	import_cafes()
	app.run(debug=True)
	
    