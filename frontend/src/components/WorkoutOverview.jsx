function WorkoutOverview({ workouts, startEditWorkout, deleteWorkout }) {
  return (
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

              <button onClick={() => startEditWorkout(workout)}>Edit</button>
              <button onClick={() => deleteWorkout(workout._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default WorkoutOverview;