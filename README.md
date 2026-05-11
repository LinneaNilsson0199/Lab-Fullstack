# Lab-Fullstack
Gym Tracker is a fullstack web application built with React, Express, and MongoDB. The purpose of the application is to help users keep track of their workouts, exercises, sets, reps, and weights in one place. Users can create an account, log in, manage their personal information, and store workout history over time. The project was created for the DA219B Fullstack Lab assignment.

To run the project locally, the backend dependencies must first be installed using:
npm install

To install concurrently run:
npm install concurrently --save-dev

To start frontend and backend run:
npm run dev

The backend server runs on http://localhost:3000, while the React frontend runs on http://localhost:5173.

A .env file must also be created in the backend root folder containing the MongoDB Atlas connection string and the server port:
MONGO_URI=your_mongodb_connection_string
PORT=3000