# Full-Stack Authentication Application

A clean, modern, full-stack web application featuring a complete Login and Signup flow. Built with React, Node.js, Express, and MongoDB.

## Features Implemented
- **User Authentication Flow**: Seamless toggle between Login and Signup modes.
- **RESTful API**: Secure backend endpoints for handling user creation (`/api/signup`) and authentication (`/api/login`).
- **Zero-Config Local Database**: Integrates `mongodb-memory-server` to automatically spin up a temporary local MongoDB instance for instant testing without requiring a system-level database installation.
- **Dynamic Feedback**: Real-time loading states, success alerts, and error handling for invalid credentials or network issues.
- **Production Ready**: Fully refactored and optimized for zero-config Serverless deployment on Vercel.

## Tech Stack Used
- **Frontend**: React (via Vite)
- **Backend**: Node.js & Express
- **Database**: MongoDB (via Mongoose)
- **Styling**: Vanilla CSS (Modern, Responsive aesthetics)
- **Deployment**: Vercel (Serverless Functions + Static Build)

## Setup Steps

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. 

### 2. Installation
Clone the repository and install all necessary dependencies for both the frontend and backend.
```bash
git clone https://github.com/Shubhz20/Login-Window-Application.git
cd Login-Window-Application
npm install
```

### 3. Running Locally
Start the local development server. This will spin up the Vite frontend and automatically start the Express backend API.
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`. 

*Note: The local backend uses an in-memory MongoDB database and will automatically seed a test user (`test@example.com` / `password123`) on startup for quick testing!*

### 4. Production Deployment (Vercel)
This repository is pre-configured for Vercel. Simply import the repository into your Vercel dashboard. 
- Leave the **Root Directory** setting blank (default).
- Add a real MongoDB Atlas connection string in the Vercel Environment Variables as `MONGODB_URI` to enable permanent database storage in production.
