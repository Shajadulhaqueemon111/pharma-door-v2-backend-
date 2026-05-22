📦 PharmaDoor Backend
🧾 Introduction
PharmaDoor is a modern, feature-rich backend application built for an online pharmacy platform. It allows users to browse medicines, place orders, and get them delivered to their doorstep. This repository contains the backend/server-side code developed using Node.js, Express.js, and MongoDB, following RESTful API standards.

The backend is designed to handle user management, product (medicine) management, cart and order processing, secure authentication, and role-based access control for Admins, Users, and Pharmacists.

✅ Key Features (Modules Overview)
👥 User Management
User registration and login using JWT-based authentication

Role-based access control (Admin, User, Pharmacist)

Update user profile, reset password, and email verification (optional)

💊 Medicine/Product Management
Add, update, delete medicines (CRUD operations)

Filter medicines by category and brand

Manage stock quantity, discounts, and expiry dates

🛒 Cart & Order System
Add/remove medicines from cart

Place orders and view order history

Manage order status (Pending → Processing → Delivered)

💳 Payment Integration
Integration with SSLCommerz or Stripe (as needed)

Handle success/failure payment callbacks

Mark orders as paid or failed

📦 Delivery & Shipping
Manage delivery status for each order

Save and update shipping address

📊 Admin Dashboard & Analytics
View total sales, total users, and order stats

List of low-stock medicines

Daily/Monthly sales tracking (if implemented)

🔐 Authentication & Authorization
Secure login using bcrypt password hashing

Access and refresh token generation using JWT

Middleware to protect routes based on user roles

🧩 Others
MongoDB database with Mongoose ODM

Environment management using .env and dotenv

Input validation using Zod

Global error handling middleware

Modular folder structure following MVC pattern

🛠 Technologies Used
Node.js, Express.js

MongoDB, Mongoose

JWT, bcrypt

Zod, dotenv

CORS, Stripe or SSLCommerz (optional)
