import os
from dotenv import load_dotenv
from flask import Flask, make_response, redirect, render_template, url_for, request, jsonify, session, Response
from flask_login import login_user, LoginManager, login_required, logout_user, current_user,UserMixin
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length,ValidationError
from flask_bcrypt import Bcrypt
from models import db, User
import stripe
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.after_request
def after_request(response): # Have to do this twice....
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

load_dotenv()
stripe.api_key = os.getenv('STRIPE_API_SKEY')

bcrypt = Bcrypt(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_CREATE_DIR'] = False
app.config['SECRET_KEY'] = 'SECRETKEY'
db = SQLAlchemy(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    win_count = db.Column(db.Integer, default=0)
    owned_hints = db.Column(db.Integer, default=0)
    owned_checks = db.Column(db.Integer, default=0)


with app.app_context():
    db.create_all()


class RegisterForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(min=4, max=20)], 
                           render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[InputRequired(), Length(min=8, max=20)], 
                             render_kw={"placeholder": "Password"})

    submit = SubmitField('Register')

    def validate_username(self, username):
        existing_user_username = User.query.filter_by(username=username.data).first()
        if existing_user_username:
            raise ValidationError('Please choose a different username.')


class LoginForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(min=4, max=20)], 
                           render_kw={"placeholder": "Username"})

    password = PasswordField(validators=[InputRequired(), Length(min=8, max=20)], 
                             render_kw={"placeholder": "Password"})

    submit = SubmitField('Login')


def R_validation(username, password):
    errors = {}  

    if not username:
        errors['username'] = 'Username is required.'
    if not password:
        errors['password'] = 'Password is required.'

    if username and len(username) < 8:
        errors['username'] = 'Username must be at least 8 characters long.'

    if password and len(password) < 10:
        errors['password'] = 'Password must be at least 10 characters long.'

    existing_user_username = User.query.filter_by(username=username).first()
    if existing_user_username:
        errors['username'] = 'Username already exists.'
    
    if errors:
        return errors
    else:
        return None

def L_validation(username, password):
    errors = {}  

    if not username:
        errors['username'] = 'Username is required.'
    if not password:
        errors['password'] = 'Password is required.'

    existing_user = User.query.filter_by(username=username).first()
    if not existing_user:
        errors['username'] = 'Invalid username or password.'

    else:
        if existing_user and not bcrypt.check_password_hash(existing_user.password, password):
           errors['username'] = 'Invalid username or password.' 
    
    if errors:
        return errors
    else:
        return None
    

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/login', methods=['POST'])
def login():
    
    username = request.json.get('username')
    password = request.json.get('password')

    validation = L_validation(username, password)

    if validation is not None:
        print(validation)
        return jsonify(validation), 400

    user = User.query.filter_by(username=username).first()
    try:
        if user:
            if bcrypt.check_password_hash(user.password, password):
                login_user(user)
                return jsonify({'message': 'Login successful'}), 200
            
            else:
                error = {'message': 'Invalid username or password.'}
                return jsonify(error), 400
            
        else:
            error = {'message': 'Invalid username or password.'}
            return jsonify(error), 400
        
    except Exception as e:
        return jsonify({'message': 'Error has occured.'}), 500


@app.route('/payment_page', methods=['GET', 'POST'])
@login_required
def dashboard():
    return render_template('payment_page.html')


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    return logout_user()


@app.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS': # Wont work without this and the function doing the same above...
        response = jsonify({'message': 'request successful'})
        response.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
        
    elif request.method == 'POST':
        username = request.json.get('username')
        password = request.json.get('password')
        print(R_validation(username,password))

        if R_validation(username,password) is None:
            
            hashed_password = bcrypt.generate_password_hash(password)
            new_user = User(username=username, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            response = jsonify({'message': 'Registration successful'})
            return response
        
        else:
            error = R_validation(username,password)
            return jsonify(error), 400


if __name__ == "__main__":
    app.run(debug=True)