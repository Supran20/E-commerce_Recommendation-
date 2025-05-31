from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from flask_bcrypt import Bcrypt
import jwt
from bson.objectid import ObjectId
from datetime import datetime, timedelta
from collections import Counter

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import os
from scipy.sparse import coo_matrix

app = Flask(__name__)
CORS(app, supports_credentials=True) 
bcrypt=Bcrypt(app)

app.config["MONGO_URI"]="mongodb://localhost:27017/ecommerce_db"
mongo=PyMongo(app)

JWT_SECRET = "supran"

@app.route('/', methods=['GET'])
def home():
    train_data=pd.read_csv("../content_recommendation_data.csv")
    avg_rating=train_data.groupby(['name', 'category', 'price', 'brand','imageURL','description'])['rating'].mean().reset_index()
    top_rated=avg_rating.sort_values(by='rating', ascending=False).head(8)
    result=top_rated.to_dict(orient='records')
    return jsonify(result)

@app.route('/items', methods=['GET'])
def items():
    df=pd.read_csv("../content_recommendation_data.csv")
    items=df[['name', 'category', 'price', 'brand','imageURL','description', 'rating']].dropna()
    result=items.to_dict(orient='records')
    return jsonify(result)

@app.route('/register', methods=['POST'])
def register():
    data=request.json
    name=data.get("name")
    email=data.get("email")
    password=data.get("password")

    if mongo.db.users.find_one({"email":email}):
        return jsonify({"message":"Email already exists"}), 400
    
    hashed_pw=bcrypt.generate_password_hash(password).decode('utf-8')
    mongo.db.users.insert_one({
        "name":name,
        "email":email,
        "password":hashed_pw
    })
    return jsonify({"message":"Registration successful"}), 201

@app.route('/login', methods=['POST'])
def login():
    data=request.json
    email=data.get("email")
    password=data.get("password")

    user=mongo.db.users.find_one({"email":email})
    if user and bcrypt.check_password_hash(user['password'], password):
        token=jwt.encode({
            "user_id":str(user["_id"]),
            "exp":datetime.utcnow()+timedelta(days=365)
        }, JWT_SECRET, algorithm="HS256")
        return jsonify({"token":token}),200
    
    return jsonify({"message":"Invalid email or password"}),401

@app.route('/user', methods=['GET'])
def get_user():
    auth_header=request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer"):
        return jsonify({"message": "Missing or invalid token"}), 401
    
    token=auth_header.split(" ")[1]

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = mongo.db.users.find_one({"_id": ObjectId(payload["user_id"])}, {"password": 0})
        if user:
            user["_id"] = str(user["_id"])
            return jsonify({"userData": user}), 200
        return jsonify({"message": "User not found"}), 404
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401


@app.route('/add-to-cart', methods=['POST'])
def add_to_cart():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer"):
        return jsonify({"message": "Missing or invalid token"}), 401

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload["user_id"]
        data = request.get_json()
        item_name = data.get("itemName")

        if not item_name:
            return jsonify({"message": "Item name is required"}), 400

        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if item_name in user.get("cart", []):
            return jsonify({"message": "Item already in cart"}), 200

        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"cart": item_name}}
        )

        return jsonify({"message": "Item added to cart"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401


@app.route('/cart', methods=['GET'])
def get_cart_items():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer"):
        return jsonify({"message": "Missing or invalid token"}), 401

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = mongo.db.users.find_one({"_id": ObjectId(payload["user_id"])})
        if not user:
            return jsonify({"message": "User not found"}), 404

        cart_item_names = user.get("cart", [])
        if not cart_item_names:
            return jsonify([])  

       
        df = pd.read_csv("../content_recommendation_data.csv")
        df = df[['name', 'category', 'price', 'brand','imageURL','description', 'rating']].dropna()

        
        cart_items = df[df['name'].isin(cart_item_names)]
        result = cart_items.to_dict(orient='records')

        return jsonify(result), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

@app.route('/remove-from-cart', methods=['POST'])
def remove_from_cart():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer"):
        return jsonify({"message": "Missing or invalid token"}), 401

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload["user_id"]
        data = request.get_json()
        item_name = data.get("itemName")

        if not item_name:
            return jsonify({"message": "Item name is required"}), 400

        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$pull": {"cart": item_name}}
        )

        return jsonify({"message": "Item removed from cart"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

@app.route('/purchase', methods=['POST'])
def purchase():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer"):
        return jsonify({"message": "Missing or invalid token"}), 401

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload["user_id"]

        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        cart_items = user.get("cart", [])

        if not cart_items:
            return jsonify({"message": "Cart is empty"}), 400

 
        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$push": {"purchase": {"$each": cart_items}},
                "$set": {"cart": []}  
            }
        )

        return jsonify({"message": "Purchase successful"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

@app.route('/recommendation', methods=['GET'])
def recommendation():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer"):
        return jsonify({"message": "Missing or invalid token"}), 401

    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = mongo.db.users.find_one({"_id": ObjectId(payload["user_id"])})
        if not user:
            return jsonify({"message": "User not found"}), 404

        purchases = user.get("purchase", [])
        if len(purchases) < 2:
            return jsonify({"message": "Not enough purchases found"}), 404

        last_two_items = purchases[-2:]

        
        train_data = pd.read_csv("../content_recommendation_data.csv")

        recommendations_1 = content_based_recommendations(train_data, last_two_items[0], top_n=5)
        recommendations_2 = content_based_recommendations(train_data, last_two_items[1], top_n=5)

        top3_recs_1 = recommendations_1.head(3)
        filtered_recs_2 = recommendations_2[~recommendations_2.isin(top3_recs_1)].head(2)
        combined_recommendations = pd.concat([top3_recs_1, filtered_recs_2]).head(5)

  
        if "category" not in combined_recommendations.columns:
            return jsonify({"message": "Category column not found in recommendation data"}), 500

        category_counts = dict(Counter(combined_recommendations["category"]))

        mongo.db.users.update_one(
            {"_id": ObjectId(payload["user_id"])},
            {"$set": {"recommend": category_counts}}
        )

        return jsonify({
            "recommendations": combined_recommendations.to_dict(orient="records"),
            "category_frequency": category_counts
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401
 
@app.route('/customers', methods=['GET'])
def get_customers():
    users = mongo.db.users.find({}, {"name": 1, "_id": 0})  # Fetch only the 'name' field
    customer_names = [user['name'] for user in users]
    return jsonify(customer_names), 200

@app.route('/charts', methods=['POST'])
def get_user_purchases():
    try:
        data = request.get_json()
        user_name = data.get("name")

        if not user_name:
            return jsonify({"message": "User name is required"}), 400

        user = mongo.db.users.find_one({"name": user_name})
        if not user:
            return jsonify({"message": "User not found"}), 404

        last_10_purchases = user.get("purchase", [])[-10:]
        recommend_data = user.get("recommend", {}) 

        df = pd.read_csv("../content_recommendation_data.csv")
        df = df[['name', 'category', 'price', 'brand', 'imageURL', 'description', 'rating']].dropna()

        result = []
        for item_name in last_10_purchases:
            matched_items = df[df['name'] == item_name]
            result.extend(matched_items.to_dict(orient='records'))

        return jsonify({
            "purchases": result,
            "recommend": recommend_data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500





from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def content_based_recommendations(train_data, item_name, top_n=10):
    if item_name not in train_data['name'].values:
        print(f"Item '{item_name}' not found in the training data")
        return pd.DataFrame()
    
    tfidf_vectorizer=TfidfVectorizer(stop_words='english')
    tfidf_matrix_content=tfidf_vectorizer.fit_transform(train_data['tags'])
    cosine_similarities_content=cosine_similarity(tfidf_matrix_content, tfidf_matrix_content)
    
    item_index=train_data[train_data['name']==item_name].index[0]
    
    similar_items=list(enumerate(cosine_similarities_content[item_index]))
    
    item_index=train_data[train_data['name']==item_name].index[0]
    
    similar_items=list(enumerate(cosine_similarities_content[item_index]))
    
    similar_items=sorted(similar_items, key=lambda x:x[1], reverse=True)
    top_similar_items=similar_items[1:top_n+1]

    recommended_item=[x[0] for x in top_similar_items]
    
    recommended_item_details=train_data.iloc[recommended_item][['name', 'category', 'brand', 'price', 'rating', 'description', 'imageURL']]
    
    return recommended_item_details

if __name__ == '__main__':
    app.run(debug=True, port=8000)
