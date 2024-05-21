import os
from datetime import datetime
from datetime import timedelta
from datetime import timezone
from dotenv import load_dotenv
from flask import Flask, make_response, redirect, render_template, url_for, request, jsonify, session, Response
from flask_login import login_user, LoginManager, login_required, logout_user, current_user,UserMixin
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm, CSRFProtect
from flask_wtf.csrf import generate_csrf
from flask_jwt_extended import create_access_token, create_refresh_token, set_refresh_cookies
from flask_jwt_extended import get_jwt
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_jwt_extended import set_access_cookies
from flask_jwt_extended import unset_jwt_cookies
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length,ValidationError
from flask_bcrypt import Bcrypt
from models import db, User
import stripe, logging
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
JWTManager(app)

@app.after_request
def after_request(response): # Have to do this twice....
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

load_dotenv()
stripe.api_key = os.getenv('STRIPE_API_SKEY')
app.secret_key = os.getenv('SKEY')
# If true this will only allow the cookies that contain your JWTs to be sent
# over https. In production, this should always be set to True
app.config["JWT_COOKIE_SECURE"] = False
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
app.config["JWT_SECRET_KEY"] = app.secret_key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config['JWT_REFRESH_COOKIE_PATH'] = '/auth/refresh'

bcrypt = Bcrypt(app)
app.config['SQLALCHEMY_DATABASE_URI'] ='postgresql+psycopg2://postgres:CSC473@localhost:5432/postgres'
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
    password = db.Column(db.String(255), nullable=False)
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


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response
        return response

@app.route('/login', methods=['POST'])
def login():
    
    username = request.json.get('username')
    password = request.json.get('password')

    validation = L_validation(username, password)

    if validation is not None:
        return jsonify(validation), 400

    user = User.query.filter_by(username=username).first()
    try:
        if user:
            if bcrypt.check_password_hash(user.password, password):
                login_user(user)
                session['logged_in'] = True
                response = jsonify({
                    "msg": "login successful",
                    "username": user.username, 
                    "access_token": create_access_token(identity=username)
                })
                return response, 200
                        
            else:
                error = {'message': 'Invalid username or password.'}
                return jsonify(error), 400
            
        else:
            error = {'message': 'Invalid username or password.'}
            return jsonify(error), 400
        
    except Exception as e:
        return jsonify({'message': 'Error has occured.'}), 500
    

@app.route('/purchaseItem=hints', methods=['POST'])
@jwt_required()
@cross_origin()
def pay_for_hints():
    hints = os.getenv('hints')
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    
                    'price': hints,
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url='http://localhost:5173/hintsuccess=true',
            cancel_url='http://localhost:5173/hintcanceled=true',
        )
    
    except Exception as e:
        return str(e)
    return jsonify(checkout_url = checkout_session.url, id=checkout_session.id)
    
@app.route('/purchaseItem=checks', methods=['POST'])
@jwt_required()
@cross_origin()
def pay_for_checks():
    checks = os.getenv('checks')
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[
                {
                    
                    'price': checks,
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url='http://localhost:5173/checksuccess=true',
            cancel_url='http://localhost:5173/checkcanceled=true',
        )
    
    except Exception as e:
        return str(e)
    return jsonify(checkout_url = checkout_session.url, id=checkout_session.id)
    

@app.route('/logout', methods=['POST', 'OPTIONS'])
@jwt_required()
@cross_origin()
def logout():
    if request.method == 'OPTIONS': # Wont work without this and the function doing the same above...
        response = jsonify({'message': 'request successful'})
        response.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response
    
    logout_user()
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


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

        if R_validation(username,password) is None:
            
            hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
            new_user = User(username=username, password=hashed_password)
            db.session.add(new_user)
            db.session.commit()
            response = jsonify({'message': 'Registration successful'})
            return response
        
        else:
            error = R_validation(username,password)
            return jsonify(error), 400

@app.route('/hintsuccess=true', methods= ['POST'])
@jwt_required()
@cross_origin()
def paid_hints():
    id = request.json.get('id')
    if id is None:
        return jsonify({'error': 'No checkout id'}), 404
    
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user.owned_hints += 1
    db.session.commit()
    return jsonify({'message': 'Hints incremented successfully'}), 200

@app.route('/checksuccess=true', methods= ['POST'])
@jwt_required()
@cross_origin()
def paid_checks():
    id = request.json.get('id')
    if id is None:
        return jsonify({'error': 'No checkout id'}), 404
    
    current_user = get_jwt_identity()
    user = User.query.filter_by(username=current_user).first()
    if not user:
        return jsonify({'error': 'Unauthorized'}), 401
    
    user.owned_checks += 1
    db.session.commit()
    return jsonify({'message': 'Hints incremented successfully'}), 200

if __name__ == "__main__":
    app.run(debug=True)