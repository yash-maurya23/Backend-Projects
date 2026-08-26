# Blog API

A RESTful Blog API built with **Node.js, Express.js, MongoDB, JWT, and Cloudinary**.

The project provides APIs for user authentication, blog post management, comments, and media uploads while following a modular backend architecture.

## Features

- User registration and login
- JWT authentication with access & refresh tokens
- Protected routes and authorization middleware
- Create, read, update and delete blog posts
- Comments and nested replies
- Image uploads using Multer and Cloudinary
- MongoDB database with Mongoose
- Centralized error handling
- Standardized API responses
- Modular MVC-style backend structure

## Tech Stack

**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Authentication:** JWT, Cookies  
**Media:** Multer, Cloudinary  
**Tools:** Git, GitHub, Postman

## Architecture

```text
Client
  ↓
Express Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Mongoose Models
  ↓
MongoDB
