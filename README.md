# Gainsly API

Backend API for the Gainsly fitness tracking application.

## Features

- User authentication (register, login, refresh token, logout)
- JWT-based authentication with refresh tokens
- User profile management
- Password change functionality
- MongoDB database integration
- Error handling middleware
- Security features (helmet, CORS)

## Tech Stack

- Node.js with Express
- TypeScript for type safety
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Helmet for security headers
- CORS for cross-origin requests
- Morgan for request logging

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/gainsly.git
   cd gainsly/gainsly-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/gainsly
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
   NODE_ENV=development
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Scripts

- `npm run dev`: Start the development server with hot reloading
- `npm run build`: Build the TypeScript code
- `npm start`: Start the production server

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
  - Request body: `{ name, email, password }`
  - Response: `{ success, user, token, refresh_token }`

- `POST /api/auth/login`: Login a user
  - Request body: `{ email, password }`
  - Response: `{ success, user, token, refresh_token }`

- `POST /api/auth/refresh`: Refresh access token
  - Request body: `{ refresh_token }`
  - Response: `{ success, token, refresh_token }`

- `POST /api/auth/logout`: Logout a user
  - Request body: `{ refresh_token }`
  - Response: `{ success, message }`

- `GET /api/auth/me`: Get current user (protected)
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success, user }`

### User Management

- `PUT /api/users/profile`: Update user profile (protected)
  - Headers: `Authorization: Bearer <token>`
  - Request body: `{ name, profilePicture }`
  - Response: `{ success, user }`

- `PUT /api/users/password`: Change password (protected)
  - Headers: `Authorization: Bearer <token>`
  - Request body: `{ oldPassword, newPassword }`
  - Response: `{ success, message }`

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── utils/          # Utility functions
└── index.ts        # Entry point
```

## Error Handling

The API uses a centralized error handling mechanism with custom error classes. All errors are properly formatted and returned with appropriate HTTP status codes.

## Security

- JWT tokens with expiration
- Refresh token rotation
- Password hashing with bcrypt
- Helmet for security headers
- CORS configuration
- Environment variables for sensitive data

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Running Both Servers

To run both the backend API and the frontend app concurrently, you can use one of the following methods:

### Using Node.js Script

```bash
npm run dev:all
```

This will start both servers in the same terminal window with color-coded output. Press Ctrl+C once to gracefully shut down both servers.

The script will automatically:
- Check if dependencies are installed and install them if needed
- Start the backend using nodemon and ts-node
- Start the frontend using Expo
- Handle graceful shutdown of both servers

### Using Shell Script (macOS/Linux)

```bash
./start-dev.sh
```

This will start both servers in the background. Press Ctrl+C to gracefully shut down both servers.

### Using Batch Script (Windows)

```bash
start-dev.bat
```

This will start both servers in separate command prompt windows. Close the windows or press Ctrl+C in each window to stop the servers. 