# ✨️ ConnectHub

A social **discovery platform** where users can post about their current passions — ranging from books, films, and art to travel, languages, music, and culture — and find like-minded people.

Users can browse interest-based posts, **connect** with individuals they'd like to chat with, and **control** which contact details or social profiles they reveal to move conversations to external platforms.

---

## Tech Stack

* **Frontend**: React, TypeScript, Tailwind CSS
* **UI Components**: shadcn/ui
* **Backend**: NestJS, TypeScript
* **Database**: PostgreSQL (Neon DB)

---

## Features

* **Interest-Based Posts**: Share and browse topics across various categories (e.g., books, art, travel, languages, music, culture).
* **Social Discovery**: Search and discover other users sharing similar interests.
* **Selective Profile Sharing**: User-controlled visibility for sharing contact information and social links with chosen connections.
* **Modern Interface**: Clean, accessible UI components built with shadcn/ui.

---

## Quickstart

### 1. Clone the repository
```bash
git clone https://github.com/sinadzeya/Internship-SOFTTECO-2026.git
cd Week_9_ConnectHub/connect-hub
```

### 2. Set up environment variables
Copy the `.env.example` file to create your own `.env` configuration file:

```env
# Server
PORT=3000

# Database
DATABASE_URL=
DATABASE_URL_POOLED=

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Run the local environment
Navigate to the connect-hub directory and start the application containers:
```bash
docker-compose up --build
```