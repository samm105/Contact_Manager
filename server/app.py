from flask import  jsonify, request
from models import Contact
from config import app, db


@app.route("/contacts", methods = ["GET"])
def get_contacts():
    contact = Contact.query.all()
    return jsonify({"contacts" : [contact.to_json() for contact in contact]})

@app.route("/create_contact", methods = ["POST"])
def create_contact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")
    
    if not first_name or not last_name or not email:
        return( jsonify({"message": "Must include first name , last name and email"}), 400
        )
        
    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)
    
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return { "message": str(e)}, 400
    
    return jsonify({"message": "User Has been created succesfully"}), 200
    
@app.route("/updatecontact/<int:user_id>", methods=["PATCH"])
def updatecontact(user_id):
    contact = Contact.query.get(user_id)
    
    if not contact:
        return jsonify({"message": "User not found"}), 404

    data = request.json 
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)
    db.session.commit()
    return jsonify({"message": "User updated succesfully"}), 200

@app.route("/deletecontact/<int:user_id>", methods=["DELETE"])
def deletecontact(user_id):
    contact = Contact.query.get(user_id)
    
    if not contact:
        return jsonify({"message": "User not found"}), 404
    
    db.session.delete(contact)
    db.session.commit()
    
    return jsonify({"message": "User deleted!"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)
    
    

    
