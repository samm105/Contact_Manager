# Python code for starting and intialising the Flask app !!
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy # type: ignore
from flask_cors import CORS # type: ignore
from dotenv import load_dotenv

app = Flask(__name__) 
CORS(app)

load_dotenv()

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv( "DB_KEY", 'sqlite:///default.db')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)