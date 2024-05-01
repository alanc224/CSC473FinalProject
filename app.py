import os
from dotenv import load_dotenv
from flask import Flask, redirect, render_template, url_for, request, jsonify, session
from flask_login import login_user, LoginManager, login_required, logout_user, current_user,UserMixin
from flask_wtf import FlaskForm
from flask_cors import CORS, cross_origin
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length,ValidationError
from flask_bcrypt import Bcrypt
from models import db, User
import stripe


app = Flask(__name__)

load_dotenv()
stripe.api_key = os.getenv('STRIPE_API_SKEY')

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'SECRETKEY'
db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class RegisterForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})
    password = PasswordField(validators=[InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})
    submit = SubmitField('Register')

    def validate_username(self, username):
        existing_user_username = User.query.filter_by(username=username.data).first()
        if existing_user_username:
            raise ValidationError('That username is not valid. Please choose a different username.')

class LoginForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})
    password = PasswordField(validators=[InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})
    submit = SubmitField('Login')

@app.route('/')
def homepage():
    return render_template('home.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form["username"]
    password = request.form["password"]
  
    user = User.query.filter_by(username=username).first()
  
    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Wrong username or password"}), 401
      
    session["user_id"] = user.id
  
    return jsonify({
        "id": user.id,
        "username": user.username
    })

@app.route('/payment_page', methods=['GET', 'POST'])
@login_required
def payment_page():
    return render_template('payment_page.html')

@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/register',methods=['POST'])
def register():
    username = request.form["username"]
    password = request.form["password"]
 
    user_exists = User.query.filter_by(username=username).first() is not None
 
    if user_exists:
        return jsonify({"error": "username already exists"}), 409
     
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
 
    session["user_id"] = new_user.id
 
    return jsonify({
        "id": new_user.id,
        "username": new_user.username
    })


if __name__ == '__main__':
    app.run(debug=True)