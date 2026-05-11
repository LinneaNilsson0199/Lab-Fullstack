import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:3000";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [currentPage, setCurrentPage] = useState("profile");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerAge, setRegisterAge] = useState("");
  const [registerWeight, setRegisterWeight] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");

  const [exerciseMenu, setExerciseMenu] = useState([]);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newMuscleGroup, setNewMuscleGroup] = useState("");
  const [newEquipment, setNewEquipment] = useState("");
  const [exerciseMessage, setExerciseMessage] = useState("");

  const [workouts, setWorkouts] = useState([]);
  const [editingWorkoutId, setEditingWorkoutId] = useState(null);

  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState("");
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [exercises, setExercises] = useState([]);
  const [message, setMessage] = useState("");

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileAge, setProfileAge] = useState(user?.age || "");
  const [profileWeight, setProfileWeight] = useState(user?.weight || "");

  useEffect(() => {
    if (user) {
      fetchExercises();
      fetchWorkouts();
      setProfileAge(user.age);
      setProfileWeight(user.weight);
    }
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

  async function login(e) {
    e.preventDefault();
    setLoginMessage("");

    try {
      const res = await fetch(`${API_URL}/login`, {
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
      setCurrentPage("profile");
    } catch (error) {
      console.error(error);
      setLoginMessage("Could not connect to server.");
    }
  }

  async function register(e) {
    e.preventDefault();
    setRegisterMessage("");

    try {
      const res = await fetch(`${API_URL}/register`, {
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
    setWorkouts([]);
    setExercises([]);
    setEditingWorkoutId(null);
    setCurrentPage("profile");
  }

  async function updateProfile(e) {
    e.preventDefault();

    console.log("Save Profile clicked");

    setMessage("");

    try {
      const res = await fetch(`${API_URL}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          age: Number(profileAge),
          weight: Number(profileWeight)
        })
      });

      const data = await res.json();

      console.log("Status:", res.status);
      console.log("Data:", data);

      if (!res.ok) {
        setMessage(data.message || "Could not update profile");
        return;
      }

      const updatedUser = {
        ...user,
        age: data.age ?? Number(profileAge),
        weight: data.weight ?? Number(profileWeight)
      };

      setUser(updatedUser);

      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      setEditingProfile(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to server.");
    }
  }

  const filteredExercises = exerciseMenu.filter((exercise) =>
    exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  async function addNewExercise(e) {
    e.preventDefault();
    setExerciseMessage("");

    try {
      const res = await fetch(`${API_URL}/exercises`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newExerciseName,
          muscleGroup: newMuscleGroup,
          equipment: newEquipment
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setExerciseMessage(data.message || "Could not add exercise");
        return;
      }

      setExerciseMenu([...exerciseMenu, data]);
      setExerciseMessage("Exercise added successfully!");

      setNewExerciseName("");
      setNewMuscleGroup("");
      setNewEquipment("");
    } catch (error) {
      console.error(error);
      setExerciseMessage("Could not connect to server.");
    }
  }

  function addExercise() {
    const selectedExercise = exerciseMenu.find(
      (exercise) => exercise.name === exerciseSearch
    );

    if (!selectedExercise) {
      setMessage("Please select an exercise from the menu.");
      return;
    }

    if (Number(sets) < 1 || Number(sets) > 100) {
      setMessage("Sets must be between 1 and 100.");
      return;
    }

    if (Number(reps) < 1 || Number(reps) > 100) {
      setMessage("Reps must be between 1 and 100.");
      return;
    }

    if (Number(weight) < 0) {
      setMessage("Please enter a valid weight.");
      return;
    }

    const newExercise = {
      exerciseId: selectedExercise._id,
      name: selectedExercise.name,
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

  function removeExerciseFromWorkout(indexToRemove) {
    setExercises(exercises.filter((_, index) => index !== indexToRemove));
  }

  async function addWorkout(e) {
    e.preventDefault();
    setMessage("");

    if (exercises.length === 0) {
      setMessage("Please add at least one exercise.");
      return;
    }

    const workout = {
      userId: user._id,
      name: workoutName,
      date: workoutDate,
      exercises
    };

    try {
      const url = editingWorkoutId
        ? `${API_URL}/workouts/${editingWorkoutId}`
        : `${API_URL}/workouts`;

      const method = editingWorkoutId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(workout)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error saving workout");
        return;
      }

      setMessage(
        editingWorkoutId
          ? "Workout updated successfully!"
          : "Workout added successfully!"
      );

      setWorkoutName("");
      setWorkoutDate("");
      setExercises([]);
      setEditingWorkoutId(null);

      fetchWorkouts();
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to server.");
    }
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

      setWorkouts(workouts.filter((w) => w._id !== workoutId));
      setMessage("Workout deleted successfully!");
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

            <form onSubmit={login}>
              <label>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />

              <label>Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />

              <button type="submit">Log In</button>
            </form>

            <p>{loginMessage}</p>
          </div>

          <div className="card">
            <h2>Create Account</h2>

            <form onSubmit={register}>
              <label>Name</label>
              <input
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                required
              />

              <label>Email</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
              />

              <label>Password</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />

              <label>Age</label>
              <input
                type="number"
                value={registerAge}
                onChange={(e) => setRegisterAge(e.target.value)}
                required
              />

              <label>Weight</label>
              <input
                type="number"
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
        <h1>Welcome, {user.name}!</h1>

        <div className="page-buttons">
          <button onClick={() => setCurrentPage("profile")}>Profile</button>

          <button onClick={() => setCurrentPage("overview")}>Overview</button>
        </div>

        {currentPage === "profile" && (
          <>
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

                {editingProfile ? (
                  <input
                    type="number"
                    value={profileAge}
                    onChange={(e) => setProfileAge(e.target.value)}
                  />
                ) : (
                  <div className="info-value">{user.age}</div>
                )}
              </div>

              <div className="info-box">
                <div className="info-label">Weight</div>

                {editingProfile ? (
                  <input
                    type="number"
                    value={profileWeight}
                    onChange={(e) => setProfileWeight(e.target.value)}
                  />
                ) : (
                  <div className="info-value">{user.weight} kg</div>
                )}
              </div>
            </div>

            {editingProfile ? (
              <form onSubmit={updateProfile} className="profile-actions">
                <button type="submit">Save Profile</button>

                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button onClick={() => setEditingProfile(true)}>
                Edit Age / Weight
              </button>
            )}

            <p>{message}</p>

            <hr />

            <h2>{editingWorkoutId ? "Edit Workout" : "Add Workout"}</h2>

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
                      key={exercise._id}
                      className="suggestion-item"
                      onClick={() => setExerciseSearch(exercise.name)}
                    >
                      {exercise.name}
                    </div>
                  ))}
                </div>
              )}

              <div className="exercise-row">
                <div>
                  <label>Sets</label>

                  <input
                    type="number"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                  />
                </div>

                <div>
                  <label>Reps</label>

                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                  />
                </div>

                <div>
                  <label>Weight</label>

                  <input
                    type="number"
                    min="0"
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
                    {exercise.name} - {exercise.sets} sets x {exercise.reps}{" "}
                    reps - {exercise.weight} kg
                    <button
                      type="button"
                      onClick={() => removeExerciseFromWorkout(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>

              <button type="submit">
                {editingWorkoutId ? "Update Workout" : "Add Workout"}
              </button>

              {editingWorkoutId && (
                <button type="button" onClick={cancelEditWorkout}>
                  Cancel Edit
                </button>
              )}
            </form>

            <hr />

            <h2>Add New Exercise</h2>

            <form onSubmit={addNewExercise}>
              <label>Exercise Name</label>

              <input
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                required
              />

              <label>Muscle Group</label>

              <input
                value={newMuscleGroup}
                onChange={(e) => setNewMuscleGroup(e.target.value)}
                required
              />

              <label>Equipment</label>

              <input
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
                required
              />

              <button type="submit">Add Exercise</button>
            </form>

            <p>{exerciseMessage}</p>
          </>
        )}

        {currentPage === "overview" && (
          <>
            <h2>Workout Overview</h2>

            {workouts.length === 0 ? (
              <p>No workouts yet.</p>
            ) : (
              <div className="workout-list">
                {workouts.map((workout) => (
                  <div className="workout-card" key={workout._id}>
                    <h3>{workout.name}</h3>

                    <p>{workout.date?.slice(0, 10)}</p>

                    <ul>
                      {workout.exercises?.map((exercise, index) => (
                        <li key={index}>
                          {exercise.name} - {exercise.sets} x {exercise.reps} -{" "}
                          {exercise.weight} kg
                        </li>
                      ))}
                    </ul>

                    <button onClick={() => startEditWorkout(workout)}>
                      Edit
                    </button>

                    <button onClick={() => deleteWorkout(workout._id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="logout-area">
          <button onClick={logout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default App;