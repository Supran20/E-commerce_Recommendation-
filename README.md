# 🛍️ E-Commerce Product Recommendation System

A full-stack web application that provides personalized product recommendations based on user purchase history using content-based filtering.

---

## 📌 Features

- 🔐 User Authentication with JWT (Login & Registration)
- 📈 Dashboard with Last 10 Purchases and Category Frequency Chart
- 🧠 Content-Based Product Recommendation (TF-IDF + Cosine Similarity)
- ⚛️ Frontend: React + Tailwind CSS
- 🌐 Backend: Flask RESTful API
- 🗃️ Database: MongoDB

---

## 🧱 Architecture
Client (React + Tailwind)
|
| Fetch data via RESTful API (JWT-secured)
|
Flask Backend (TF-IDF, Cosine Similarity)
|
| Communicates with MongoDB
|
MongoDB (Stores users, purchases, recommendations)

- The frontend uses JWT tokens stored in localStorage for protected routes.
- Recommendations are generated based on the last two purchases.
- A dashboard displays the user's last 10 purchases and a bar chart of recommended category frequencies.

## ⚙️ Setup Instructions

### 🔹 Prerequisites

Make sure you have the following installed:

- Python 3.8+
- Node.js & npm
- MongoDB running locally (or update URI for cloud DB)

Make sure you have the following installed:

- Python 3.8+
- Node.js & npm
- MongoDB running locally (or update URI for cloud DB)

How to run:
- activating the venv using .\env\Scripts\activate 
- to activate backend: cd flaskserver, python server.py
- to activate frontend: cd client, npm run dev
