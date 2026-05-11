# Lab-Fullstack
Gym Tracker is a fullstack web application built with React, Express, and MongoDB. The purpose of the application is to help users keep track of their workouts, exercises, sets, reps, and weights in one place. Users can create an account, log in, manage their personal information, and store workout history over time. The project was created for the DA219B Fullstack Lab assignment.

The application is built using React with Vite on the frontend and Express.js on the backend. MongoDB Atlas is used as the cloud database, and Mongoose is used to define schemas, relationships, and validation rules. All sensitive information such as database connection strings is stored in a 
.env file, following the assignment requirements.

The system contains three main collections in MongoDB: users, workouts, and exercises. Relationships between collections are handled using MongoDB ObjectId references. For example, every workout is connected to a specific user through the userId field. The workout documents also contain exercise information such as exercise name, sets, reps, and weight.

Users can register an account with their name, email, password, age, and weight. After logging in, users can edit their profile information directly from the application. The app also allows users to create workouts by selecting exercises and adding sets, reps, and weights. Workouts can later be updated or deleted through the workout overview page. In addition, users can create custom exercises and search through existing exercises using the search functionality.

The backend API implements full CRUD functionality for workouts, including creating, reading, updating, and deleting workout documents. The API also includes routes for users and exercises. Error handling is implemented throughout the backend using proper HTTP status codes and JSON responses. Validation is handled with Mongoose to ensure that required fields, types, and value ranges are correct.

The frontend is built with React using controlled form inputs and React hooks such as useState and useEffect. The user interface displays workout information in structured lists and provides forms for creating and updating data. The application also includes interactive features such as exercise search and workout overview navigation.

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