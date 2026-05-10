import { useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerAge, setRegisterAge] = useState("");
  const [registerWeight, setRegisterWeight] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const exerciseMenu = [
    "Bench Press", "Incline Bench Press", "Push Ups", "Chest Fly",
    "Shoulder Press", "Lateral Raises", "Front Raises", "Tricep Pushdown",
    "Tricep Dips", "Bicep Curls", "Hammer Curls", "Pull Ups",
    "Lat Pulldown", "Seated Row", "Barbell Row", "Deadlift",
    "Squat", "Leg Press", "Lunges", "Leg Extension",
    "Leg Curl", "Calf Raises", "Hip Thrust", "Glute Bridge",
    "Plank", "Crunches", "Russian Twists", "Mountain Climbers",
    "Burpees", "Running"
  ];

  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState("");
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [exercises, setExercises] = useState([]);
  const [message, setMessage] = useState("");

  async function login(e) {
    e.preventDefault();
    setLoginMessage("");

    try {
      const res = await fetch("http://127.0.0.1:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error(error);
      setLoginMessage("Could not connect to server.");
    }
  }

  async function register(e) {
    e.preventDefault();
    setRegisterMessage("");

    try {
      const res = await fetch("http://127.0.0.1:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
          age: Number(registerAge),
          weight: Number(registerWeight)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setRegisterMessage(data.message || "Register failed");
        return;
      }

      setRegisterMessage("Account created successfully. You can now log in.");
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
      setRegisterAge("");
      setRegisterWeight("");
    } catch (error) {
      console.error(error);
      setRegisterMessage("Could not connect to server.");
    }
  }

  function logout() {
    localStorage.removeItem("loggedInUser");
    setUser(null);
  }

  const filteredExercises = exerciseMenu.filter((exercise) =>
    exercise.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  function addExercise() {
    if (!exerciseMenu.includes(exerciseSearch)) {
      setMessage("Please select an exercise from the menu.");
      return;
    }

    if (Number(sets) < 1 || Number(sets) > 10) {
      setMessage("Sets must be between 1 and 10.");
      return;
    }

    if (Number(reps) < 1 || Number(reps) > 100) {
      setMessage("Reps must be between 1 and 100.");
      return;
    }

    if (Number(weight) < 1) {
      setMessage("Please enter a valid weight.");
      return;
    }

    const newExercise = {
      name: exerciseSearch,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight)
    };

    setExercises([...exercises, newExercise]);
    setExerciseSearch("");
    setSets("");
    setReps("");
    setWeight("");
    setMessage("");
  }

  async function addWorkout(e) {
    e.preventDefault();

    const workout = {
      userId: user._id,
      name: workoutName,
      date: workoutDate,
      exercises
    };

    try {
      const res = await fetch("http://127.0.0.1:3000/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(workout)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error adding workout");
        return;
      }

      setMessage("Workout added successfully!");
      setWorkoutName("");
      setWorkoutDate("");
      setExercises([]);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to server.");
    }
  }

  if (!user) {
    return (
      <div className="page">
        <div className="login-container">
          <div className="card">
            <h1>Gym Tracker</h1>
            <p>Log in to continue</p>

            <form onSubmit={login}>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />

              <button type="submit">Log In</button>
            </form>

            <p className="error">{loginMessage}</p>
          </div>

          <div className="card">
            <h2>Create Account</h2>
            <p>Don’t have an account yet? Register here.</p>

            <form onSubmit={register}>
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />

              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />

              <label>Age</label>
              <input
                type="number"
                placeholder="Enter your age"
                value={registerAge}
                onChange={(e) => setRegisterAge(e.target.value)}
                required
              />

              <label>Weight</label>
              <input
                type="number"
                placeholder="Enter your weight in kg"
                value={registerWeight}
                onChange={(e) => setRegisterWeight(e.target.value)}
                required
              />

              <button type="submit">Register</button>
            </form>

            <p>{registerMessage}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <div>
          <h1>Welcome, {user.name}!</h1>

          <div className="info-grid">
            <div className="info-box">
              <div className="info-label">Name</div>
              <div className="info-value">{user.name}</div>
            </div>

            <div className="info-box">
              <div className="info-label">Email</div>
              <div className="info-value">{user.email}</div>
            </div>

            <div className="info-box">
              <div className="info-label">Age</div>
              <div className="info-value">{user.age}</div>
            </div>

            <div className="info-box">
              <div className="info-label">Weight</div>
              <div className="info-value">{user.weight} kg</div>
            </div>
          </div>

          <hr />

          <h2>Add Workout</h2>

          <form onSubmit={addWorkout}>
            <label>Workout Name</label>
            <input
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              required
            />

            <label>Date</label>
            <input
              type="date"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
              required
            />

            <h3>Workout</h3>

            <label>Search Exercise</label>
            <input
              value={exerciseSearch}
              onChange={(e) => setExerciseSearch(e.target.value)}
              placeholder="Search exercise..."
            />

            {exerciseSearch && (
              <div className="suggestions">
                {filteredExercises.map((exercise) => (
                  <div
                    key={exercise}
                    className="suggestion-item"
                    onClick={() => setExerciseSearch(exercise)}
                  >
                    {exercise}
                  </div>
                ))}
              </div>
            )}

            <div className="exercise-row">
              <div>
                <label>Sets</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                />
              </div>

              <div>
                <label>Reps</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                />
              </div>

              <div>
                <label>Weight kg</label>
                <input
                  type="number"
                  min="1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>

            <button type="button" onClick={addExercise}>
              Add Exercise
            </button>

            <ul>
              {exercises.map((exercise, index) => (
                <li key={index}>
                  {exercise.name} - {exercise.sets} sets x {exercise.reps} reps - {exercise.weight} kg
                </li>
              ))}
            </ul>

            <button type="submit">Add Workout</button>
          </form>

          <p>{message}</p>
        </div>

        <div className="logout-area">
          <button onClick={logout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default App;