# Members Only (Relyful's Club)

This is an **Express.js** project built for _The Odin Project_. It uses **Passport.js** for authentication and **express-session** with a **PostgreSQL** database to manage user sessions.

## User Roles

The application supports three levels of access:

- **Registered User**
- **Member**
- **Admin**

Content visibility depends on the user's current role. Admin can delete messages.

## Features

- User registration and login with secure password hashing  
- Authentication with Passport.js (Local Strategy)  
- Session persistence using PostgreSQL and `connect-pg-simple`  
- Role-based access control using secret codes  
- EJS templating engine

## Installation

### 1. Clone the repository


### 2. Install dependencies

    npm install

### 3. Set up environment variables

    cp .env.example .env

Then set up environment variables

### 4. Set up the PostgreSQL database

Create database with any name you've chosen and then run my database setup
script which will use .env variables to create all needed tables for you.

    node db/populatedb.js

### 5. Run the development server

    npm run dev

## Usage

- Register an account
- Log in
- Use secret codes to upgrade to member/admin
- Admins can view all messages and manage content

## Tech Stack

- Node.js  
- Express.js  
- PostgreSQL  
- Passport.js  
- EJS  
- connect-pg-simple  
- dotenv
- bcrypt

## License

This project is open-source and available under the MIT License.