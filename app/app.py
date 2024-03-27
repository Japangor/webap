from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from google.cloud import pubsub_v1
import json
import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://csye-user:${db_password}@${db_host}/csye-database'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

# Pub/Sub client
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path('csye-417822', 'verify_email')

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    account_created = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    account_updated = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    verified = db.Column(db.Boolean, default=False)

# Create a new user
@app.route('/v1/user', methods=['POST'])
def create_user():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(
        email=data['email'],
        password=hashed_password,
        first_name=data['first_name'],
        last_name=data['last_name']
    )
    db.session.add(user)
    db.session.commit()

    # Publish a message to Pub/Sub topic
    message_data = {
        'user_id': user.id,
        'email': user.email
    }
    message = json.dumps(message_data).encode('utf-8')
    publisher.publish(topic_path, data=message)

    return jsonify({'message': 'User created successfully'}), 201

# Update user information
@app.route('/v1/user/self', methods=['PUT'])
def update_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'message': 'Authorization header is missing'}), 401

    try:
        auth_token = auth_header.split(" ")[1]
        user_id = int(auth_token)
    except:
        return jsonify({'message': 'Invalid authorization token'}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if not user.verified:
        return jsonify({'message': 'User account is not verified'}), 403

    data = request.get_json()
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    if 'password' in data:
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user.password = hashed_password
    db.session.commit()

    return jsonify({'message': 'User updated successfully'})

# Get user information
@app.route('/v1/user/self', methods=['GET'])
def get_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({'message': 'Authorization header is missing'}), 401

    try:
        auth_token = auth_header.split(" ")[1]
        user_id = int(auth_token)
    except:
        return jsonify({'message': 'Invalid authorization token'}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if not user.verified:
        return jsonify({'message': 'User account is not verified'}), 403

    user_data = {
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'account_created': user.account_created,
        'account_updated': user.account_updated,
        'verified': user.verified
    }

    return jsonify(user_data)

# Verify user email
@app.route('/verify', methods=['GET'])
def verify_user_email():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'message': 'User ID is missing'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    if user.verified:
        return jsonify({'message': 'User account is already verified'})

    # Check if the verification link has expired (2 minutes)
    email_sent_time = datetime.datetime.utcnow() - datetime.timedelta(minutes=2)
    email_sent = EmailVerification.query.filter_by(user_id=user_id, sent_at__gte=email_sent_time).first()
    if not email_sent:
        return jsonify({'message': 'Verification link has expired'}), 400

    user.verified = True
    db.session.commit()

    return jsonify({'message': 'User account verified successfully'})

# Email verification model
class EmailVerification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    sent_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

if __name__ == '__main__':
    app.run()