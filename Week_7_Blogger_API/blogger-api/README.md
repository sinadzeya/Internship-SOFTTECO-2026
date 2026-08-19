# 📱 Blogger API

API built with **NestJS**, **TypeORM**, and **PostgreSQL** that allows users to register, log in, and manage their blog posts. Access to post creation, update, and deletion is secured using JSON Web Tokens (JWT).

---

## Tech Stack

* **Framework**: NestJS
* **Database**: PostgreSQL
* **ORM**: TypeORM
* **Authentication**: Passport-JWT & Bcrypt
* **Containerization**: Docker & Docker Compose

---

## Features

* **User Authentication**: Registration and Login using hashed passwords (`bcrypt`).
* **JWT Authorization**: Secured endpoints for managing user posts.
* **Post Management**: Full CRUD capabilities for blog posts (Users can only update/delete their own posts).
* **Validation**: Request payload validation using `class-validator`.
* **Testing**: Unit tests for services and controllers using **Jest**.
* **Containerization**: Fully containerized with **Docker** and orchestrated via **Docker Compose**.

---

## Quickstart

### 1. Clone the repository
```bash
git clone https://github.com/sinadzeya/Internship-SOFTTECO-2026.git
cd Week_7_Blogger_API/blogger-api
```

### 2. Set up environment variables
Copy the `.env.example` file to create your own `.env` configuration file:

```env
# Server
PORT=3000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Run the local environment
Navigate to the blogger-api directory and start the application containers:
```bash
docker-compose up --build
```