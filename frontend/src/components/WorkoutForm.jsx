import { useState } from "react";

function WorkoutForm({
  API_URL,
  user,
  exerciseMenu,
  fetchWorkouts,
  editingWorkoutId,
  setEditingWorkoutId,
  workoutName,
  setWorkoutName,
  workoutDate,
  setWorkoutDate,
  exercises,
  setExercises,
  message,
  setMessage,
  cancelEditWorkout
}) {
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  const filteredExercises = exerciseMenu.filter((exercise) =>
    exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

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

  async function saveWorkout(e) {
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

  return (
    <>
      <h2>{editingWorkoutId ? "Edit Workout" : "Add Workout"}</h2>

      <form onSubmit={saveWorkout}>
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
              {exercise.name} - {exercise.sets} sets x {exercise.reps} reps -{" "}
              {exercise.weight} kg
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

      <p>{message}</p>
    </>
  );
}

export default WorkoutForm;