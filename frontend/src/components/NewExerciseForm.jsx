import { useState } from "react";

function NewExerciseForm({
  API_URL,
  exerciseMenu,
  setExerciseMenu,
  exerciseMessage,
  setExerciseMessage
}) {
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newMuscleGroup, setNewMuscleGroup] = useState("");
  const [newEquipment, setNewEquipment] = useState("");

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

  return (
    <>
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
  );
}

export default NewExerciseForm;