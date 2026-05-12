import { useEffect, useState } from "react";
import "./App.css";

import AuthPage from "./components/AuthPage";
import ProfileInfo from "./components/ProfileInfo";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutOverview from "./components/WorkoutOverview";
import NewExerciseForm from "./components/NewExerciseForm";

const API_URL = "http://localhost:3000";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [currentPage, setCurrentPage] = useState("profile");

  const [exerciseMenu, setExerciseMenu] = useState([]);
  const [workouts, setWorkouts] = useState([]);

  const [editingWorkoutId, setEditingWorkoutId] = useState(null);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState("");
  const [exercises, setExercises] = useState([]);

  const [message, setMessage] = useState("");
  const [exerciseMessage, setExerciseMessage] = useState("");

  // AUTO REFRESH
  useEffect(() => {
    if (!user) return;

    fetchExercises();
    fetchWorkouts();

    const interval = setInterval(() => {
      fetchWorkouts();
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  async function fetchExercises() {
    try {
      const res = await fetch(`${API_URL}/exercises`);
      const data = await res.json();

      if (!res.ok) {
        setExerciseMessage(data.message || "Could not load exercises");
        return;
      }

      setExerciseMenu(data);
    } catch (error) {
      console.error(error);
      setExerciseMessage("Could not connect to server.");
    }
  }

  async function fetchWorkouts() {
    if (!user?._id) return;

    try {
      const res = await fetch(`${API_URL}/workouts/${user._id}`);
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Could not load workouts");
        return;
      }

      setWorkouts(data);
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to server.");
    }
  }

  function logout() {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    setWorkouts([]);
    setExercises([]);
    setEditingWorkoutId(null);
    setCurrentPage("profile");
  }

  function startEditWorkout(workout) {
    setEditingWorkoutId(workout._id);
    setWorkoutName(workout.name);
    setWorkoutDate(workout.date?.slice(0, 10) || "");
    setExercises(workout.exercises || []);
    setCurrentPage("profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditWorkout() {
    setEditingWorkoutId(null);
    setWorkoutName("");
    setWorkoutDate("");
    setExercises([]);
    setMessage("");
  }

  async function deleteWorkout(workoutId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workout?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/workouts/${workoutId}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Could not delete workout");
        return;
      }

      setWorkouts(workouts.filter((workout) => workout._id !== workoutId));
      setMessage("Workout deleted successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to server.");
    }
  }

  if (!user) {
    return <AuthPage API_URL={API_URL} setUser={setUser} />;
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Welcome, {user.name}!</h1>

        <div className="page-buttons">
          <button onClick={() => setCurrentPage("profile")}>Profile</button>
          <button onClick={() => setCurrentPage("overview")}>Overview</button>
        </div>

        {currentPage === "profile" && (
          <>
            <ProfileInfo
              API_URL={API_URL}
              user={user}
              setUser={setUser}
              message={message}
              setMessage={setMessage}
            />

            <hr />

            <WorkoutForm
              API_URL={API_URL}
              user={user}
              exerciseMenu={exerciseMenu}
              fetchWorkouts={fetchWorkouts}
              editingWorkoutId={editingWorkoutId}
              setEditingWorkoutId={setEditingWorkoutId}
              workoutName={workoutName}
              setWorkoutName={setWorkoutName}
              workoutDate={workoutDate}
              setWorkoutDate={setWorkoutDate}
              exercises={exercises}
              setExercises={setExercises}
              message={message}
              setMessage={setMessage}
              cancelEditWorkout={cancelEditWorkout}
            />

            <hr />

            <NewExerciseForm
              API_URL={API_URL}
              exerciseMenu={exerciseMenu}
              setExerciseMenu={setExerciseMenu}
              exerciseMessage={exerciseMessage}
              setExerciseMessage={setExerciseMessage}
            />
          </>
        )}

        {currentPage === "overview" && (
          <WorkoutOverview
            workouts={workouts}
            startEditWorkout={startEditWorkout}
            deleteWorkout={deleteWorkout}
          />
        )}

        <div className="logout-area">
          <button onClick={logout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default App;