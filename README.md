# ConvoSphere (Backend)

A secure and scalable backend service for the ConvoSphere chat application, built with Node.js, Express, bcrypt, jsonwebtoken, and PostgreSQL.

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Introduction

ConvoSphere(Backend) is the backend service for the ConvoSphere chat application. It handles authentication, user management, and database interactions, ensuring a secure and efficient chat experience.

---

## Features

- **User Authentication**: Secure login and registration using bcrypt and JWT.
- **Real-Time Communication**: Provides APIs for real-time messaging.
- **PostgreSQL Integration**: A robust and scalable relational database.
- **Middleware**: Efficient request handling with Express middleware.
- **Development Convenience**: Nodemon for automatic server restarts during development.

---

## Tech Stack

- [Node.js](https://nodejs.org/): JavaScript runtime for server-side development.
- [Express.js](https://expressjs.com/): Fast and minimal web framework.
- [bcrypt](https://www.npmjs.com/package/bcrypt): Password hashing library.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): For secure token-based authentication.
- [PostgreSQL](https://www.postgresql.org/): Reliable and scalable database.
- [Nodemon](https://nodemon.io/): For seamless development experience.

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- A code editor (e.g., [VS Code](https://code.visualstudio.com/))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/FluttX/convo_sphere-app-backend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd convo_sphere-app-backend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_pg_user
   DB_PASSWORD=your_pg_password
   DB_NAME=convosphere
   JWT_SECRET=your_secret_key
   ```

5. Start the PostgreSQL server and create the database:
   ```sql
   CREATE DATABASE convosphere;
   ```

6. Run the server in development mode:
   ```bash
   npm run dev
   ```

---

## Project Structure

```
convo_sphere-app-backend/
├── controllers/    # Request handling logic
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── utils/          # Utility functions
├── .env            # Environment variables
├── server.js       # Entry point of the application
└── package.json    # Dependencies and scripts
```

---

## API Endpoints

### Authentication
- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Login and receive a JWT.

### Users
- **GET /api/users**: Retrieve a list of users.
- **GET /api/users/:id**: Retrieve user details by ID.

### Messages
- **POST /api/messages**: Send a new message.
- **GET /api/messages/:conversationId**: Retrieve messages by conversation ID.

---

## Contributing

We welcome contributions! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature name"
   ```
4. Push your branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
