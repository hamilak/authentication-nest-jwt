# NestJS Authentication and Authorization System

## Overview

This project is a full authentication and authorization system built using NestJS. It includes user registration, login, role-based access control, and token-based authentication. The system is designed to be extensible and modular, following best practices in NestJS development.

## Project Structure

The project is organized into several key directories and files:

- `src/app.module.ts`: The root module of the application, configuring and importing other modules.
- `src/auth`: Contains authentication-related components, including guards and strategies.
- `src/config`: Database Configuration files.
- `src/email`: Email service and related components.
- `src/enums`: Enum definitions used throughout the application.
- `src/main.ts`: The entry point of the application.
- `src/migrations`: Database migration files.
- `src/user`: User-related entities, services, and controllers.

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file based on the `.env.example` file and configure the environment variables.

4. Run database migrations:

    ```bash
    npm run migration:run
    ```

## Running the Application

1. Start the application in development mode:

    ```bash
    npm run start:dev
    ```

2. Build the application for production:

    ```bash
    npm run build
    ```

3. Start the application in production mode:

    ```bash
    npm run start:prod
    ```

## Features

- **User Registration**: Users can register with email and password. Passwords are hashed using bcrypt.
- **User Login**: Users can log in using their email and password. Tokens are generated for authenticated sessions.
- **Role-Based Access Control**: Supports roles such as Admin, SuperAdmin, and User. Access to routes is controlled based on user roles.
- **Password Reset**: Users can reset their passwords using a token sent to their email.
- **Token Management**: Includes access and refresh tokens for session management.
- **Email Service**: Integrated email service for sending registration and password reset emails.

## API Endpoints

### Authentication

- **POST /auth/login**: Logs in a user and returns access and refresh tokens.
- **POST /auth/logout**: Logs out a user by invalidating their tokens.
- **POST /auth/refresh**: Refreshes the access token using a valid refresh token.

### Users

- **POST /users**: Registers a new user. Admins can specify roles.
- **GET /users/:id**: Retrieves user information by ID.
- **PUT /users/:id**: Updates user information by ID.
- **DELETE /users/:id**: Deletes a user by ID.

### Password Reset

- **POST /forgot-password**: Initiates a password reset process and sends a reset link via email.
- **POST /password-reset/:token**: Confirms the password reset using a token.

